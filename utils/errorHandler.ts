import { NextFunction, Request, Response } from 'express';
import AppError from './AppError';

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode: number = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  if (!err.statusCode) {
    // message = Object.values(err)[1][0].message || 'Something went wrong';
    console.error(err);
  }
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
export default errorHandler;
