import request from 'supertest';
import mongoose from 'mongoose';
import Activity from '../models/Activity';
import app from '../app.js';
import testdb from './test_db.js';
import jwt from 'jsonwebtoken';

beforeEach(async () => {
  testdb();
});

afterAll(async () => {
  await Activity.deleteMany();
  await mongoose.connection.close();
});

const activity = {
  user_id: '60fc016e026bee11115ba1e4',
  email: 'haliho@gmail.com',
  activityDate: '1966-06-06',
  activityTime: '06:35',
  duration: 144,
  activityType: 'running',
  distance: 18000,
  comment: 'it was too hot',
};

const authToken = jwt.sign(
  { tokenId: activity.user_Id },
  process.env.TOKEN_SECRET
);

const updatedActivity = {
  user_id: '60fc016e026bee11115ba1e4',
  email: 'haliho@gmail.com',
  activityDate: '1966-06-06',
  activityTime: '06:35',
  duration: 144,
  activityType: 'running',
  distance: 18000,
  comment: 'there was a crazy wind',
};

describe('testing activities', () => {
  it('POST /activities should respond with 201', async () => {
    await request(app)
      .post('/api/activities')
      .send(activity)
      .set('Authorization', `Bearer ${authToken}`)
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('New activity has been added');
        activity['id'] = response.body.newActivity._id;
        activity['user_id'] = response.body.newActivity.user_id;
      });
  });

  it('PUT /activities/:id should respond with 200', async () => {
    await request(app)
      .put(`/api/activities/${activity.id}`)
      .send(updatedActivity)
      .set('Authorization', `Bearer ${authToken}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Activity has been modified');
      });
  });

  it('GET /activities/:id should respond with 200', async () => {
    await request(app)
      .get(`/api/activities/${activity.user_id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
      });
  });

  it('DELETE /activities/:id should respond with 200', async () => {
    await request(app)
      .delete(`/api/activities/${activity.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Activity has been deleted');
      });
  });
});
