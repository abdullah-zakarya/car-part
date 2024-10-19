import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import http from 'http';
import User from './src/models/User';
import AppError from './utils/AppError';
import Message from './src/models/Message';
import app from './app';
const isLogin = async (token: string): Promise<number> => {
  const decoded = (await jwt.verify(
    token,
    process.env.JWT_SECRET as string
  )) as { id: number };
  return decoded.id;
};

const userSocket: { [userId: number]: string } = {};
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// recored the users
io.on('connection', async (socket) => {
  const token: string = socket.handshake.headers.token as string;
  if (!token) return socket.emit('Unauthorized', 'No token provided');
  const userId: number = await isLogin(token);
  const user = await User.findByPk(userId);
  if (!user) return socket.emit('Unauthorized', 'Invalid user');
  userSocket[userId] = socket.id;
  socket.on('disconnect', () => delete userSocket[userId]);
});

const sendMessage = (
  msg: Pick<Message, 'senderId' | 'receiverId' | 'message'>
): void => {
  const { senderId, receiverId, message } = msg;
  const toSocketId = userSocket[receiverId];
  if (!toSocketId) return;
  io.to(toSocketId).emit('chat-message', {
    from: senderId,
    message,
  });
};

export { sendMessage, server };
// mckenzy :J#J*J5HtprcWPUL
