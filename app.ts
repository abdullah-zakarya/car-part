import express, { NextFunction, Request, Response } from 'express';
import router from './src/controller/authController';
import AuthRouter from './src/routes/authRoute';
import errorMiddleware from './utils/errorMiddleware';
import AppError from './utils/AppError';
const app = express();
app.use(express.json());
const medle = (req: Request, res: Response, next: NextFunction) => {
  console.log(req);
  next();
};
app.use('/api/v1/user', AuthRouter);

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

app.use(errorHandler);
export default app;
