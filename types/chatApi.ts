import User from '../src/models/User';
import Message from '../src/models/Message';
import Part from '../src/models/Part';
import { ExpressHandler, ExpressHandlerWithParams } from './types';

// User Authentication Types

// Message Types
type sendMessageRequest = Pick<Message, 'receiverId' | 'message'>;
type sendMessageResponse = {
  message: Pick<
    Message,
    'senderId' | 'receiverId' | 'message' | 'time' | 'isRead'
  >;
};
export type sendMessageType = ExpressHandler<
  sendMessageRequest,
  sendMessageResponse
>;

interface getAllChatsRequest {
  userId: number;
  limit: number;
  page: number;
}
interface getAllChatsResponse {
  chats: Pick<Message, 'senderId' | 'receiverId' | 'message' | 'time'>[];
}
export type getAllChatType = ExpressHandler<
  getAllChatsRequest,
  getAllChatsResponse
>;

interface getOneChatRequest {
  userId1: number;
  userId2: number;
  limit: number;
  page: number;
}
interface getOneChatResponse {
  messages: Pick<
    Message,
    'senderId' | 'receiverId' | 'message' | 'time' | 'isRead'
  >[];
}
export type getOneChatType = ExpressHandlerWithParams<
  { id: number },
  getOneChatRequest,
  getOneChatResponse
>;
export interface getOnePartResponse {
  part: Part;
}
