import Message from '../../models/Message';
import sequelize from 'sequelize';
import User from '../../models/User';
class ChatDao {
  message: typeof Message;

  constructor() {
    // Initialize the Message model to interact with the database
    this.message = Message;
  }

  /**
   * Sends a message between two users by saving it to the database.
   * @param obj - An object containing the senderId, receiverId, and message content.
   * @returns A promise that resolves to the created message instance.
   */
  async send(
    message: Pick<Message, 'senderId' | 'receiverId' | 'message'>
  ): Promise<Message> {
    // Create and save a new message in the database
    return this.message.create(message);
  }

  /**
   * Retrieves the last message from every chat for a user, limited by a specified number per page.
   * @param obj - Object containing the userId, page number, and limit of messages per page.
   * @returns A promise that resolves to an array of message instances.
   */
  async getAllChat(obj: {
    userId: number;
    limit: number;
    page: number;
  }): Promise<Message[]> {
    const offset = (obj.page - 1) * obj.limit;

    return this.message.findAll({
      where: {
        [sequelize.Op.or]: [
          { senderId: obj.userId },
          { receiverId: obj.userId },
        ],
      },
      order: [['time', 'DESC']],
      limit: obj.limit,
      offset,
      include: [
        {
          model: User,
          as: 'otherUser',
          attributes: ['id', 'name'],
          where: {
            id: { [sequelize.Op.ne]: obj.userId },
          },
        },
      ],
    });
  }

  /**
   * Retrieves the last 'n' messages from a specific chat between two users.
   * @param obj - Object containing userId1, userId2, limit of messages, and the page number.
   * @returns A promise that resolves to an array of message instances from the specific chat.
   */
  async getOneChat(obj: {
    userId1: number;
    userId2: number;
    limit: number;
    page: number;
  }): Promise<Message[]> {
    const offset = (obj.page - 1) * obj.limit;
    // Query to get messages between two users (userId1 and userId2)
    return this.message.findAll({
      where: {
        [sequelize.Op.or]: [
          { senderId: obj.userId1, receiverId: obj.userId2 },
          { senderId: obj.userId2, receiverId: obj.userId1 },
        ],
      },
      order: [['time', 'DESC']],
      limit: obj.limit,
      offset,
    });
  }
}

export default ChatDao;
