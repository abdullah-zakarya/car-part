import ILoginMethod from './ILoginMethod';
import User from '../../../models/User';
import AppError from '../../../../utils/AppError';
import bcrypt from 'bcrypt';

export default class NormalLogin implements ILoginMethod {
  private async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async login(obj: { email: string; password: string }): Promise<User> {
    const user = await User.findOne({ where: { email: obj.email } });
    if (!user || !(await bcrypt.compare(obj.password, user.password))) {
      throw new AppError('Invalid credentials');
    }
    return user;
  }

  async signup(user: User): Promise<User> {
    user.password = await this.encryptPassword(user.password);
    const newUser = await User.create(user);
    if (!newUser) throw new AppError('Failed to create user');
    return newUser;
  }
  async updatePassword(id: number, newPassword: string) {
    const password = await this.encryptPassword(newPassword);
    User.update({ password }, { where: { id } });
  }
}
