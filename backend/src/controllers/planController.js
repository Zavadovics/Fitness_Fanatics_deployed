import Plan from '../models/Plan.js';
import { planService } from '../services/planService.js';

export const planController = {
  async get(req, res, next) {
    try {
      const data = await Plan.find().sort({ createdAt: -1 });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },

  async post(req, res, next) {
    const reqFile = req.file;
    const reqBody = req.body;

    try {
      const data = await planService.savePlan(reqFile, reqBody);

      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },
};
