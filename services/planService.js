import logger from '../logger.js';
import Plan from '../models/Plan.js';
import cloudinary from '../cloudinary.js';
import { planValidation } from '../validations/planValidation.js';

export const planService = {
  async savePlan(reqFile, reqBody) {
    try {
      const { error } = planValidation(reqBody);
      if (error) {
        logger.error(error);
        return {
          status: 400,
          message: error.details[0].message,
        };
      }

      const result = await cloudinary.uploader.upload(reqFile.path);
      let plan = new Plan({
        user_id: reqBody.user_id,
        user_email: reqBody.user_email,
        title: reqBody.title,
        originalName: reqFile.originalname,
        avatar: result.secure_url,
        cloudinary_id: result.public_id,
      });
      await plan.save();
      return {
        status: 200,
        message: 'Sikeres edzésterv feltöltés',
        plan: plan,
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Edzésterv feltöltés sikertelen',
      };
    }
  },
};
