import { RequestHandler } from 'express';
import {} from 'express-requesthandler';
export enum Gender {
  male = 'male',
  female = 'female',
}

export type OAuthArgu = {
  authCode: string;
  redirect_uri: string;
};

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
