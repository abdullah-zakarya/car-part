import Part from '../src/models/Part';
import { getOnePartResponse } from './chatApi';
import { ExpressHandler, ExpressHandlerWithParams } from './types';

export interface filterFields {
  category?: string[];
  price?: [number, number];
  status?: boolean;
  year?: number;
  carType?: string[];
  original?: boolean;
}

export interface GetAllPartsPrams extends filterFields {
  limit?: number;
  page?: number;
  sort?: string;
}

export interface getAllPartsResponse {
  parts: Part[];
  total: number;
}

export interface addPartToCartResponse {
  message: string;
}

export type getPartType = ExpressHandlerWithParams<
  { id: number },
  null,
  getOnePartResponse
>;
export type getAllPartsType = ExpressHandlerWithParams<
  GetAllPartsPrams,
  {},
  getAllPartsResponse
>;
export type addPartRequest = Pick<
  Part,
  | 'category'
  | 'price'
  | 'carType'
  | 'new'
  | 'brand'
  | 'madeIn'
  | 'year'
  | 'mainPhoto'
  | 'stock'
  | 'photos'
>;
export type addPartType = ExpressHandler<addPartRequest, { part: Part }>;
export type addPartToCartType = ExpressHandlerWithParams<
  { id: number },
  null,
  { message: string }
>;
