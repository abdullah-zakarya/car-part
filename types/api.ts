import User from '../src/models/User';
import Message from '../src/models/Message';
import Part from '../src/models/Part';
import { ExpressHandler, ExpressHandlerWithParams } from './types';

// User Authentication Types
export type normalLoginRequest = Pick<User, 'email' | 'password'>;
export type normalLoginResponse = {
  jwt: string;
  user: Pick<User, 'name' | 'email' | 'gender' | 'id'>;
};

export type loginRequest = normalLoginRequest;
export type loginResponse = normalLoginResponse;

export type NormalSignUpRequest = Pick<
  User,
  'email' | 'name' | 'password' | 'gender'
>;
export interface SignUpResponse {
  jwt: string;
  user: Pick<User, 'name' | 'email' | 'gender' | 'id'>;
}

// Password Management Types
export interface forgotPasswordRequest {
  email: string;
}
export interface forgotPasswordResponse {
  message: string;
}

export interface resetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
}
export interface resetPasswordResponse {
  jwt: string;
}

// User Information Types
export interface showMeResponse {
  user: Pick<User, 'name' | 'email' | 'gender' | 'id'>;
}

export interface isLoginRequest {
  token: string;
}
export interface isLoginResponse {
  userId: number;
}

export interface deleteMeResponse {
  message: string;
}

// Message Types
export type sendMessageRequest = Pick<Message, 'receiverId' | 'message'>;
export type sendMessageResponse = {
  message: Pick<
    Message,
    'senderId' | 'receiverId' | 'message' | 'time' | 'isRead'
  >;
};

export interface getAllChatsRequest {
  userId: number;
  limit: number;
  page: number;
}
export interface getAllChatsResponse {
  chats: Pick<Message, 'senderId' | 'receiverId' | 'message' | 'time'>[];
}

export interface getOneChatRequest {
  userId1: number;
  userId2: number;
  limit: number;
  page: number;
}
export interface getOneChatResponse {
  messages: Pick<
    Message,
    'senderId' | 'receiverId' | 'message' | 'time' | 'isRead'
  >[];
}

export interface getOnePartResponse {
  part: Part;
}
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
// طلب إضافة جزء جديد

export type getPartType = ExpressHandlerWithParams<
  { id: number },
  null,
  getOnePartResponse
>;
export type getAllPartsType = ExpressHandlerWithParams<
  GetAllPartsPrams,
  null,
  getAllPartsResponse
>;
type addPartRequest = Pick<
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
