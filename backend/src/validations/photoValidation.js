import Joi from 'joi';

export const photoValidation = data => {
  const schema = Joi.object({
    user_id: Joi.string().min(1).required(),
    user_email: Joi.string().min(1).required().email(),
  });
  return schema.validate(data);
};
