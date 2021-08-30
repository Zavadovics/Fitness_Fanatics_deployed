import request from 'supertest';
import mongoose from 'mongoose';
import Photo from '../models/Photo';
import app from '../app.js';
import testdb from './test_db.js';
import jwt from 'jsonwebtoken';

beforeEach(async () => {
  testdb();
});

afterEach(async () => {
  await Photo.deleteMany();
  await mongoose.connection.close();
});

const photoData = {
  user_id: '60fc016e026bee97315ba1e4',
  user_email: 'tesztelod@gmail.com',
  avatar:
    'https://res.cloudinary.com/dywtied0r/image/upload/v1627924778/j4xzkn4eiehttzqgev8i.jpg',
  cloudinary_id: 'j4xzkn4eiehttzqgev8i',
};

const authToken = jwt.sign(
  { tokenId: photoData.user_id },
  process.env.TOKEN_SECRET
);

describe('GET /photo/:id', () => {
  describe(`Test for fetching the user's photo`, () => {
    test('should respond with 200', async () => {
      await request(app)
        .get(`/api/photo/${photoData.user_id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
        });
    });
  });
});

describe('DELETE /photo/:id', () => {
  describe(`Test for deleting the user's photo`, () => {
    it('should respond with 200', async () => {
      await Photo.create(photoData);

      await request(app)
        .delete(`/api/photo/${photoData.user_id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body.message).toBe('Fotó sikeresen törölve');
        });
    });
  });
});
