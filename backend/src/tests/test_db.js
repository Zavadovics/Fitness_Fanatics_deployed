import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../logger';

dotenv.config();

const testdb = async () => {
  try {
    await mongoose.connect(process.env.DB_TEST_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('connected to test db');
  } catch (err) {
    logger.error(err);
  }
};

export default testdb;