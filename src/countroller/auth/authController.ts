import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import User from "./../models/User"; // Assuming you have a User model
import ILoginMethod from './loginMethodes/ILoginMethod';
import User from '../../models/User';
import NormalLogin from './loginMethodes/normalLogin';
import GoogleOAuth from './loginMethodes/TherdPartyAllow/GoogleOAuth';
import AppError from '../../../utils/AppError';
import EmailSend from '../../../utils/EmailSender';
import ResetCode from '../../models/resetCode';
import { Op } from 'sequelize';
import { promisify } from 'util';
class UserAuth {
  private loginMethod(mathod: string): ILoginMethod {
    if (mathod === 'normal') return new NormalLogin();
    if (mathod === 'google') return new GoogleOAuth();
    throw new AppError('this method is not exist yet');
  }

  // Allow specific fields only (for security purposes)
  private allowsField(obj: { [key: string]: any }, fields: string[]): object {
    const result: { [key: string]: any } = {};
    for (const field of fields) {
      result[field] = obj[field];
    }
    return result;
  }

  // Create JWT Token
  createToken(userId: number): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: '3D',
    });
  }

  // Signup
  async signup(
    method: string,
    info: {}
  ): Promise<{ user: User; token: string }> {
    const loginMthod = this.loginMethod(method);
    const user = await loginMthod.signup(info);
    const token = this.createToken(user.id);
    return { user, token };
  }

  // Login
  async login(method: string, info: {}): Promise<User> {
    const loginMthod = this.loginMethod(method);
    const user = await loginMthod.signup(info);
    return user;
  }

  // Forgot Password
  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ where: { email } });
    if (!user) new AppError('this user is not exist ');
    const resetCode = String(Math.floor(1000 + Math.random() * 9000));
    const text = resetCode + ' is the key to rest your password';
    await ResetCode.destroy({ where: { email } });
    const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
    await ResetCode.create({ email, code: resetCode, expiredAt });
    new EmailSend({ from: 'car-part', text, to: email });
  }

  // Reset Password
  async resetPassword(obj: {
    email: string;
    resetCode: string;
    newPassword: string;
  }): Promise<string> {
    const { email, resetCode, newPassword } = obj;
    const restCode = await ResetCode.findOne({
      where: { email, code: resetCode, expiredAt: { [Op.lt]: Date.now() } },
    });
    if (!resetCode) new AppError('this reset code is not exsit or expired');
    const user = await User.findOne({ where: { email } });
    const password = new NormalLogin().updatePassword(user!.id, newPassword);
    return this.createToken(user!.id);
  }

  // Update User Information
  async updateMe(userId: number, updatedFields: object): Promise<User> {
    const fieldsToUpdate = this.allowsField(updatedFields, ['name', 'email']);
    const user = await User.findByPk(userId);
    user?.update(fieldsToUpdate);
    user?.save();
    return user!; // Assuming `User.update` is a method that updates the user in DB
  }

  // Get User Information
  async showMe(id: number): Promise<User> {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    return user!;
  }

  async isLogin(token: string): Promise<number> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return 12;
  }

  // Delete User
  async deleteMe(userId: number): Promise<void> {
    const user = await User.findByPk(userId);
    user?.destroy();
  }
}
export default UserAuth;
