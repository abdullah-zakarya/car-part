import { RequestHandler } from 'express';

// Create generic type and append error prop to the Type T
type WithError<T> = T & { error: string };

export type ExpressHandler<Req, Res> = RequestHandler<
  string,
  Partial<WithError<Res>>,
  Partial<Req>,
  any
>;

export type ExpressHandlerWithParams<Params, Req, Res> = RequestHandler<
  Partial<Params>,
  Partial<WithError<Res>>,
  Partial<Req>,
  any
>;

export interface JwtObject {
  userId: string;
}
export enum Gender {
  male = 'male',
  female = 'female',
}

export type OAuthArgu = {
  authCode: string;
  redirect_uri: string;
};
export type Point = {
  x: number;
  y: number;
};
export enum shipmentState {
  inSellerStock = 1,
  inStock = 2,
  shipping = 3,
  arrive = 4,
}
export enum ShipmentStatus {
  STOCK = 'stock',
  SHIPPING = 'shipping',
  DONE = 'done',
}

export type Address = {
  country: string;
  city: string;
  street: string;
  home?: string;
};
