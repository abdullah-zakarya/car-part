import Joi from 'joi';
import AppError from './AppError';

const createValidationsMiddleware = (
  validations: Record<string, Joi.Schema>, //
  requires: string[] = [],
  optionals: string[] = [],
  pramsRequires: string[] = [],
  pramsOptional: string[] = []
) => {
  const bodyValidators: Record<string, Joi.Schema> = {};
  const paramsValidators: Record<string, Joi.Schema> = {};

  // Required body fields
  for (const field of requires) {
    if (validations[field]) {
      bodyValidators[field] = validations[field].required();
    }
  }

  // Optional body fields
  for (const field of optionals) {
    if (validations[field]) {
      bodyValidators[field] = validations[field].optional();
    }
  }

  // Required params fields
  for (const field of pramsRequires) {
    if (validations[field]) {
      paramsValidators[field] = validations[field].required();
    }
  }

  // Optional params fields
  for (const field of pramsOptional) {
    if (validations[field]) {
      paramsValidators[field] = validations[field].optional();
    }
  }

  const bodySchema = Joi.object(bodyValidators);
  const paramsSchema = Joi.object(paramsValidators);

  return (req: any, res: any, next: any) => {
    // Validate body
    const { error: bodyError, value: validatedBody } = bodySchema.validate(
      req.body,
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    if (bodyError) {
      const messages = bodyError.details.map((d) => d.message).join(', ');
      return next(new AppError(messages, 400));
    }

    // Validate params
    const { error: paramsError, value: validatedParams } =
      paramsSchema.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (paramsError) {
      const messages = paramsError.details.map((d) => d.message).join(', ');
      return next(new AppError(messages, 400));
    }

    // Attach validated data to request
    req.validatedBody = validatedBody;
    req.validatedParams = validatedParams;

    next();
  };
};

export default createValidationsMiddleware;
