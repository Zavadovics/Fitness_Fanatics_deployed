import pkg from 'mongoose';
const { model, Schema } = pkg;

const photoSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model('Photo', photoSchema);
