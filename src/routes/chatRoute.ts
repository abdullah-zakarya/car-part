// src/routes/chatRoutes.ts
import { Router } from 'express';
import ChatController from '../controller/chatController';
import isLogin from '../../utils/isLogin';

const router = Router();
const chatController = new ChatController();
// debug

router.use(isLogin);
/**
 * @route POST /api/chats/send
 * @desc Send a message to a user
 * @access Private
 * @body {string} receiverId - ID of the user to receive the message
 * @body {string} message - The message to send
 * @returns {Object} - The new message object
 */
router.post('/send', chatController.sendMessage);

/**
 * @route POST /api/chats/all
 * @desc Get all chats for a specific user
 * @access Private
 * @body {string} userId - ID of the user to fetch chats for
 * @body {number} limit - Number of chats to return (default: 10)
 * @body {number} page - The page number for pagination (default: 1)
 * @returns {Array} - An array of chat objects
 */
router.get('/all', chatController.getAllChats);

/**
 * @route POST /api/chats/one
 * @desc Get chat messages between two users
 * @access Private
 * @body {string} userId1 - ID of the first user
 * @body {string} userId2 - ID of the second user
 * @body {number} limit - Number of messages to return (default: 10)
 * @body {number} page - The page number for pagination (default: 1)
 * @returns {Array} - An array of message objects
 */
router.get('/:id', chatController.getOneChat);
const chatRouter = router;
export default chatRouter;
