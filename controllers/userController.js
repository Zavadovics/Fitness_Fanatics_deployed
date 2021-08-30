import User from '../models/User.js';
import { userService } from '../services/userService.js';

export const userController = {
  async get(req, res, next) {
    const { id } = req.params;

    try {
      const data = await User.findById(id);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },

  async post(req, res, next) {
    try {
      const data = await userService.register(req.body);
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },

  async activateUser(req, res, next) {
    try {
      const data = await userService.activateAccount(req.body);
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },

  async put(req, res, next) {
    const { id } = req.params;
    const reqData = req.body;

    try {
      const data = await userService.updateUser(id, reqData);
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },

  async sendPasswordResetMail(req, res, next) {
    try {
      const data = await userService.sendPasswordResetMail(req.body);
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req, res, next) {
    const { id, token } = req.params;
    const reqData = req.body;

    try {
      const data = await userService.resetPassword(id, token, reqData);
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },
};
