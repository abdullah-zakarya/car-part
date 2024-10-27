import { NextFunction, Request, Response } from 'express';
import AppError from './AppError';
import { Sequelize, ValidationError } from 'sequelize';

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  if (message.startsWith('Validation error')) {
    const error = err as ValidationError;
    message = error.errors[0].message;
    statusCode = 400;
  } else if (!err.statusCode) {
    console.error(err);
  }
  res.status(statusCode).json({
    status: 'error',
    message,
  });
};
export default errorHandler;
