import logger from '../logger.js';
import Photo from '../models/Photo.js';
import cloudinary from '../cloudinary.js';
import { photoValidation } from '../validations/photoValidation.js';

export const photoService = {
  async saveOrUpdatePhoto(id, reqFile, reqBody) {
    try {
      const { error } = photoValidation(reqBody);
      if (error) {
        logger.error(error);
        return {
          status: 400,
          message: error.details[0].message,
        };
      }

      let photo = await Photo.find({ user_id: id });
      if (photo.length !== 0) {
        await cloudinary.v2.uploader.destroy(photo[0].cloudinary_id);

        let result;
        if (reqFile) {
          result = await cloudinary.uploader.upload(reqFile.path);
        }

        photo = await Photo.updateOne(
          { user_id: id },
          [
            {
              $set: {
                user_id: reqBody.user_id,
                user_email: reqBody.user_email,
                avatar: result.secure_url,
                cloudinary_id: result.public_id,
              },
            },
          ],
          { upsert: true }
        );
        return {
          status: 200,
          message: 'Fotó sikeresen módosítva',
          image: result.secure_url,
        };
      } else {
        let result;
        if (reqFile) {
          result = await cloudinary.uploader.upload(reqFile.path);
        }
        photo = await Photo.updateOne(
          { user_id: id },
          [
            {
              $set: {
                user_id: reqBody.user_id,
                user_email: reqBody.user_email,
                avatar: result.secure_url,
                cloudinary_id: result.public_id,
              },
            },
          ],
          { upsert: true }
        );
        return {
          status: 200,
          message: 'Fotó sikeresen feltöltve',
          image: result.secure_url,
        };
      }
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Fotó feltöltés sikertelen',
      };
    }
  },

  async deletePhoto(id) {
    try {
      const photo = await Photo.find({ user_id: id });
      await cloudinary.v2.uploader.destroy(photo[0].cloudinary_id);
      await Photo.deleteOne({ user_id: id });
      return {
        status: 200,
        message: 'Fotó sikeresen törölve',
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Fotó törlése sikertelen',
      };
    }
  },
};
