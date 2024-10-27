import User from '../src/models/User';
import { ExpressHandler } from './types';

type normalLoginRequest = Pick<User, 'email' | 'password'>;
type normalLoginResponse = {
  jwt: string;
  user: Pick<User, 'name' | 'email' | 'gender' | 'id'>;
};

type loginRequest = normalLoginRequest;
type loginResponse = normalLoginResponse;

type NormalSignUpRequest = Pick<User, 'email' | 'name' | 'password' | 'gender'>;
interface SignUpResponse {
  jwt: string;
  user: Pick<User, 'name' | 'email' | 'gender' | 'id'>;
}

// Password Management Types
interface forgotPasswordRequest {
  email: string;
}
interface forgotPasswordResponse {
  message: string;
}

interface resetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
}
interface resetPasswordResponse {
  jwt: string;
}

interface showMeResponse {
  user: Pick<User, 'name' | 'email' | 'gender' | 'id' | 'photo'>;
}

interface isLoginRequest {
  token: string;
}
interface isLoginResponse {
  userId: number;
}

interface deleteMeResponse {
  message: string;
}

export type normalSingupType = ExpressHandler<
  NormalSignUpRequest,
  SignUpResponse
>;
export type normalLoginType = ExpressHandler<
  normalLoginRequest,
  SignUpResponse
>;
export type isLoginType = ExpressHandler<isLoginRequest, isLoginResponse>;
export type forgotPasswordType = ExpressHandler<
  forgotPasswordRequest,
  forgotPasswordResponse
>;
export type resetPasswordType = ExpressHandler<
  resetPasswordRequest,
  resetPasswordResponse
>;
export type showMeType = ExpressHandler<{}, showMeResponse>;
export type updateMeType = ExpressHandler<{}, showMeResponse>;
export type deleteMeType = ExpressHandler<{}, deleteMeResponse>;
