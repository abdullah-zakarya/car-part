import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import AuthRouter from './src/auth/authRoute';
import chatRouter from './src/chat/chatRoute';
import errorHandler from './utils/errorHandler';
import partRoute from './src/parts/partRoute';

const app = express();
app.use(express.json());

app.use('/api/v1/user', AuthRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/parts', partRoute);
app.use(errorHandler);
export default app;
