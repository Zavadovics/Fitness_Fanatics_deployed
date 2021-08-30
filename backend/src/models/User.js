import pkg from 'mongoose';
const { model, Schema } = pkg;

const UserSchema = new Schema(
  {
    userName: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
      max: 255,
      min: 1,
    },
    lastName: {
      type: String,
      required: true,
      max: 255,
      min: 1,
    },
    email: {
      type: String,
      required: true,
      max: 255,
      min: 6,
    },
    password: {
      type: String,
      required: true,
      max: 255,
      min: 8,
    },
    gender: {
      type: String,
    },
    cityOfResidence: {
      type: String,
    },
    weight: {
      type: String,
    },
    birthDate: {
      type: String,
    },
    motivation: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model('User', UserSchema);
