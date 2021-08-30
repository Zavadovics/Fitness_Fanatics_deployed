import { loginService } from '../services/loginService.js';

export const loginController = {
  async post(req, res, next) {
    try {
      const data = await loginService.loginUser(req.body);
      res.header('auth-token', data.token).status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },
};
