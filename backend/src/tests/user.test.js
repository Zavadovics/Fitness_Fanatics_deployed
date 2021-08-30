import request from 'supertest';
import mongoose from 'mongoose';
import User from '../models/User';
import app from '../app.js';
import testdb from './test_db.js';
import jwt from 'jsonwebtoken';

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
  password: 'titkosjelszo',
};

const existingUserData = {
  firstName: 'Kiss',
  lastName: 'Piroska',
  email: 'tesztelod@gmail.com',
  password: 'jelszocska',
};

const userId = '61023b3022613e002a2fa374';
const authToken = jwt.sign({ tokenId: userId }, process.env.TOKEN_SECRET);

describe('POST /api/user', () => {
  describe('given a first name, last name, email, and password', () => {
    test('should respond with status code 201', async () => {
      const response = await request(app).post('/api/user').send(userData);
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe(
        'Sikeres regisztráció. Máris átirányítunk a bejelentkezés oldalra'
      );
    });
  });

  describe('given a first name, last name, an existing email, and password', () => {
    test('should respond with status code 409, and error message', async () => {
      await User.create(existingUserData);
      const response = await request(app).post('/api/user').send(userData);
      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe(
        'Az általad megadott email cím már regisztrálva van'
      );
    });
  });

  describe('given a first name, last name, and password but no email', () => {
    test('should respond with status code 400, and error message', async () => {
      const data = {
        firstName: 'Elod',
        lastName: 'Teszt',
        email: '',
        password: 'hahahaha',
      };
      const response = await request(app).post('/api/user').send(data);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('"email" is not allowed to be empty');
    });
  });

  describe('given a first name, last name, and email but no password', () => {
    test('should respond with status code 400, and error message', async () => {
      const data = {
        firstName: 'Elod',
        lastName: 'Teszt',
        email: 'tesztelod@gmail.com',
        password: '',
      };
      const response = await request(app).post('/api/user').send(data);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        '"password" is not allowed to be empty'
      );
    });
  });

  describe('given a last name, email, and password but no first name', () => {
    test('should respond with status code 400, and error message', async () => {
      const data = {
        firstName: '',
        lastName: 'Teszt',
        email: 'tesztelod@gmail.com',
        password: 'mypassword',
      };
      const response = await request(app).post('/api/user').send(data);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        '"firstName" is not allowed to be empty'
      );
    });
  });

  describe('given a first name, email, and password but no last name', () => {
    test('should respond with status code 400, and error message', async () => {
      const data = {
        firstName: 'Elemer',
        lastName: '',
        email: 'tesztelod@gmail.com',
        password: 'mypassword2',
      };
      const response = await request(app).post('/api/user').send(data);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        '"lastName" is not allowed to be empty'
      );
    });
  });

  describe('given a first name, last name, and password but invalid email', () => {
    test('should respond with status code 400, and error message', async () => {
      const data = {
        firstName: 'Elemer',
        lastName: 'Nagy',
        email: 'tesztelodgmail.com',
        password: 'mypassword',
      };
      const response = await request(app).post('/api/user').send(data);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('"email" must be a valid email');
    });
  });

  describe('given a first name, last name, and email but invalid password', () => {
    test('should respond with status code 400, and error message', async () => {
      const data = {
        firstName: 'Elemer',
        lastName: 'Nagy',
        email: 'tesztelod@gmail.com',
        password: 'mypas',
      };
      const response = await request(app).post('/api/user').send(data);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        '"password" length must be at least 8 characters long'
      );
    });
  });
});

describe('GET /api/user/:id', () => {
  describe('given a valid token and a user id', () => {
    test('should respond with status code 200', async () => {
      await request(app)
        .get(`/api/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response).toBeTruthy();
        });
    });
  });
});

describe('PUT /api/user/:id', () => {
  describe('given a valid token, user id and new user details', () => {
    it('should respond with status code 200', async () => {
      const newUserData = {
        firstName: 'Geza',
        lastName: 'Mezga',
        email: 'tesztelod@gmail.com',
        password: 'titkosjelszo',
      };

      await request(app)
        .put(`/api/user/${userId}`)
        .send(newUserData)
        .set('Authorization', `Bearer ${authToken}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body.message).toBe(
            'Sikeres mentés. Az adatokat hozzádtuk az adatbázishoz'
          );
        });
    });
  });
});

