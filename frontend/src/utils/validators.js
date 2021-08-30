import validator from 'validator';

export const isFieldEmpty = value => {
  return value !== '';
};

export const isEmailInvalid = value => {
  return validator.isEmail(value);
};

export const isPasswordValid = value => {
  return value.length >= 8;
};

export const isValueNegative = value => {
  return value > 0;
};

export const isDateInFuture = value => {
  const futureDate = new Date(value);
  const actualDate = new Date();
  return futureDate <= actualDate;
};
