import UserAuth from '../src/DAO/auth/UserAuth';
import User from '../src/models/User';
import AppError from '../utils/AppError';
import ResetCode from '../src/models/ResetCode';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Gender } from '../types/types';

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

  // User Signup Tests
  describe('Signup', () => {
    it('should successfully sign up a new user', async () => {
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

    it('should throw an error if email already exists', async () => {
      await expect(userAuth.signup('normal', userData)).rejects.toThrow();
    });

    // Additional signup tests can be added here
  });

  // User Login Tests
  describe('Login', () => {
    it('should successfully log in with a token', async () => {
      const id = await userAuth.isLogin(token);
      expect(id).toEqual(user.id);
    });

    it('should throw an error for an invalid token', async () => {
      await expect(userAuth.isLogin('invalid-token')).rejects.toThrow();
    });

    it('should successfully log in with valid credentials', async () => {
      const result = await userAuth.login('normal', {
        email: userData.email,
        password: userData.password,
      });

      token = result.token;
      expect(result.user.id).toEqual(user.id);
      expect(token).toBeDefined();
    });

    it('should throw an error if the user is not found', async () => {
      await expect(
        userAuth.login('normal', {
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error if the password is incorrect', async () => {
      await expect(
        userAuth.login('normal', {
          email: userData.email,
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });

    // Additional login tests can be added here
  });

  // Password Recovery Tests
  describe('Forgot Password', () => {
    it('should initiate the forgot password process with a valid email', async () => {
      await expect(
        userAuth.forgotPassword(userData.email)
      ).resolves.not.toThrow();
    });

    it('should throw an error if the email is not found', async () => {
      await expect(
        userAuth.forgotPassword('nonexistent@example.com')
      ).rejects.toThrow();
    });

    // Additional forgot password tests can be added here
  });

  // Password Reset Tests
  describe('Reset Password', () => {
    it('should successfully reset password with a valid reset code', async () => {
      const resetCode = await ResetCode.findOne({
        where: { email: userData.email },
      });
      const newPassword = 'newPassword123';

      const result = await userAuth.resetPassword({
        email: userData.email,
        resetCode: resetCode?.code!,
        newPassword,
      });

      expect(result).toBeDefined();

      // Verify user can log in with the new password
      const loginResult = await userAuth.login('normal', {
        email: userData.email,
        password: newPassword,
      });

      expect(loginResult.token).toBeDefined();
    });

    it('should throw an error if the reset code is invalid or expired', async () => {
      await expect(
        userAuth.resetPassword({
          email: userData.email,
          resetCode: 'invalidCode',
          newPassword: 'newPassword123',
        })
      ).rejects.toThrow();
    });

    // Additional reset password tests can be added here
  });

  // User Update Tests
  describe('Update User', () => {
    it('should update user information with valid fields', async () => {
      const updatedFields = {
        name: 'Sara Updated',
        email: 'updated@example.com',
      };

      const updatedUser = await userAuth.updateMe(user.id, updatedFields);

      expect(updatedUser.name).toBe(updatedFields.name);
      expect(updatedUser.email).toBe(updatedFields.email);
    });

    it('should not allow updating invalid fields like role or password', async () => {
      const invalidFields = { role: 'admin', password: 'newPassword123' };

      const updatedUser = await userAuth.updateMe(user.id, invalidFields);

      expect(updatedUser.role).not.toBe('admin');
      const isPasswordSame = await bcrypt.compare(
        'newPassword123',
        user.password
      );
      expect(isPasswordSame).toBe(false); // Password should remain unchanged
    });

    // Additional update user tests can be added here
  });

  // User Deletion Tests
  describe('Delete User', () => {
    it('should delete the user successfully', async () => {
      await expect(userAuth.deleteMe(user.id)).resolves.not.toThrow();

      // Ensure the user is deleted
      const deletedUser = await User.findByPk(user.id);
      expect(deletedUser).toBeNull();
    });

    // Additional delete user tests can be added here
  });

  // Helper function for field comparison
  function comparFileds(
    obj1: { [key: string]: any },
    obj2: { [key: string]: any },
    ...fields: string[]
  ) {
    for (const field of fields) {
      expect(obj1[field]).toEqual(obj2[field]);
    }
  }
});
