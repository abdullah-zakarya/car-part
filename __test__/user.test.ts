import UserAuth from '../src/auth/authDao/UserAuth';
import User from '../src/models/User';
import ResetCode from '../src/models/ResetCode';
import bcrypt from 'bcrypt';
import { Gender } from '../types/types';
import sequelize from '../config/database';

describe('UserAuth', () => {
  let userAuth: UserAuth;
  let userData: {
    name: string;
    email: string;
    password: string;
    gender: Gender;
  };

  beforeEach(async () => {
    userData = {
      name: 'Sara',
      email: 'sara@example.com',
      password: 'password123',
      gender: Gender.female,
    };
    userAuth = new UserAuth();
    await sequelize.sync({ force: true });


  });

  describe('Signup', () => {
    it('should successfully sign up a new user', async () => {
      const result = await userAuth.signup('normal', userData);

      compareFields(userData, result.user, 'name', 'email', 'gender');
      expect(result.token).toBeDefined();
    });

    it('should throw an error if email already exists', async () => {
      await userAuth.signup('normal', userData);

      await expect(userAuth.signup('normal', userData)).rejects.toThrow();
    });
  });

  describe('Login', () => {
    it('should successfully log in with a token', async () => {
      const { user, token } = await userAuth.signup('normal', userData);
      const id = await userAuth.isLogin(token);
      expect(id).toEqual(user.id);
    });

    it('should throw an error for an invalid token', async () => {
      await expect(userAuth.isLogin('invalid-token')).rejects.toThrow();
    });

    it('should successfully log in with valid credentials', async () => {
      const { name, email, password, gender } = userData;

      const { user } = await userAuth.signup('normal', { name, email, password, gender });
      console.log("my user", email, password);
      const result = await userAuth.login('normal', { email, password });

      expect(result.user.id).toEqual(user.id);
      expect(result.token).toBeDefined();
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
      await userAuth.signup('normal', userData);

      await expect(
        userAuth.login('normal', {
          email: userData.email,
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Forgot Password', () => {
    it('should initiate the forgot password process with a valid email', async () => {
      await userAuth.signup('normal', userData);

      await expect(
        userAuth.forgotPassword(userData.email)
      ).resolves.not.toThrow();
    });

    it('should throw an error if the email is not found', async () => {
      await expect(
        userAuth.forgotPassword('nonexistent@example.com')
      ).rejects.toThrow();
    });
  });

  describe('Reset Password', () => {
    it('should successfully reset password with a valid reset code', async () => {
      await userAuth.signup('normal', userData);
      await userAuth.forgotPassword(userData.email);

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

      // optional: تأكيد أنه يمكن تسجيل الدخول بكلمة المرور الجديدة
      const result = await userAuth.login('normal', {
        email: userData.email,
        password: newPassword,
      });

      expect(result.token).toBeDefined();
    });

    it('should throw an error if the reset code is invalid or expired', async () => {
      await userAuth.signup('normal', userData);

      await expect(
        userAuth.resetPassword({
          email: userData.email,
          resetCode: 'invalidCode',
          newPassword: 'newPassword123',
        })
      ).rejects.toThrow();
    });
  });

  describe('Update User', () => {
    it('should update user information with valid fields', async () => {
      const { user } = await userAuth.signup('normal', userData);

      const updatedFields = {
        name: 'Sara Updated',
        email: 'updated@example.com',
      };

      const updatedUser = await userAuth.updateMe(user.id, updatedFields);

      expect(updatedUser.name).toBe(updatedFields.name);
      expect(updatedUser.email).toBe(updatedFields.email);
    });

    it('should not allow updating invalid fields like role or password', async () => {
      const { user } = await userAuth.signup('normal', userData);

      const invalidFields = { role: 'admin', password: 'newPassword123' };

      const updatedUser = await userAuth.updateMe(user.id, invalidFields);

      expect(updatedUser.role).not.toBe('admin');

      const freshUser = await User.findByPk(user.id);
      const isPasswordSame = await bcrypt.compare(
        'newPassword123',
        freshUser!.password
      );

      expect(isPasswordSame).toBe(false); // Password should remain unchanged
    });
  });

  describe('Delete User', () => {
    it('should delete the user successfully', async () => {
      const { user } = await userAuth.signup('normal', userData);

      await expect(userAuth.deleteMe(user.id)).resolves.not.toThrow();

      const deletedUser = await User.findByPk(user.id);
      expect(deletedUser).toBeNull();
    });
  });

  // Helper function for comparing fields
  function compareFields(
    obj1: { [key: string]: any },
    obj2: { [key: string]: any },
    ...fields: string[]
  ) {
    for (const field of fields) {
      expect(obj1[field]).toEqual(obj2[field]);
    }
  }
});
