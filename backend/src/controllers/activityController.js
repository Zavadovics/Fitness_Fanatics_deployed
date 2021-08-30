import Activity from '../models/Activity.js';
import { activityService } from '../services/activityService.js';

export const activityController = {
  async get(req, res, next) {
    const { id } = req.params;

    try {
      const data = await Activity.find({ user_id: id }).sort({ createdAt: -1 });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },

  async post(req, res, next) {
    const data = await activityService.saveActivity(req.body);

    try {
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },

  async getId(req, res, next) {
    const data = await Activity.findById(req.params.id);

    try {
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },

  async put(req, res, next) {
    const { id } = req.params;
    const reqData = req.body;
    const data = await activityService.updateActivity(id, reqData);

    try {
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    const { id } = req.params;
    const data = await activityService.deleteActivity(id);

    try {
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },
};
