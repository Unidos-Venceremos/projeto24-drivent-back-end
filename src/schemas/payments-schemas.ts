import Joi from 'joi';

export const registerPaymentSchema = Joi.object({
  number: Joi.string().required(),
  holder: Joi.string().required(),
  expiry: Joi.string().required(),
  cvv: Joi.string().required(),
  withHotel: Joi.boolean().required(),
  presential: Joi.boolean().required(),
});
