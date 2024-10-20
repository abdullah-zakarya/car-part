import { ExpressHandler, ExpressHandlerWithParams } from '../../types/types';
import ChatDao from '../DAO/Chat/chatDao';
import {
  sendMessageRequest,
  sendMessageResponse,
  getAllChatsRequest,
  getAllChatsResponse,
  getOneChatRequest,
  getOneChatResponse,
} from '../../types/api';
import AppError from '../../utils/AppError';
import { sendMessage } from '../../socket';
import User from '../models/User';

class ChatController {
  private dao: ChatDao;
  constructor() {
    this.dao = new ChatDao();
  }

  // Send a message
  public sendMessage: ExpressHandler<sendMessageRequest, sendMessageResponse> =
    async (req, res, next) => {
      let { receiverId, message } = req.body;
      const senderId = res.locals.userId;
      receiverId = Number(receiverId);
      if (!Number(receiverId) || !message)
        return next(new AppError('Receiver and message are required', 403));
      const receiver = await User.findByPk(receiverId);
      if (!receiver) return next(new AppError('this user is not exist', 404));
      sendMessage({ senderId, receiverId, message });
      const newMessage = await this.dao.send({
        senderId,
        receiverId,
        message,
      });

      res.status(200).json({
        message: newMessage,
      });
    };

  // Get all chats for a user
  public getAllChats: ExpressHandler<getAllChatsRequest, getAllChatsResponse> =
    async (req, res, next) => {
      const { userId, limit = 10, page = 1 } = req.body;

      if (!userId) {
        return next(new AppError('UserId, limit, and page are required', 403));
      }

      const chats = await this.dao.getAllChat({ userId, limit, page });

      res.status(200).json({
        chats,
      });
    };

  // Get one chat between two users
  public getOneChat: ExpressHandlerWithParams<
    { id: number },
    getOneChatRequest,
    getOneChatResponse
  > = async (req, res, next) => {
    const userId2 = req.params.id;
    const userId1 = res.locals.userId;
    const { limit = 10, page = 1 } = req.body;

    if (!userId1 || !userId2) {
      return next(new AppError('All fields are required', 403));
    }

    const messages = await this.dao.getOneChat({
      userId1,
      userId2,
      limit,
      page,
    });

    res.status(200).json({ messages });
  };
}

export default ChatController;
