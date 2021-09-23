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
        message: 'This e-mail address has already been registered',
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
      subject: 'Fitness Fanatics - account activation',
      html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #1b468a">
        <div style="max-width: 700px; margin:auto; border: 4px solid #ffa561; padding: 50px 20px; font-size: 110%; text-align: center">
        <h2 style="color: #1b468a;">Welcome to FITNESS FANATICS!</h2>
      <p style="padding: 40px 0 20px">Congrats! You're only one step away from using our app. Click the button below to activate your account!
      </p>
      <a href=${link} style="background: #ffa561; color: #1b468a; text-decoration: none; padding: 10px 20px; letter-spacing: 2px; border-radius: 5px; font-size: 120%;">Activate account</a>
      <p style="padding: 20px 0">In case the button doesn't work, you can also finalize your registration by clicking the link below.</p>
  
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
          'Please open the e-mail we have just sent you to activate your account',
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Database error',
      };
    }
  },

  async activateAccount(userData) {
    try {
      const { token } = userData;
      const user = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);

      const emailExist = await User.findOne({ email: user.email });
      if (emailExist)
        return {
          status: 409,
          message: 'This e-mail address has already been registered',
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
        message: `Successful activation. You are being redirected to our login page`,
        user: user,
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 401,
        message:
          'The time to activate your account (15 mins) has expired. New registration required',
      };
    }
  },

  async updateUser(id, reqData) {
    const {
      _id,
      __v,
      updatedAt,
      createdAt,
      userName,
      gender,
      cityOfResidence,
      weight,
      birthDate,
      motivation,
      ...others
    } = reqData;
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
        message: `Your information has been added to our database`,
        updatedUser: updatedUser,
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Database error',
      };
    }
  },

  async sendPasswordResetMail(reqData) {
    try {
      const user = await User.findOne({ email: reqData.email });

      if (!user)
        return {
          status: 400,
          message: 'This e-mail address has not yet been registered',
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
        subject: 'Fitness Fanatics - update password',
        html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #1b468a">
        <div style="max-width: 700px; margin:auto; border: 4px solid #ffa561; padding: 50px 20px; font-size: 110%; text-align: center">
        <h2 style="color: #1b468a;">Welcome to FITNESS FANATICS!</h2>
      <p style="padding: 40px 0 20px;">Just click the button below to change your password!
      </p>
      
      <a href=${link} style="background: #ffa561; color: #1b468a; text-decoration: none; padding: 10px 20px; display: block; margin: 0 auto; width: 100px; letter-spacing: 2px; border-radius: 5px; font-size: 120%">New password</a>
  
      <p style="padding: 20px 0">In case the button doesn't work, you can also change your password by clicking the link below:</p>
  
      <div>${link}</div>
      </div>
      </div>
  `,
      };

      await sendEmail(user, emailData);
      return {
        status: 200,
        message:
          'Please open the e-mail we have just sent you to change your password',
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Activation failed',
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
          message: 'The time to change your password (15 mins) has expired',
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
        message: 'Password has been updated. You can log in now',
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Password could not be changed',
      };
    }
  },
};
