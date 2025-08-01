import ILoginMethod from './ILoginMethod';
import User from '../../../models/User';
import AppError from '../../../../utils/AppError';
import bcrypt from 'bcrypt';
import { HttpStatusCode } from 'axios';
export default class NormalLogin implements ILoginMethod {
  private async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const result = await bcrypt.hash(password, salt)
    return result;
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await User.findOne({ where: { email } });

    if (!user) throw new AppError('Invalid credentials', HttpStatusCode.Forbidden);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid credentials', HttpStatusCode.Forbidden);
    return user;
  }

  async signup(user: User): Promise<User> {

    user.password = await this.encryptPassword(user.password);
    const newUser = await User.create(user);
    if (!newUser) {
      console.error('Failed to create user:', newUser);
      throw new AppError('Failed to create user', HttpStatusCode.InternalServerError);
    };
    return newUser;
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const password = await this.encryptPassword(newPassword);
    await User.update({ password }, { where: { id } });
  }
}
