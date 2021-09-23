import express from 'express';
import morgan from 'morgan';
import api from './routes/api.routes.js';
import logger from './logger.js';
import errorHandler from './middlewares/error-handler.js';

const app = express();

app.use(morgan('combined', { stream: logger.stream }));
app.use('/api', api);
app.use(() => errorHandler);

export default app;
