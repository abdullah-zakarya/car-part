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
const authValidation = new createValidationsMiddleware(authFelidsValidation);

export const signupValidation = authValidation.createMiddleware({
  requiredBody: ['name', 'email', 'password'],
  optionalBody: ['role', 'gender']
}
);
export const loginValidation = authValidation.createMiddleware({ requiredBody: ['email', 'password'] });
export const updateMeValidation = authValidation.createMiddleware({ requiredBody: ['name', 'email', 'gender'] }
);
export const forgotPasswordValidation = authValidation.createMiddleware({ requiredBody: ['email'] });
export const resetPasswordValidation = authValidation.createMiddleware(
  { requiredBody: ['newPassword', 'resetCode', 'email'] }
);
