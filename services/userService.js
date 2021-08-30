import logger from '../logger.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { userValidation } from '../validations/userValidation.js';
import sendEmail from '../utils/sendEmail.js';

const createActivationToken = payload => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

export const userService = {
  async register(userData) {
    const { error } = userValidation(userData);
    if (error) {
      logger.error(error);
      return {
        status: 400,
        message: error.details[0].message,
      };
    }

    const emailExist = await User.findOne({ email: userData.email });
    if (emailExist)
      return {
        status: 409,
        message: 'Az általad megadott email cím már regisztrálva van',
      };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      lastName: userData.lastName,
      firstName: userData.firstName,
      email: userData.email,
      password: hashedPassword,
    };

    const activation_token = createActivationToken(newUser);

    const link = `${process.env.FRONTEND_URL}/user/activation/${activation_token}`;
    const emailData = {
      subject: 'Fitness Fanatics - fiók aktiválás',
      html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #1b468a">
        <div style="max-width: 700px; margin:auto; border: 4px solid #ffa561; padding: 50px 20px; font-size: 110%; text-align: center">
        <h2 style="color: #1b468a;">Üdvözöl a FITNESS FANATICS!</h2>
      <p style="padding: 40px 0 20px">Gratulálunk! Már csak egy lépésre vagy attól hogy használhasd a FITNESS FANATICS alkalmazást. Csak kattints az alábbi gombra az fiókod aktiválásához.
      </p>
      <a href=${link} style="background: #ffa561; color: #1b468a; text-decoration: none; padding: 10px 20px; letter-spacing: 2px; border-radius: 5px; font-size: 120%;">Aktiválás</a>
      <p style="padding: 20px 0">Ha valamiért a gomb nem működne, az alábbi linken keresztül is véglegesítheted regisztrációdat:</p>
  
      <div>${link}</div>
      </div>
      </div>
  `,
    };

    try {
      await sendEmail(newUser, emailData);
      return {
        status: 200,
        message:
          'A fiókod aktiválásához kérlek nyisd meg az e-mailt amit küldtünk',
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Adatbázis probléma',
      };
    }
  },

  async activateAccount(userData) {
    try {
      const { token } = userData;
      const user = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);
      console.log('user', user);
      const emailExist = await User.findOne({ email: user.email });
      if (emailExist)
        return {
          status: 409,
          message: 'Az általad megadott email cím már regisztrálva van',
        };

      const newUser = new User({
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        password: user.password,
      });

      await newUser.save();
      return {
        status: 201,
        message: `Sikeres fiók aktiválás. Máris átirányítunk a bejelentkezés oldalra`,
        user: user,
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 401,
        message:
          'Sajnos a fiókod aktiválására adott idő (15 perc) lejárt. Új regisztráció szükséges',
      };
    }
  },

  async updateUser(id, reqData) {
    const { _id, __v, updatedAt, createdAt, ...others } = reqData;
    const { error } = userValidation(others);

    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(reqData.password, salt);

    reqData.password = hashedPassword;
    try {
      const updatedUser = await User.findByIdAndUpdate(id, reqData, {
        useFindAndModify: false,
      });
      return {
        status: 200,
        message: `Sikeres mentés. Az adatokat hozzádtuk az adatbázishoz`,
        updatedUser: updatedUser,
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Adatbázis probléma',
      };
    }
  },

  async sendPasswordResetMail(reqData) {
    try {
      const user = await User.findOne({ email: reqData.email });

      if (!user)
        return {
          status: 400,
          message: 'A megadott e-mail címmel még nem regisztráltak',
        };

      const authToken = jwt.sign(
        {
          email: user.email,
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: '15m',
        }
      );

      const link = `${process.env.FRONTEND_URL}/password-reset/${user._id}/${authToken}`;
      const emailData = {
        subject: 'Fitness Fanatics - jelszócsere',
        html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #1b468a">
        <div style="max-width: 700px; margin:auto; border: 4px solid #ffa561; padding: 50px 20px; font-size: 110%; text-align: center">
        <h2 style="color: #1b468a;">Üdvözöl a FITNESS FANATICS!</h2>
      <p style="padding: 40px 0 20px;">Csak kattints az alábbi gombra és máris lecserélheted a jelszavad.
      </p>
      
      <a href=${link} style="background: #ffa561; color: #1b468a; text-decoration: none; padding: 10px 20px; display: block; margin: 0 auto; width: 100px; letter-spacing: 2px; border-radius: 5px; font-size: 120%">Új jelszó</a>
  
      <p style="padding: 20px 0">Ha valamiért a gomb nem működne, a linkre kattintva is kérhetsz új jelszót:</p>
  
      <div>${link}</div>
      </div>
      </div>
  `,
      };

      await sendEmail(user, emailData);
      return {
        status: 200,
        message:
          'A jelszó cseréjéhez kérlek nyisd meg az e-mailt amit küldtünk',
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Adatbázis probléma',
      };
    }
  },

  async resetPassword(id, token, reqData) {
    try {
      try {
        jwt.verify(token, process.env.TOKEN_SECRET);
      } catch (err) {
        logger.error(err);
        return {
          status: 401,
          message:
            'Sajnos a jelszó megváltoztatására adott idő (15 perc) lejárt',
        };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(reqData.password, salt);

      reqData.password = hashedPassword;

      await User.findByIdAndUpdate(id, reqData, {
        useFindAndModify: false,
      });
      return {
        status: 200,
        message:
          'A jelszó cseréje sikeresen megtörtént. Most már bejelentkezhetsz',
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'A jelszó cseréje nem sikerült',
      };
    }
  },
};
