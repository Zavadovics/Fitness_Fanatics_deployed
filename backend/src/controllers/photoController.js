import Photo from '../models/Photo.js';
import { photoService } from '../services/photoService.js';

export const photoController = {
  async get(req, res, next) {
    try {
      await Photo.find({ user_id: req.params.id }).then(foundPhoto =>
        res.status(200).json(foundPhoto)
      );
    } catch (err) {
      next(err);
    }
  },

  async put(req, res, next) {
    const { id } = req.params;
    const reqFile = req.file;
    const reqBody = req.body;

    const data = await photoService.saveOrUpdatePhoto(id, reqFile, reqBody);

    try {
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    const { id } = req.params;

    try {
      await Photo.find({ user_id: req.params.id });
      const data = await photoService.deletePhoto(id);
      res.status(data.status).json(data);
    } catch (err) {
      next(err);
    }
  },
};
