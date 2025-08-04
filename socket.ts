import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import http, { Server as HTTPServer } from 'http';
import User from './src/models/User';
import Message from './src/services/chat/MessageModel';
import app from './app';
Message
class WebSocketServer {
  private io: SocketIOServer;
  private httpServer: HTTPServer;
  private userSockets: Map<number, string>;
  private static instance: WebSocketServer;

  public static getInstance(server?: HTTPServer): WebSocketServer {
    if (!WebSocketServer.instance) {
      if (!server) thrw new Error('Server instance is required to create WebSocketServer');
      WebSocketServer.instance = new WebSocketServer(server!);
    }
    return WebSocketServer.instance;
  }

  constructor(server: HTTPServer) {
    this.httpServer = http.createServer(app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    this.userSockets = new Map();
    this.setupListeners();
  }

  private async authenticate(token: string): Promise<number | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: number;
      };
      return decoded.id;
    } catch (err) {
      return null;
    }
  }

  private setupListeners(): void {
    this.io.on('connection', async (socket: Socket) => {
      const token = socket.handshake.headers.token as string;
      if (!token) {
        socket.emit('Unauthorized', 'No token provided');
        socket.disconnect();
        return;
      }

      const userId = await this.authenticate(token);
      if (!userId) {
        socket.emit('Unauthorized', 'Invalid token');
        socket.disconnect();
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        socket.emit('Unauthorized', 'Invalid user');
        socket.disconnect();
        return;
      }

      this.userSockets.set(userId, socket.id);

      socket.on('disconnect', () => {
        this.userSockets.delete(userId);
      });
    });
  }

  public sendMessage(msg: Pick<Message, 'senderId' | 'receiverId' | 'message'>): void {
    const { senderId, receiverId, message } = msg;
    const toSocketId = this.userSockets.get(receiverId);
    if (!toSocketId) return;
    this.io.to(toSocketId).emit('chat-message', {
      from: senderId,
      message,
    });
  }

  public getServer(): HTTPServer {
    return this.httpServer;
  }
}

// const socketServer = new WebSocketServer();
// const server = socketServer.getServer();

export default WebSocketServer; 