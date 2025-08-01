import request from 'supertest';
import app from '../app';
import UserAuth from '../src/auth/authDao/UserAuth';
import { Gender } from '../types/types';
import User from '../src/models/User';
import Message from '../src/models/Message';
import { HttpStatusCode } from 'axios';
import sequelize from '../config/database';

const auth = new UserAuth();

describe('Message API Testing', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  const createUserAndToken = async (name: string, email: string) => {
    const response = await auth.signup('normal', {
      name,
      email,
      password: 'password',
      gender: Gender.male,
    });
    return { user: response.user, token: response.token };
  };

  describe('sendMessage testing', () => {
    it('should send a message to an existing user', async () => {
      const { user: sender, token: token1 } = await createUserAndToken('ahmed', 'ahmed@gmail.com');
      const { user: receiver } = await createUserAndToken('mohamed', 'mohamed@gmail.com');

      const response = await request(app)
        .post('/api/v1/chat/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          receiverId: receiver.id,
          message: 'Hello, Mohamed!',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toHaveProperty('senderId', sender.id);
      expect(response.body.message).toHaveProperty('receiverId', receiver.id);
      expect(response.body.message).toHaveProperty('message', 'Hello, Mohamed!');
    });

    it('should return 404 if receiver does not exist', async () => {
      const { token: token1 } = await createUserAndToken('ahmed', 'ahmed@gmail.com');

      const response = await request(app)
        .post('/api/v1/chat/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          receiverId: 9999,
          message: 'This user does not exist!',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'This user does not exist');
    });

    it('should return 400 if receiver is missing', async () => {
      const { token: token1 } = await createUserAndToken('ahmed', 'ahmed@gmail.com');

      const response = await request(app)
        .post('/api/v1/chat/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({ message: 'No receiver' });

      expect(response.status).toBe(HttpStatusCode.BadRequest);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 if message is missing', async () => {
      const { token: token1, user: receiver } = await createUserAndToken('ahmed', 'ahmed@gmail.com');

      const response = await request(app)
        .post('/api/v1/chat/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({ receiverId: receiver.id });

      expect(response.status).toBe(HttpStatusCode.BadRequest);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 if message is empty', async () => {
      const { token: token1, user: receiver } = await createUserAndToken('ahmed', 'ahmed@gmail.com');

      const response = await request(app)
        .post('/api/v1/chat/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({ receiverId: receiver.id, message: '' });

      expect(response.status).toBe(HttpStatusCode.BadRequest);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid receiverId type', async () => {
      const { token: token1 } = await createUserAndToken('ahmed', 'ahmed@gmail.com');

      const response = await request(app)
        .post('/api/v1/chat/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({ receiverId: 'invalid-id', message: 'test' });

      expect(response.status).toBe(HttpStatusCode.BadRequest);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authorization', async () => {
      const { user: receiver } = await createUserAndToken('mohamed', 'mohamed@gmail.com');

      const response = await request(app)
        .post('/api/v1/chat/send')
        .send({ receiverId: receiver.id, message: 'Hello!' });

      expect(response.status).toBe(HttpStatusCode.Unauthorized);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('get all chat testing', () => {
    it('should retrieve all chats for a user', async () => {
      const { user: user1, token: token1 } = await createUserAndToken('ahmed', 'ahmed@gmail.com');
      const { user: user2 } = await createUserAndToken('mohamed', 'mohamed@gmail.com');

      for (let i = 0; i < 15; i++) {
        await Message.create({
          senderId: user2.id,
          receiverId: user1.id,
          message: `Message ${i}`,
        });
      }

      const response = await request(app)
        .get('/api/v1/chat/all')
        .set('Authorization', `Bearer ${token1}`)
        .query({ limit: 10, page: 1 });

      expect(response.status).toBe(200);
      expect(response.body.chats).toBeInstanceOf(Array);
      expect(response.body.chats.length).toBeLessThanOrEqual(10);
    });

    it('should retrieve chat between two users', async () => {
      const { user: user1, token: token1 } = await createUserAndToken('ahmed', 'ahmed@gmail.com');
      const { user: user2 } = await createUserAndToken('mohamed', 'mohamed@gmail.com');

      for (let i = 0; i < 10; i++) {
        await Message.create({
          senderId: user1.id,
          receiverId: user2.id,
          message: `Msg ${i}`,
        });
      }

      const response = await request(app)
        .get(`/api/v1/chat/${user2.id}`)
        .set('Authorization', `Bearer ${token1}`)
        .query({ limit: 10, page: 1 });

      expect(response.status).toBe(200);
      expect(response.body.messages).toBeInstanceOf(Array);
      expect(response.body.messages.length).toBeLessThanOrEqual(10);
    });

    it('should return 404 if chatting with non-existent user', async () => {
      const { token: token1 } = await createUserAndToken('ahmed', 'ahmed@gmail.com');

      const response = await request(app)
        .get(`/api/v1/chat/9999`)
        .set('Authorization', `Bearer ${token1}`)
        .query({ limit: 10, page: 1 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });
});
