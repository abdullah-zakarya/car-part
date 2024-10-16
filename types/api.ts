import User from '../src/models/User';

// login normaly
export type normalLoginRequest = Pick<User, 'email' | 'password'>;
export type normalLoginRespone = {
  jwt: string;
  user: Pick<User, 'name' | 'email' | 'gender' | 'id'>;
};

// login
export type loginRequest = normalLoginRequest;
export type loginResponse = normalLoginRespone;

// singup
export type NormalSignUpRequest = Pick<
  User,
  'email' | 'name' | 'password' | 'gender'
>;
export interface SignUpResponse {
  jwt: string;
  user: Pick<User, 'name' | 'email' | 'gender' | 'id'>;
}

// forgot password
export interface forgotPasswordRequest {
  email: string;
}
export interface forgotPasswordResponse {
  message: string;
}

// restPassword
export interface resetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
}
export interface resetPasswordResponse {
  jwt: string;
}

// showMe
export interface showMeResponse {
  user: Pick<User, 'name' | 'email' | 'gender' | 'id'>;
}

// is login
export interface isLoginRequest {
  token: string;
}
export interface isLoginResponse {
  userId: number;
}

// delete user
export interface deleteMeResponse {
  message: string;
}

import Message from '../src/models/Message';

// Send a message
export type sendMessageRequest = Pick<Message, 'receiverId' | 'message'>;
export type sendMessageResponse = {
  message: Pick<
    Message,
    'senderId' | 'receiverId' | 'message' | 'time' | 'isRead'
  >;
};

// Get all chats for a user
export interface getAllChatsRequest {
  userId: number;
  limit: number;
  page: number;
}
export interface getAllChatsResponse {
  chats: Pick<Message, 'senderId' | 'receiverId' | 'message' | 'time'>[];
}

// Get messages between two users
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
