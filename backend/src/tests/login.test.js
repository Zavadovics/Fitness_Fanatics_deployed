import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import app from '../app.js';
import testdb from './test_db.js';

const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

beforeEach(async () => {
  testdb();
});

afterEach(async () => {
  await User.deleteMany();
  await mongoose.connection.close();
});

const userData = {
  firstName: 'Elod',
  lastName: 'Teszt',
  email: 'tesztelod@gmail.com',
  password: 'tesztelod',
};

describe('POST /api/login', () => {
  describe('given an email or password that is incorrect', () => {
    test('should not log in user, should send status 403 with message', async () => {
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
      await User.create(userData);
      const response = await request(app).post('/api/login').send({
        email: 'tesztelod@gmail.com',
        password: 'teszhhhhhhhtelod',
      });
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(
        'Az általad megadott email cím vagy jelszó helytelen'
      );
    });
  });

  describe('given an email that does not exist and a password', () => {
    test('should not log in user, and should send status 404 with message', async () => {
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
      await User.create(userData);
      const response = await request(app).post('/api/login').send({
        email: 'tesztellek@gmail.com',
        password: 'mypassword',
      });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        'Az általad megadott email cím még nincs regisztrálva'
      );
    });
  });

  describe('given a password but no email provided', () => {
    test('should not log in user, should send status 400 with error', async () => {
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
      await User.create(userData);
      const response = await request(app).post('/api/login').send({
        email: '',
        password: 'mypassword',
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('"email" is not allowed to be empty');
    });
  });

  describe('given an email but no password provided', () => {
    test('should not log in user, should send status 400 with error', async () => {
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
      await User.create(userData);
      const response = await request(app).post('/api/login').send({
        email: 'tesztelod@gmail.com',
        password: '',
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        '"password" is not allowed to be empty'
      );
    });
  });
});
