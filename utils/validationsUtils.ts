import Joi from 'joi';
import AppError from './AppError';
const createValidationsMiddleware = (
  validations: Record<string, Joi.Schema>, //
  requires: string[] = [],
  optionals: string[] = []
) => {
  const joiValidator: Record<string, Joi.Schema> = {};

  for (const field of requires) {
    if (validations[field]) {
      joiValidator[field] = validations[field].required();
    }
  }

  for (const field of optionals) {
    if (validations[field]) {
      joiValidator[field] = validations[field].optional();
    }
  }

  const schema = Joi.object(joiValidator);

  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((d) => d.message).join(', ');
      return next(new AppError(messages, 400));
    }

    req.validatedBody = value;
    next();
  };
};

export default createValidationsMiddleware;
