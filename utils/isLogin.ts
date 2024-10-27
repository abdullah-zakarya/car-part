import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';
import { ExpressHandler } from '../types/types';
import loginChick from './loginCheck';
import { catchAsync } from './catchErrors';
import { isLoginType } from '../types/authApi';

/**
 * Middleware to protect routes by verifying JWT
 * Extracts user ID from the token and attaches it to res.locals
 * If the token is invalid or expired, it throws an authentication error.
 */

const isLogin: isLoginType = catchAsync(async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) throw new AppError('Authorization header is missing', 401);
  const [tokenType, token] = auth.split(' ');
  if (tokenType !== 'Bearer' || !token)
    return next(new AppError('Token is required', 401));
  const userId = await loginChick(token);
  res.locals.userId = userId;
  next();
});

export default isLogin;
