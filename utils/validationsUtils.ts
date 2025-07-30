import Joi from 'joi';
import AppError from './AppError';
import { HttpStatusCode } from 'axios';

const createValidationsMiddleware = (
  validations: Record<string, Joi.Schema>, //
  requires: string[] = [],
  optionals: string[] = [],
  pramsRequires: string[] = [],
  pramsOptional: string[] = [],
  queryOptional: string[] = []
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
  // Optional query fields
  const queryValidators: Record<string, Joi.Schema> = {};
  for (const field of queryOptional) {
    if (validations[field]) {
      queryValidators[field] = validations[field].optional();
    }
  }
  const querySchema = Joi.object(queryValidators);
  const bodySchema = Joi.object(bodyValidators);
  const paramsSchema = Joi.object(paramsValidators);

  return (req: any, res: any, next: any) => {
    console.log('query filed' , queryOptional)
        console.log(req.query);

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
      return next(new AppError(messages, HttpStatusCode.BadRequest));
    }

    // Validate params
    const { error: paramsError, value: validatedParams } =
      paramsSchema.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (paramsError) {
      const messages = paramsError.details.map((d) => d.message).join(', ');
      return next(new AppError(messages, HttpStatusCode.BadRequest));
    }
    // Validate query
    const { error: queryError, value: validatedQuery } = querySchema.validate(
      req.query, {abortEarly: false, stripUnknown: true});
    if (queryError) {
      const messages = queryError.details.map((d) => d.message).join(', ')
      return next(new AppError(messages, HttpStatusCode.BadRequest));};
    // Attach validated data to request
    req.validatedQuery = validatedQuery;
    req.validatedBody = validatedBody;
    req.validatedParams = validatedParams;

    next();
  };
};

export default createValidationsMiddleware;
