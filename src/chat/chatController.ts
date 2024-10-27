// src/controllers/chatController.ts

import { ExpressHandler, ExpressHandlerWithParams } from '../../types/types';
import ChatDao from './ChatDao/chatDao';
import {
  sendMessageType,
  getAllChatType,
  getOneChatType,
} from '../../types/chatApi';
import AppError from '../../utils/AppError';
import { sendMessage } from '../../socket';
import User from '../models/User';
import { catchAsync, catchError } from '../../utils/catchErrors';

/**
 * ChatController class handles chat-related functionalities including sending messages
 * and retrieving chat information.
 */
class ChatController {
  private dao: ChatDao;

  /**
   * Initializes an instance of ChatController and ChatDao.
   */
  constructor() {
    this.dao = new ChatDao();
  }

  /**
   * Sends a message from one user to another.
   *
   * @throws AppError if receiverId or message is missing, or if the receiver does not exist.
   */
  public sendMessage: sendMessageType = async (req, res, next) => {
    let { receiverId, message } = req.body;
    const senderId = res.locals.userId;
    receiverId = Number(receiverId);

    if (!receiverId || !message)
      return next(new AppError('Receiver and message are required', 403));

    const receiver = await User.findByPk(receiverId);
    if (!receiver) return next(new AppError('This user does not exist', 404));

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

  /**
   * Retrieves all chat sessions for a specific user.
   * @returns An array of chat objects.
   */
  public getAllChats: getAllChatType = async (req, res, next) => {
    const { limit = 10, page = 1 } = req.body;
    const userId = res.locals.userId;
    const chats = await this.dao.getAllChat({ userId, limit, page });
    res.status(200).json({
      chats,
    });
  };

  /**
   * Retrieves chat messages between two users.
   *
   * @throws AppError if the provided user ID is invalid or if the user is not found.
   * @returns An array of message objects.
   */
  public getOneChat: getOneChatType = async (req, res, next) => {
    const userId2 = Number(req.params.id);
    if (!userId2) return next(new AppError('Invalid userId', 403));
    const user2 = await User.findByPk(userId2);
    if (!user2) return next(new AppError('User not found', 404));

    const userId1 = res.locals.userId;
    const { limit = 10, page = 1 } = req.body;
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
