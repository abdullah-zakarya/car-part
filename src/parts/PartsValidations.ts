import Joi, { object, optional } from 'joi';
import { CarType, Category } from '../../types/partsTypes';
import AppError from '../../utils/AppError';
import createValidationsMiddleware from '../../utils/validationsUtils';
import { DATE } from 'sequelize';

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
      console.log(Object.values(CarType));
      throw new AppError('invalid car type', 403);
    }
    return value;
  }),
  new: Joi.boolean(),
  original: Joi.boolean(),
  photos: Joi.array().items(Joi.string()),
  mainPhoto: Joi.string(),
  year: Joi.date().min(new Date('1970-01-01')).max(new Date("2025-12-31")),
  madeIn: Joi.string(),
  brand: Joi.string(),
  country: Joi.string(),
  city: Joi.string(),
  limit: Joi.number().min(1).max(100).default(10),  
  page: Joi.number().min(1).default(1),
  sort: Joi.string().valid('price', '-price', 'name', '-name').default('price'),
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
  ['photos', 'stock'],[],[],['sort', 'page', 'limit']
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