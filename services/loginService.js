import logger from '../logger.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginValidation } from '../validations/loginValidation.js';
import User from '../models/User.js';

export const loginService = {
  async loginUser(loginData) {
    const { error } = loginValidation(loginData);
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
      };
    }
    const user = await User.findOne({ email: loginData.email });

    if (!user) {
      return {
        status: 404,
        message: 'This e-mail address has not yet been registered',
      };
    }

    const validPass = await bcrypt.compare(loginData.password, user.password);

    if (!validPass) {
      return {
        status: 403,
        message: 'E-mail address or password is incorrect',
      };
    }

    try {
      const authToken = jwt.sign(
        {
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email,
          id: user._id,
        },
        process.env.TOKEN_SECRET
      );

      return {
        status: 200,
        token: authToken,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        id: user._id,
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Database error',
      };
    }
  },
};
