import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import AuthRouter from './src/routes/authRoute';
import chatRouter from './src/routes/chatRoute';
import errorHandler from './utils/errorHandler';

const app = express();
app.use(express.json());

app.use('/api/v1/user', AuthRouter);
app.use('/api/v1/chat', chatRouter);
app.use(errorHandler);
export default app;
