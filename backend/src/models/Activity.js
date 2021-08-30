import pkg from 'mongoose';
const { model, Schema } = pkg;

const ActivitySchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
      max: 20,
      min: 1,
    },
    email: {
      type: String,
      required: true,
      max: 20,
      min: 1,
    },
    activityDate: {
      type: String,
      required: true,
      min: 1,
    },
    activityTime: {
      type: String,
      required: true,
      min: 1,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    activityType: {
      type: String,
      required: true,
      min: 1,
    },
    distance: {
      type: Number,
      required: true,
      min: 1,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model('Activity', ActivitySchema);
