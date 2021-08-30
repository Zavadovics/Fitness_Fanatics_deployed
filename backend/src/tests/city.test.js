import request from 'supertest';
import mongoose from "mongoose";
import City from "../models/City";
import app from '../app.js';
import testdb from "./test_db.js";

beforeEach(async () => {
  testdb();
});

afterAll(async () => {
  await City.deleteMany();
  await mongoose.connection.close();
});

describe("get should respond with 200", () => {
  it("GET /cities should respond with 200", async () => {
    await request(app)
      .get("/api/cities")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeTruthy();
      });
  });
});
