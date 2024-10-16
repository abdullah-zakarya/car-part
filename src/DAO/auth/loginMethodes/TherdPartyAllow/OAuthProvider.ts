import ILoginMethod from '../ILoginMethod';
import User from '../../../../models/User';
import AppError from '../../../../../utils/AppError';
import { OAuthArgu } from '../../../../../types/types';
abstract class OAuthProvider implements ILoginMethod {
  protected abstract getAccessToken(obj: OAuthArgu): Promise<string>;

  protected abstract getUserInfo(
    accessToken: string
  ): Promise<{ name: string; email: string; photo: string }>;

  // Signup method
  async signup(obj: OAuthArgu): Promise<User> {
    const accessToken = await this.getAccessToken(obj);
    const userInfo = await this.getUserInfo(accessToken);
    let user = await User.findOne({ where: { email: userInfo.email } });
    if (user) throw new AppError('this email is already exist');

    user = await User.create({
      name: userInfo.name,
      email: userInfo.email,
      photo: userInfo.photo,
    });

    return user;
  }

  // Login method
  async login(obj: OAuthArgu): Promise<User> {
    const accessToken = await this.getAccessToken(obj);
    const userInfo = await this.getUserInfo(accessToken);
    // Check if user exists in the database
    const user = await User.findOne({
      where: { email: userInfo.email },
    });
    if (!user) throw new AppError('this user is not exist');

    return user;
  }
}

export default OAuthProvider;
