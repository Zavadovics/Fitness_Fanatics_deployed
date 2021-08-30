import Joi from 'joi';

export const userValidation = data => {
  const schema = Joi.object({
    userName: Joi.string(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    email: Joi.string().min(1).required().email(),
    password: Joi.string().min(8).required(),
    gender: Joi.string(),
    cityOfResidence: Joi.string(),
    weight: Joi.string(),
    birthDate: Joi.string(),
    motivation: Joi.string(),
  });
  return schema.validate(data);
};
