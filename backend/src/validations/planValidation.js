import Joi from 'joi';

export const planValidation = data => {
  const schema = Joi.object({
    user_id: Joi.string().min(1).required(),
    user_email: Joi.string().min(1).required().email(),
    title: Joi.string().min(1).required(),
  });
  return schema.validate(data);
};
