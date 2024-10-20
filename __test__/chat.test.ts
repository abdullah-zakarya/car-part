import request from 'supertest';
import { server } from '../socket'; // Adjust the path as necessary
import app from '../app';
import UserAuth from '../src/DAO/auth/UserAuth';
import { Gender } from '../types/types';
import User from '../src/models/User';

const auth = new UserAuth();

describe('Message API Testing', () => {
  let user1: User;
  let user2: User;
  let token1: string;
  let token2: string;

  beforeAll(async () => {
    const response1 = await auth.signup('normal', {
      name: 'ahmed',
      email: 'ahmed@gmail.com',
      password: 'password',
      gender: Gender.male,
    });
    user1 = response1.user;
    token1 = response1.token;

    const response2 = await auth.signup('normal', {
      name: 'mohamed',
      email: 'mohamed@gmail.com',
      password: 'password',
      gender: Gender.male,
    });
    user2 = response2.user;
    token2 = response2.token;
  });

  // Test: Send a real message
  test('Send message to an existing user', async () => {
    const response = await request(app)
      .post('/api/v1/chat/send')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        receiverId: user2.id,
        message: 'Hello, Mohamed!',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty('senderId', user1.id);
    expect(response.body.message).toHaveProperty('receiverId', user2.id);
    expect(response.body.message).toHaveProperty('message', 'Hello, Mohamed!');
  });

  // Test: Send message to a non-existent user
  test('Attempt to send message to a user that does not exist', async () => {
    const response = await request(app)
      .post('/api/v1/chat/send')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        receiverId: 9999, // Assuming 9999 is an ID that does not exist
        message: 'This user does not exist!',
      });

    expect(response.body).toHaveProperty('message', 'this user is not exist');
    expect(response.status).toBe(404);
  });

  // Test: Send message without a receiver
  test('Attempt to send message without a receiver', async () => {
    const response = await request(app)
      .post('/api/v1/chat/send')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        message: 'This message has no receiver!',
      });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      'message',
      'Receiver and message are required'
    );
  });

  // Test: Send message without content
  test('Attempt to send message without content', async () => {
    const response = await request(app)
      .post('/api/v1/chat/send')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        receiverId: user2.id,
      });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      'message',
      'Receiver and message are required'
    );
  });

  // Test: Send an empty message
  test('Attempt to send an empty message', async () => {
    const response = await request(app)
      .post('/api/v1/chat/send')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        receiverId: user2.id,
        message: '',
      });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      'message',
      'Receiver and message are required'
    );
  });

  // Test: Send message with invalid receiverId type
  test('Attempt to send message with invalid receiverId type', async () => {
    const response = await request(app)
      .post('/api/v1/chat/send')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        receiverId: 'invalid-id', // Invalid type
        message: 'This should fail!',
      });

    expect(response.status).toBe(403); // Adjust based on your validation
    expect(response.body).toHaveProperty(
      'message',
      'Receiver and message are required'
    ); // Adjust based on your implementation
  });

  // Test: Unauthorized user
  test('Attempt to send message without authorization', async () => {
    const response = await request(app).post('/api/v1/chat/send').send({
      receiverId: user2.id,
      message: 'Hello, Mohamed!',
    });

    expect(response.status).toBe(401); // Unauthorized
    expect(response.body).toHaveProperty(
      'message',
      'Authorization header is missing'
    ); // Adjust based on your implementation
  });
});
