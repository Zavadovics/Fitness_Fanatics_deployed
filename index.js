import dotenv from 'dotenv';
import db from './db.js';
import logger from './logger.js';
import app from './app.js';
import path from 'path';

dotenv.config();
db();

const PORT = process.env.PORT || 8080;

app.use(express.static('client/build'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  logger.info(`app is listening on port: ${PORT}`);
});
