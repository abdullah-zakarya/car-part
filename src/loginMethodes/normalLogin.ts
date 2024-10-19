import ILoginMethod from './ILoginMethod';
import User from '../models/User';
import AppError from '../../utils/AppError';
import bcrypt from 'bcrypt';

export default class NormalLogin implements ILoginMethod {
  private async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid credentials', 403);
    }
    return user;
  }

  async signup(user: User): Promise<User> {
    user.password = await this.encryptPassword(user.password);
    const newUser = await User.create(user);
    if (!newUser) throw new AppError('Failed to create user');
    return newUser;
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const hashedPassword = await this.encryptPassword(newPassword);
    await User.update({ password: hashedPassword }, { where: { id } });
  }
}
