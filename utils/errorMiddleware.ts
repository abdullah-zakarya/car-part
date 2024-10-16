import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';

function errorMiddleware(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
}

export default errorMiddleware;
