import { Router } from 'express';
import AuthController from '../controller/authController';
import isLogin from '../../utils/isLogin'; // Reusing isLogin as middleware for JWT verification

const router = Router();
const authController = new AuthController();

// Public routes for user signup and login
/**
 * @route   POST /api/auth/signup
 * @desc    User signup using normal authentication
 * @access  Public
 */
router.post('/signup', authController.normalSingup);

/**
 * @route   POST /api/auth/login
 * @desc    User login using normal authentication
 * @access  Public
 */
router.post('/login', authController.normalLogin);

// Routes for password reset and recovery
/**
 * @route   POST /api/auth/forgot-password
 * @desc    Sends a password reset code to user's email
 * @access  Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Resets user's password using a reset code
 * @access  Public
 */
router.post('/reset-password', authController.resetPassword);

// Protected routes that require JWT verification
/**
 * @route   GET /api/auth/me
 * @desc    Retrieve logged-in user's information
 * @access  Private
 */
router.get('/me', isLogin, authController.showMe);

/**
 * @route   GET /api/auth/is-login
 * @desc    Verify if user is logged in (valid JWT)
 * @access  Private
 */
router.put('/update-me', isLogin, authController.updateMe);
/**
 * @route   DELETE /api/auth/me
 * @desc    Delete current user's account
 * @access  Private
 */
router.delete('/me', isLogin, authController.deleteMe);

const AuthRouter = router;
export default AuthRouter;
