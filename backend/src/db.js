import mongoose from 'mongoose';
import logger from './logger.js';

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const db = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, options);
    logger.info('connected to MongoDB');
  } catch (err) {
    logger.error(err);
  }
};

export default db;
