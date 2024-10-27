import Message from '../../models/Message';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import sequelize from '../../../config/database';
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
    const lastMessages = await sequelize.query<any>(
      `
      SELECT DISTINCT ON (LEAST(m."senderId", m."receiverId"), GREATEST(m."senderId", m."receiverId"))
        m.*,
        u.name AS "otherUserName",  
        u."id" AS "otherUserId",
        u."photo" AS "otherPhoto"
      FROM "Messages" m
      JOIN "users" u ON 
        u.id = CASE 
                  WHEN m."senderId" = :userId THEN m."receiverId"
                  ELSE m."senderId"
                END
      WHERE m."senderId" = :userId OR m."receiverId" = :userId
      ORDER BY LEAST(m."senderId", m."receiverId"), 
               GREATEST(m."senderId", m."receiverId"), 
               m."time" DESC
      LIMIT :limit OFFSET :offset;
      `,
      {
        replacements: { userId: obj.userId, limit: obj.limit, offset },
        type: QueryTypes.SELECT,
      }
    );

    return lastMessages;
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
        [Op.or]: [
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
