import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ILoginMethod from './loginMethodes/ILoginMethod';
import User from '../../models/User';
import NormalLogin from './loginMethodes/normalLogin';
import GoogleOAuth from './loginMethodes/TherdPartyAllow/Google';
import AppError from '../../../utils/AppError';
import EmailSend from '../../../utils/EmailSender';
import ResetCode from '../../models/ResetCode';
import { Op } from 'sequelize';
import { promisify } from 'util';
import loginChick from '../../../utils/loginCheck';

class UserAuth {
  private static LOGIN_METHODS: Record<string, new () => ILoginMethod> = {
    normal: NormalLogin,
    google: GoogleOAuth,
  };

  private getLoginMethod(method: string): ILoginMethod {
    const LoginMethod = UserAuth.LOGIN_METHODS[method];
    if (!LoginMethod) throw new AppError('This method does not exist yet');
    return new LoginMethod();
  }

  private allowsField(
    obj: { [key: string]: any },
    fields: string[]
  ): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    for (const field of fields) {
      result[field] = obj[field];
    }
    return result;
  }

  private createToken(userId: number): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: '3d',
    });
  }

  async signup(
    method: string,
    info: {}
  ): Promise<{ user: User; token: string }> {
    const loginMethod = this.getLoginMethod(method);
    const user = await loginMethod.signup(info);
    const token = this.createToken(user.id);
    return { user, token };
  }

  async login(
    method: string,
    info: {}
  ): Promise<{ token: string; user: User }> {
    const loginMethod = this.getLoginMethod(method);
    const user = await loginMethod.login(info);
    const token = this.createToken(user.id);
    return { token, user };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError('This user does not exist');

    const resetCode = String(Math.floor(1000 + Math.random() * 9000));
    const text = `${resetCode} is the key to reset your password.`;

    await ResetCode.destroy({ where: { email } });
    const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
    await ResetCode.create({ email, code: resetCode, expiredAt });

    new EmailSend({ from: 'car-part', text, to: email });
  }

  async resetPassword({
    email,
    resetCode,
    newPassword,
  }: {
    email: string;
    resetCode: string;
    newPassword: string;
  }): Promise<string> {
    const validResetCode = await ResetCode.findOne({
      where: {
        email,
        code: resetCode,
        expiredAt: { [Op.lte]: Date.now() + 10 * 60 * 1000 },
      },
    });

    if (!validResetCode)
      throw new AppError('This reset code does not exist or is expired');

    const user = await User.findOne({ where: { email } });
    await new NormalLogin().updatePassword(user!.id, newPassword);
    const token = this.createToken(user!.id);
    return token;
  }

  async updateMe(userId: number, updatedFields: object): Promise<User> {
    const fieldsToUpdate = this.allowsField(updatedFields, ['name', 'email']);
    const user = await User.findByPk(userId);
    await user?.update(fieldsToUpdate);
    return user!;
  }

  async showMe(id: number): Promise<User> {
    const user = await User.findByPk(id);
    return user!;
  }

  async isLogin(token: string): Promise<number> {
    const userId = await loginChick(token);
    return userId;
  }
  async deleteMe(userId: number): Promise<void> {
    const user = await User.findByPk(userId);
    await user?.destroy();
  }
}

export default UserAuth;
