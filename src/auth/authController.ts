import {
  normalLoginType,
  normalSingupType,
  forgotPasswordType,
  resetPasswordType,
  showMeType,
  updateMeType,
  deleteMeType,
} from '../../types/authApi';
import { Gender } from '../../types/types';
import AppError from '../../utils/AppError';
import UserAuth from './authDao/UserAuth';
import User from '../models/User';
import { isEmail } from 'validator';

class AuthController {
  dao: UserAuth;

  constructor() {
    this.dao = new UserAuth();
  }

  /**
   * @description Register a new user with normal login method.
   * @route POST /api/v1/user/signup
   * @access Public
   */
  public normalSingup: normalSingupType = async (req, res, next) => {
    const { name, password, email, gender = Gender.male } = req.body;
    // validation
    if (!name || !email || !password)
      return next(new AppError('All fields are required', 403));

    if (!isEmail(email)) throw new AppError('this email is not valid', 403);

    if (password.length < 8)
      throw new AppError('the password should be more than 7 letters', 403);

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
  };

  /**
   * @description Authenticate user with normal login method.
   * @route POST /api/v1/user/login
   * @access Public
   */
  public normalLogin: normalLoginType = async (req, res, next) => {
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
  };

  /**
   * @description Send reset code to user's email for password reset.
   * @route POST /api/v1/user/forgot-password
   * @access Public
   */
  public forgotPassword: forgotPasswordType = async (req, res, next) => {
    const { email } = req.body;
    if (!email) return next(new AppError('Email is required', 403));
    await this.dao.forgotPassword(email);
    res.status(200).json({ message: 'Reset code sent to your email' });
  };

  /**
   * @description Reset user's password with reset code.
   * @route POST /api/v1/user/reset-password
   * @access Public
   */
  public resetPassword: resetPasswordType = async (req, res, next) => {
    const { email, resetCode, newPassword } = req.body;
    if (!email || !resetCode || !newPassword)
      throw new AppError('All fields are required', 403);

    const token = await this.dao.resetPassword({
      email,
      resetCode,
      newPassword,
    });
    res.status(200).json({ jwt: token });
  };

  /**
   * @description Get authenticated user details.
   * @route GET /apiv1/user/me
   * @access Private
   */

  public showMe: showMeType = async (req, res, next) => {
    const userId: number = res.locals.userId;
    const user: User = await this.dao.showMe(userId);
    const { name, email, photo, gender, id } = user;
    res.status(200).json({ user: { name, email, photo, gender, id } });
  };

  /**
   * @description Update information about current user
   * @route PUT /api/v1/user/update-me
   * @access Private
   */
  public updateMe: updateMeType = async (req, res, next) => {
    const user = await this.dao.updateMe(res.locals.userId, req.body);
    const { name, email, photo, gender, id } = user;
    res.status(200).json({ user: { name, email, photo, gender, id } });
  };

  /**
   * @description Delete the authenticated user account.
   * @route DELETE /api/v1/user/me
   * @access Private
   */
  public deleteMe: deleteMeType = async (req, res, next) => {
    const userId = res.locals.userId;
    await this.dao.deleteMe(userId);
    res.status(204).json({ message: 'User deleted' });
  };
}

export default AuthController;
