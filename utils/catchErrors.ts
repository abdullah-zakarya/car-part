// import { ExpressHandler } from '../types/types';
// import AppError from './AppError';
// function catchError<reqT, resT>(target: any, propertyKey: string) {
//   let value: ExpressHandler<reqT, resT>;

//   const getter = function () {
//     return value;
//   };

//   const setter = function (newValue: ExpressHandler<reqT, resT>) {
//     value = function (req, res, next) {
//       try {
//         newValue(req, res, next);
//       } catch (error) {
//         const err = error as AppError;
//         next(err);
//       }
//     };
//   };

//   Object.defineProperty(target, propertyKey, {
//     get: getter,
//     set: setter,
//     enumerable: true,
//     configurable: true,
//   });
// }
// export default catchError;

import { ExpressHandler, ExpressHandlerWithParams } from '../types/types';
import AppError from './AppError';

function catchError<reqT, resT, paramsT = any>(
  target: any,
  propertyKey: string
) {
  let value:
    | ExpressHandler<reqT, resT>
    | ExpressHandlerWithParams<paramsT, reqT, resT>;

  const getter = function () {
    return value;
  };

  const setter = function (
    newValue:
      | ExpressHandler<reqT, resT>
      | ExpressHandlerWithParams<paramsT, reqT, resT>
  ) {
    value = function (req: any, res: any, next: any) {
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

export default catchError;
