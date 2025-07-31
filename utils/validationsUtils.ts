import Joi from 'joi';
import AppError from './AppError';
import { HttpStatusCode } from 'axios';
import { Request, Response, NextFunction } from 'express';

export enum sections {
  requiredParams = 'requiredParams',
  optionalParams = 'optionalParams',
  requiredBody = 'requiredBody',
  optionalBody = 'optionalBody',
  optionalQuery = 'optionalQuery',
}

class validationsUtils<
  T extends Record<string, Joi.Schema>,
  S extends Partial<Record<sections, (keyof T)[]>>
> {
  constructor(private validations: T) { }

  // middleware factory
  createMiddleware(fields: S) {
    const bodySchema = Joi.object({
      ...this.validateSection(fields[sections.requiredBody], true),
      ...this.validateSection(fields[sections.optionalBody], false),
    });

    const paramsSchema = Joi.object({
      ...this.validateSection(fields[sections.requiredParams], true),
      ...this.validateSection(fields[sections.optionalParams], false),
    });

    const querySchema = Joi.object({
      ...this.validateSection(fields[sections.optionalQuery], false),
    });

    return (req: any, res: any, next: any) => {
      // Validate body
      const bodyResult = this.validateAndAssign(bodySchema, req.body, 'validatedBody', req);
      if (bodyResult) return next(new AppError(bodyResult, HttpStatusCode.BadRequest));
      // Validate params
      const paramsResult = this.validateAndAssign(paramsSchema, req.params, 'validatedParams', req);
      if (paramsResult) return next(new AppError(paramsResult, HttpStatusCode.BadRequest));
      // Validate query
      const queryResult = this.validateAndAssign(querySchema, req.query, 'validatedQuery', req);
      if (queryResult) return next(new AppError(queryResult, HttpStatusCode.BadRequest));

      next();
    };

  }

  private validateSection(
    fields: (keyof T)[] | undefined,
    isRequired: boolean
  ): Record<string, Joi.Schema> {
    const schema: Record<string, Joi.Schema> = {};

    if (!fields) return schema;
    for (const field of fields) {
      if (this.validations[field]) {
        schema[field as string] = isRequired
          ? this.validations[field].required()
          : this.validations[field].optional();
      } else {
        throw new Error(`Field "${String(field)}" is not defined in validations`);
      }
    }
    return schema;
  }
  private validateAndAssign(
    schema: Joi.ObjectSchema,
    data: any,
    targetKey: 'validatedBody' | 'validatedParams' | 'validatedQuery',
    req: Request,
  ): string | undefined {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return `${targetKey}: ${error.details.map((d) => d.message).join(', ')}`;
    }

    (req as any)[targetKey] = value;
  }
}

export default validationsUtils;

