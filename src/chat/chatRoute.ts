// src/routes/chatRoutes.ts

import { Router } from 'express';
import ChatController from './chatController';
import isLogin from '../../utils/isLogin';
import { catchAsync, catchPrams } from '../../utils/catchErrors';

const router = Router();
const chatController = new ChatController();

// Middleware to ensure the user is authenticated
router.use(isLogin);

/**
 * @route POST /api/chats/send
 * @desc Send a message to a user
 * @access Private
 * @body {string} receiverId - ID of the user to receive the message
 * @body {string} message - The message to send
 * @returns {Object} - The new message object
 */
router.post('/send', catchAsync(chatController.sendMessage));

/**
 * @route GET /api/chats/all
 * @desc Get all chats for a specific user
 * @access Private
 * @body {number} limit - Number of chats to return (default: 10)
 * @body {number} page - The page number for pagination (default: 1)
 * @returns {Array} - An array of chat objects
 */
router.get('/all', catchAsync(chatController.getAllChats));

/**
 * @route GET /api/chats/:id
 * @desc Get chat messages between two users
 * @access Private
 * @param {number} id - ID of the second user
 * @body {number} limit - Number of messages to return (default: 10)
 * @body {number} page - The page number for pagination (default: 1)
 * @returns {Array} - An array of message objects
 */
router.get('/:id', catchPrams(chatController.getOneChat));

const chatRouter = router;
export default chatRouter;
