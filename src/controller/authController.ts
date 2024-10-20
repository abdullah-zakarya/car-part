import {
  normalLoginRequest,
  normalLoginRespone,
  NormalSignUpRequest,
  SignUpResponse,
  forgotPasswordRequest,
  forgotPasswordResponse,
  resetPasswordRequest,
  resetPasswordResponse,
  showMeResponse,
  isLoginRequest,
  isLoginResponse,
  deleteMeResponse,
} from '../../types/api';
import { ExpressHandler, Gender } from '../../types/types';
import AppError from '../../utils/AppError';
import UserAuth from '../DAO/auth/UserAuth';
import User from '../models/User';

class AuthController {
  dao: UserAuth;

  constructor() {
    this.dao = new UserAuth();
  }

  /**
   * @description Register a new user with normal login method.
   * @route POST /api/auth/signup
   * @access Public
   */
  public normalSingup: ExpressHandler<NormalSignUpRequest, SignUpResponse> =
    async (req, res, next) => {
      try {
        const { name, password, email, gender = Gender.male } = req.body;
        if (!name || !email || !password)
          return next(new AppError('All fields are required', 403));

        const {
          user: { id },
          token,
        } = await this.dao.signup('normal', {
          name,
          password,
          email,
          gender,
        });

        res.status(200).json({
          user: { email, name, gender, id },
          jwt: token,
        });
      } catch (error) {
        next(error);
      }
    };

  /**
   * @description Authenticate user with normal login method.
   * @route POST /api/auth/login
   * @access Public
   */
  public normalLogin: ExpressHandler<normalLoginRequest, normalLoginRespone> =
    async (req, res, next) => {
      try {
        const { email, password } = req.body;
        if (!email || !password)
          return next(new AppError('Email and password are required', 403));

        const {
          user: { name, gender, id },
          token,
        } = await this.dao.login('normal', { email, password });

        res.status(200).json({
          user: { email, name, gender, id },
          jwt: token,
        });
      } catch (error) {
        next(error);
      }
    };

  /**
   * @description Send reset code to user's email for password reset.
   * @route POST /api/auth/forgot-password
   * @access Public
   */
  public forgotPassword: ExpressHandler<
    forgotPasswordRequest,
    forgotPasswordResponse
  > = async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) return next(new AppError('Email is required', 403));

      await this.dao.forgotPassword(email);
      res.status(200).json({ message: 'Reset code sent to your email' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Reset user's password with reset code.
   * @route POST /api/auth/reset-password
   * @access Public
   */
  public resetPassword: ExpressHandler<
    resetPasswordRequest,
    resetPasswordResponse
  > = async (req, res, next) => {
    try {
      const { email, resetCode, newPassword } = req.body;
      if (!email || !resetCode || !newPassword)
        return next(new AppError('All fields are required', 403));

      const token = await this.dao.resetPassword({
        email,
        resetCode,
        newPassword,
      });
      res.status(200).json({ jwt: token });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Get authenticated user details.
   * @route GET /api/auth/me
   * @access Private
   */
  public showMe: ExpressHandler<{}, showMeResponse> = async (
    req,
    res,
    next
  ) => {
    try {
      const userId: number = res.locals.userId; // Assuming user ID is added to request in middleware after authentication
      const user: User = await this.dao.showMe(userId);

      res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          gender: user.gender,
          id: user.id,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Verify if token is valid and user is logged in.
   * @route GET /api/auth/is-login
   * @access Private
   */
  public isLogin: ExpressHandler<isLoginRequest, isLoginResponse> = async (
    req,
    res,
    next
  ) => {
    try {
      const auth = req.headers.authorization;
      const [tokenType, token] = auth ? auth.split(' ') : [];
      if (tokenType !== 'Bearer' || !token)
        return next(new AppError('Token is required', 403));
      const userId = await this.dao.isLogin(token);
      res.locals.userId = userId;
      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Update information about current user
   * @route PUT /api/v1/update-me
   * @access Private
   */
  public updateMe: ExpressHandler<{}, { user: User }> = async (
    req,
    res,
    next
  ) => {
    try {
      const user = await this.dao.updateMe(res.locals.userId, req.body);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Delete the authenticated user account.
   * @route DELETE /api/v1/auth/me
   * @access Private
   */
  public deleteMe: ExpressHandler<{}, deleteMeResponse> = async (
    req,
    res,
    next
  ) => {
    try {
      const userId = res.locals.userId;
      await this.dao.deleteMe(userId);
      res.status(204).json({ message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
