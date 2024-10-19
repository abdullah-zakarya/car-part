import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';
import { ExpressHandler } from '../types/types';
import { isLoginRequest, isLoginResponse } from '../types/api';

/**
 * Middleware to protect routes by verifying JWT
 * Extracts user ID from the token and attaches it to res.locals
 * If the token is invalid or expired, it throws an authentication error.
 */

const loginChick = async (token: string) => {
  try {
    console.log(token);
    const decoded = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )) as { id: number };
    return decoded.id;
  } catch (error) {
    throw new AppError('Invalid or malformed token', 403);
  }
};

const isLogin: ExpressHandler<isLoginRequest, isLoginResponse> = async (
  req,
  res,
  next
) => {
  const auth = req.headers.authorization;
  if (!auth) return next(new AppError('Authorization header is missing', 403));

  const [tokenType, token] = auth.split(' ');
  if (tokenType !== 'Bearer' || !token)
    return next(new AppError('Token is required', 403));

  try {
    const userId = await loginChick(token);
    res.locals.userId = userId;
    next();
  } catch (error) {
    next(error);
  }
};

export default isLogin;
