import { ExpressHandler } from '../types/types';
import AppError from './AppError';

// ديكوراتور لالتقاط الأخطاء
function catchAsyncErrors<T1, T2>(fn: Function): ExpressHandler<T1, T2> {
  const res: ExpressHandler<T1, T2> = async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
  return res;
}

export default catchAsyncErrors;
