import Joi from 'joi';

const chatFieldValidations = {
  message: Joi.string().min(1).max(300),
};
