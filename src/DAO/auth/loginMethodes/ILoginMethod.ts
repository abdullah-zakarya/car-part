import User from '../../models/User';

interface ILoginMethod {
  login(obj: {}): Promise<User>;
  signup(obj: {}): Promise<User>;
}

export default ILoginMethod;
