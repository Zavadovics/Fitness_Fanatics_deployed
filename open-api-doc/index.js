import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import low from 'lowdb';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import usersRouter from './routes/users.js';
import loginRouter from './routes/login.js';
import activitiesRouter from './routes/activities.js';
import citiesRouter from './routes/cities.js';
import photosRouter from './routes/photos.js';
import plansRouter from './routes/plans.js';

const PORT = 4000;

import FileSync from 'lowdb/adapters/FileSync.js';

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  users: [],
  activities: [],
  cities: [],
  photos: [],
  plans: [],
}).write();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Fitness Fanatics API',
      description: 'Fitness Fanatics API Information',
      author: {
        name: 'Tibor Zavadovics',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/user', usersRouter);
app.use('/password', usersRouter);
app.use('/login', loginRouter);
app.use('/activities', activitiesRouter);
app.use('/cities', citiesRouter);
app.use('/photo', photosRouter);
app.use('/plan', plansRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
