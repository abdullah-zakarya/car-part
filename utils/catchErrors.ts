import {
  NextFunction,
  request,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { ExpressHandler, ExpressHandlerWithParams } from '../types/types';
import AppError from './AppError';
function catchError<reqT, resT>(target: any, propertyKey: string) {
  let value: ExpressHandler<reqT, resT>;

  const getter = function () {
    return value;
  };

  const setter = function (newValue: ExpressHandler<reqT, resT>) {
    value = function (req, res, next) {
      try {
        newValue(req, res, next);
      } catch (error) {
        const err = error as AppError;
        next(err);
      }
    };
  };

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}
function catchAsync<reqT, resT>(
  fn: ExpressHandler<reqT, resT>
): ExpressHandler<reqT, resT> {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.log('from function', fn.name);
      next(err);
    }
  };
}
function catchPrams<paramT, reqT, resT>(
  fn: ExpressHandlerWithParams<paramT, reqT, resT>
): ExpressHandlerWithParams<paramT, reqT, resT> {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

const catchErr = (fn: RequestHandler) => {
  const result: RequestHandler = async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
  return result;
};

export { catchAsync, catchError, catchPrams, catchErr };
