import Joi from 'joi';
import validationsUtils from '../../../utils/validationsUtils';

const chatFieldValidations = {
  message: Joi.string().min(1).max(300),
  receiverId: Joi.number(),
  id: Joi.number(),
  limit: Joi.number().integer().min(1).default(10),
  page: Joi.number().integer().min(1).default(1),

};
const chatValidations = new validationsUtils(chatFieldValidations);

export const sendMessageValidation = chatValidations.createMiddleware({ requiredBody: ['message', 'receiverId'] });
export const getAllChatsValidation = chatValidations.createMiddleware({ optionalQuery: ['limit', 'page'] });
export const getOneChatValidation = chatValidations.createMiddleware({ requiredParams: ['id'], optionalQuery: ['limit', 'page'] });