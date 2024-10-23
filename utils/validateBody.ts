// import 'reflect-metadata';
// import { ExpressHandler } from '../types/types';
// import AppError from './AppError';

// function validateBody<reqT, resT>(target: any, propertyKey: string) {
//   let value: ExpressHandler<reqT, resT>;

//   const getter = function () {
//     return value;
//   };

//   const setter = function (newValue: ExpressHandler<reqT, resT>) {
//     value = function (req, res, next) {
//       try {
//         const body = req.body as reqT;

//         const requiredFields = Reflect.getMetadata(
//           'design:paramtypes',
//           target,
//           propertyKey
//         );

//         if (!requiredFields || !requiredFields[0]) {
//           throw new AppError('No fields defined for validation', 500);
//         }

//         const bodyKeys = Object.keys(body!);
//         const requiredKeys = Object.keys(requiredFields[0].prototype);

//         requiredKeys.forEach((key) => {
//           if (!bodyKeys.includes(key)) {
//             throw new AppError(`Field ${key} is missing`, 400);
//           }

//           const expectedType =
//             requiredFields[0].prototype[key].name.toLowerCase();
//           if (typeof body[key] !== expectedType) {
//             throw new AppError(
//               `Field ${key} must be of type ${expectedType}`,
//               400
//             );
//           }
//         });

//         newValue(req, res, next);
//       } catch (error) {
//         next(error);
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

// export default validateBody;
