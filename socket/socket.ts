import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import http from 'http';
import User from '../src/models/User';
import AppError from '../utils/AppError';
import Message from '../src/models/Message';

const isLogin = async (token: string): Promise<number> => {
  const decoded = (await jwt.verify(
    token,
    process.env.JWT_SECRET as string
  )) as {
    id: number;
  };
  return decoded.id;
};

class SocketServer {
  private io: SocketIOServer;
  private static instance: SocketServer | null = null;
  private userSocket: { [userId: string]: string };

  private constructor(server: http.Server) {
    this.io = this.socket(server);
    this.userSocket = {};
    this.register();
    SocketServer.instance = this;
  }

  private socket(server: http.Server) {
    return new SocketIOServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
  }

  private register(): void {
    this.io.on('connection', async (socket) => {
      const token: string = socket.handshake.query.token as string;
      if (!token) return socket.emit('Unauthorized', 'No token provided');
      const userId: number = await isLogin(token);
      const user = await User.findByPk(userId);
      if (!user) return socket.emit('Unauthorized', 'Invalid user');
      this.userSocket[userId] = socket.id;
      socket.on('disconnect', () => delete this.userSocket[userId]);
    });
  }

  /**
   * Sends a message from one user to another.
   * @param fromUserId - The ID of the user sending the message.
   * @param toUserId - The ID of the user receiving the message.
   * @param message - The message content to be sent.
   */
  public sendMessageToUser(
    msg: Pick<Message, 'senderId' | 'receiverId' | 'message'>
  ): void {
    const { senderId, receiverId, message } = msg;
    const toSocketId = this.userSocket[receiverId];
    if (!toSocketId) return;

    // Send the message to the specified user
    this.io.to(toSocketId).emit('chat-message', {
      from: senderId,
      message,
    });
  }

  static run(server?: http.Server): SocketServer {
    if (!SocketServer.instance) {
      if (!server) {
        throw new Error(
          'You must add a server if the socket is not initialized'
        );
      }
      SocketServer.instance = new SocketServer(server);
    }
    return SocketServer.instance;
  }
}

export default SocketServer;
