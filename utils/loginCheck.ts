import AppError from './AppError';
import jwt from 'jsonwebtoken';
const loginChick = async (token: string) => {
  try {
    const decoded = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )) as { id: number };
    return decoded.id;
  } catch (error) {
    throw new AppError('Invalid or malformed token', 403);
  }
};
export default loginChick;
