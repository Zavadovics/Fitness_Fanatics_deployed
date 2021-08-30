import request from 'supertest';
import mongoose from 'mongoose';
import Plan from '../models/Plan';
import app from '../app.js';
import testdb from './test_db.js';
import jwt from 'jsonwebtoken';

beforeEach(async () => {
  testdb();
});

afterEach(async () => {
  await Plan.deleteMany();
  await mongoose.connection.close();
});

const planData = {
  user_id: '60fc016e026bee97315ba1e4',
  title: '10 KM run',
  originalName: 'Running-plan-template_10k.pdf',
  avatar:
    'https://res.cloudinary.com/dywtied0r/image/upload/v1627889086/tii7t48rtw1qeytnpah3.pdf',
  cloudinary_id: 'tii7t48rtw1qeytnpah3',
};

const authToken = jwt.sign(
  { tokenId: planData.user_id },
  process.env.TOKEN_SECRET
);

describe('Test for fetching training plans', () => {
  it('GET /plan should respond with 200', async () => {
    await request(app)
      .get(`/api/plan`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toBeTruthy();
      });
  });
});
