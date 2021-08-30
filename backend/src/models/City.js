import pkg from 'mongoose';
const { model, Schema } = pkg;

const CitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

export default model('City', CitySchema);
