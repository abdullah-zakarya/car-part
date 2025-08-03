// import { Server as SocketIOServer } from 'socket.io';
// import jwt from 'jsonwebtoken';
// import http from 'http';
// import User from './src/models/User';
// import Message from './src/models/Message';
// import app from './app';
// const isLogin = async (token: string): Promise<number> => {
//   const decoded = (await jwt.verify(
//     token,
//     process.env.JWT_SECRET as string
//   )) as { id: number };
//   return decoded.id;
// };


// const userSocket: { [userId: number]: string } = {};
// const server = http.createServer(app);
// const io = new SocketIOServer(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

// // recorded the users
// io.on('connection', async (socket) => {
//   const token: string = socket.handshake.headers.token as string;
//   if (!token) return socket.emit('Unauthorized', 'No token provided');
//   const userId: number = await isLogin(token);
//   const user = await User.findByPk(userId);
//   if (!user) return socket.emit('Unauthorized', 'Invalid user');
//   userSocket[userId] = socket.id;
//   socket.on('disconnect', () => delete userSocket[userId]);
// });

// const sendMessage = (
//   msg: Pick<Message, 'senderId' | 'receiverId' | 'message'>
// ): void => {
//   const { senderId, receiverId, message } = msg;
//   const toSocketId = userSocket[receiverId];
//   if (!toSocketId) return;
//   io.to(toSocketId).emit('chat-message', {
//     from: senderId,
//     message,
//   });
// };

// export { sendMessage, server };
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import http, { Server as HTTPServer } from 'http';
import User from './src/models/User';
import Message from './src/models/Message';
import app from './app';

class WebSocketServer {
  private io: SocketIOServer;
  private httpServer: HTTPServer;
  private userSockets: Map<number, string>;

  constructor() {
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

const socketServer = new WebSocketServer();
const server = socketServer.getServer();

export { socketServer, server };
