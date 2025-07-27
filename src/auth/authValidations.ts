import Joi from 'joi';
import AppError from '../../utils/AppError';
import createValidationsMiddleware from '../../utils/validationsUtils';

const authFelidsValidation = {
  name: Joi.string().max(30).min(3),
  email: Joi.string().email().max(30),
  password: Joi.string().min(8),
  role: Joi.string(),
  gender: Joi.string().custom((value) => {
    if (value !== 'male' && value !== 'female')
      throw new AppError(
        'Invalid gender : gender should be male or female',
        403
      );
  }),
  newPassword: Joi.string().min(8),
  resetCode: Joi.string().length(6),
  userId: Joi.string().max(24).min(1),
};

export const signupValidation = createValidationsMiddleware(
  authFelidsValidation,
  ['name', 'email', 'password'],
  ['role', 'gender']
);
export const loginValidation = createValidationsMiddleware(
  authFelidsValidation,
  ['email', 'password']
);
export const updateMeValidation = createValidationsMiddleware(
  authFelidsValidation,
  [],
  ['name', 'email', 'gender']
);
export const forgotPasswordValidation = createValidationsMiddleware(
  authFelidsValidation,
  ['email']
);
export const resetPasswordValidation = createValidationsMiddleware(
  authFelidsValidation,
  ['newPassword', 'resetCode', 'email']
);
