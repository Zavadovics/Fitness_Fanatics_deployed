import City from '../models/City.js';

export const cityController = {
  async get(req, res, next) {
    try {
      const data = await City.find().sort({ name: 1 });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
};
