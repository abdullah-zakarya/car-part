import Joi, { object } from 'joi';
import { CarType, Category } from '../../types/partsTypes';
import AppError from '../../utils/AppError';
import createValidationsMiddleware from '../../utils/validationsUtils';

const PartsFelidsValidation = {
  name: Joi.string()
    .max(30)
    .message('name must be at most 30 characters long')
    .min(3)
    .message('name must be at least 3 characters long'),
  category: Joi.string().custom((value) => {
    if (Object.values(Category).includes(value)) {
      return value;
    }
    throw new AppError('invalid category', 403);
  }),
  image: Joi.string().max(300),
  description: Joi.string()
    .min(10)
    .max(300)
    .message(
      'description must be at least 10 characters long and at most 300 characters long'
    ),
  price: Joi.number().min(0).message('price must be at least 0'),
  stock: Joi.number().min(1).message('quantity must be at least 1'),
  carType: Joi.string().custom((value) => {
    if (!Object.values(CarType).includes(value)) {
      throw new AppError('invalid car type', 403);
    }
    return value;
  }),
  new: Joi.boolean(),
  original: Joi.boolean(),
  photos: Joi.array().items(Joi.string()),
  mainPhoto: Joi.string(),
  year: Joi.number().min(1950).max(new Date().getFullYear()),
  madeIn: Joi.string(),
  brand: Joi.string(),
  country: Joi.string(),
  city: Joi.string(),
};

export const addPartValidation = createValidationsMiddleware(
  PartsFelidsValidation,
  [
    'category',
    'price',
    'carType',
    'brand',
    'madeIn',
    'year',
    'mainPhoto',
    'country',
    'city',
    'new',
  ],
  ['photos', 'stock']
);
export const updatePartValidation = createValidationsMiddleware(
  PartsFelidsValidation,
  [],
  [
    'new',
    'original',
    'photos',
    'mainPhoto',
    'year',
    'madeIn',
    'brand',
    'country',
    'city',
    'name',
    'category',
    'image',
    'description',
    'price',
    'quantity',
    'carType',
  ]
);
