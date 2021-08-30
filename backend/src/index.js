import dotenv from 'dotenv';
import db from './db.js';
import logger from './logger.js';
import app from './app.js';

dotenv.config();
db();

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  logger.info(`app is listening on port: ${PORT}`);
});
