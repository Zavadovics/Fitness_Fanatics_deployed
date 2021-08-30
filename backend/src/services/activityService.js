import logger from '../logger.js';
import Activity from '../models/Activity.js';
import { activityValidation } from '../validations/activityValidation.js';

export const activityService = {
  async saveActivity(activityData) {
    try {
      const { comment, ...others } = activityData;
      const { error } = activityValidation(others);
      if (error) {
        logger.error(error);
        return {
          status: 400,
          message: error.details[0].message,
        };
      }
      const newActivity = new Activity(activityData);

      await newActivity.save();
      return {
        status: 201,
        message:
          'Sikeres mentés. Az új tevékenységet hozzádtuk az adatbázishoz',
        newActivity: newActivity,
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Sikertelen mentés. Adatbázis probléma',
      };
    }
  },

  async updateActivity(id, reqData) {
    try {
      const updatedActivity = await Activity.findByIdAndUpdate(id, reqData, {
        useFindAndModify: false,
      });
      return {
        status: 200,
        message:
          'Sikeres módosítás. A tevékenység frissítésre került az adatbázisban',
        updatedActivity: updatedActivity,
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Sikertelen módosítás. Adatbázis probléma',
      };
    }
  },

  async deleteActivity(id) {
    try {
      await Activity.findByIdAndDelete(id);
      return {
        status: 200,
        message: 'Tevékenység sikeresen törölve',
      };
    } catch (err) {
      logger.error(err);
      return {
        status: 500,
        message: 'Tevékenység törlése sikertelen',
      };
    }
  },
};
