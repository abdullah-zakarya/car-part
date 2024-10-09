import UserAuth from '../src/DAO/auth/UserAuth';
import User from '../src/models/User';
import AppError from '../utils/AppError';
import ResetCode from '../src/models/ResetCode';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Gender } from '../types';
describe('UserAuth', () => {
  let userAuth: UserAuth;
  let token: string;
  let user: User;
  let userData: Pick<User, 'name' | 'password' | 'email' | 'gender'>;

  beforeAll(async () => {
    userAuth = new UserAuth();
    await User.destroy({ where: {} });
    await ResetCode.destroy({ where: {} });
  });

  // - 1)singup
  //     normal
  it('should signup normally', async () => {
    userData = {
      name: 'Sara',
      email: 'sara@example.com',
      password: 'password123',
      gender: Gender.female,
    };

    const result = await userAuth.signup('normal', userData);
    user = result.user;
    token = result.token;
    comparFileds(userData, user, 'name', 'email', 'gender');
    expect(result.token).toBeDefined();
  });

  //     rebeat the email
  it('should throw an error if email already exists during signup', async () => {
    expect(await userAuth.signup('normal', userData)).rejects.toThrow();
  });
  //     !! sing up with google

  // - 2) login with token
  //       normal
  it('should login with token', async () => {
    const id = await userAuth.isLogin(token);
    expect(id).toEqual(user.id);
  });

  //       with invalid token
  it('should throw error if the token is not real', () => {
    expect(userAuth.isLogin('zyx')).rejects.toThrow(Error);
  });

  // - 3) login
  //      login normaliy
  it('should login normally', async () => {
    const result = await userAuth.login('normal', {
      email: userData.email,
      password: userData.password,
    });
    token = result.token;
    expect(result.user).toBe(user);
    expect(token).toBeDefined();
  });
  //      login with login token
  it('should login with login token', async () => {
    const id = await userAuth.isLogin(token);
    expect(id).toEqual(user.id);
  });
  //      invalid email
  it('should throw an error if user is not found', async () => {
    await expect(
      userAuth.login('normal', {
        email: 'nonexistent@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Invalid credentials');
  });
  //      wrong password
  it('should throw an error if the password is incorrect', async () => {
    await expect(
      userAuth.login('normal', {
        email: userData.email,
        password: 'wrongpassword',
      })
    ).rejects.toThrow('Invalid credentials');
  });
  //      !! login with google

  // - 4) forgot password
  //     real forgot

  //       real reset
  it('should initiate forgot password process with valid email', async () => {
    await expect(
      await userAuth.forgotPassword(userData.email)
    ).resolves.not.toThrow();
  });
  //     with no email
  it('should throw an error if email is not found during forgot password', async () => {
    await expect(
      await userAuth.forgotPassword('nonexistent@example.com')
    ).rejects.toThrow('this user is not exist');
  });

  // - 5) resetP password

  it('should reset password with valid reset code', async () => {
    const resetCode = await ResetCode.findOne({
      where: { email: userData.email },
    });
    const newPassword = 'newPassword123';

    const token = await userAuth.resetPassword({
      email: userData.email,
      resetCode: resetCode?.code!,
      newPassword,
    });

    expect(token).toBeDefined();

    // Verify that user can log in with the new password
    const loginResult = await userAuth.login('normal', {
      email: userData.email,
      password: newPassword,
    });

    expect(loginResult.token).toBeDefined();
  });
  //       invalid resest
  it('should throw an error if reset code is invalid or expired', async () => {
    await expect(
      await userAuth.resetPassword({
        email: userData.email,
        resetCode: 'invalidCode',
        newPassword: 'newPassword123',
      })
    ).rejects.toThrow('this reset code is not exsit or expired');
  });

  // - 6) update me
  //     1- valid update
  //       update the email
  //       update the name

  it('should update user information with valid fields', async () => {
    const updatedFields = {
      name: 'Sara Updated',
      email: 'updated@example.com',
    };

    const updatedUser = await userAuth.updateMe(user.id, updatedFields);

    expect(updatedUser.name).toBe(updatedFields.name);
    expect(updatedUser.email).toBe(updatedFields.email);
  });

  //     2- invalid update -should not do anything
  //       update the role
  //       update the password
  it('should not allow updating invalid fields like role or password', async () => {
    const invalidFields = { role: 'admin', password: 'newPassword123' };

    const updatedUser = await userAuth.updateMe(user.id, invalidFields);

    // Ensure these fields were not updated
    expect(updatedUser.role).not.toBe('admin');
    const isPasswordSame = await bcrypt.compare(
      'newPassword123',
      user.password
    );
    expect(isPasswordSame).toBe(false); // Password should remain unchanged
  });

  // - 7) delte me
  //   valid delete
  it('should delete user successfully', async () => {
    await expect(userAuth.deleteMe(user.id)).resolves.not.toThrow();

    // Ensure user is deleted
    const deletedUser = await User.findByPk(user.id);
    expect(deletedUser).toBeNull();
  });
});

// helper function
function comparFileds(
  obj1: { [key: string]: any },
  obj2: { [key: string]: any },
  ...fields: string[]
) {
  for (const field of fields) expect(obj1[field]).toEqual(obj2[field]);
}
