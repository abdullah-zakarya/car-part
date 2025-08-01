import request from 'supertest';
import app from '../app';
import UserAuth from '../src/auth/authDao/UserAuth';
import Part from '../src/models/Part';
import { Gender } from '../types/types';
import User from '../src/models/User';
import { addPartRequest } from '../types/partApi';
import sequelize from '../config/database';
import { HttpStatusCode } from 'axios';

const baseUrl = '/api/v1/parts';

describe('Parts API Testing', () => {
  let partService: any;
  const auth = new UserAuth();

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    partService = request(app);
  });

  const createUserAndToken = async () => {
    const userData = {
      name: 'Test User',
      email: 'test@gmail.com',
      password: 'password',
      gender: Gender.male,
    };
    const { user, token } = await auth.signup('normal', userData);
    return { user, token };
  };

  const createPart = async (ownerId: number, princ: number = 500) => {
    const partData: addPartRequest = {
      category: 'engine',
      price: 500,
      carType: 'Sedan',
      new: true,
      brand: 'Toyota',
      madeIn: 'Japan',
      year: new Date('2022-01-01'),
      mainPhoto: 'main_photo_url',
      stock: 10,
      photos: ['photo1_url', 'photo2_url'],
      owner: ownerId,
      country: 'Egypt',
      city: 'Giza',
    };
    return await Part.create(partData);
  };
  const create10Parts = async (ownerId: number) => {
    for (let i = 0; i < 10; i++) {
      await createPart(ownerId, i * 100);
    }
  }

  describe('Add Part API Testing', () => {
    it('should add a part successfully', async () => {
      const { user, token } = await createUserAndToken();

      const newPartRequestBody: addPartRequest = {
        category: 'engine',
        price: 500,
        carType: 'toyota',
        new: true,
        brand: 'toyota',
        madeIn: 'Japan',
        year: new Date('2022-01-01'),
        mainPhoto: 'main_photo_url',
        stock: 10,
        photos: ['photo1_url', 'photo2_url'],
        owner: user.id,
        country: 'Egypt',
        city: 'Giza',
      };

      const response = await partService
        .post(baseUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(newPartRequestBody);

      expect(response.status).toBe(201);
      expect(response.body.part).toHaveProperty('id');
      expect(response.body.part).toHaveProperty('category', 'engine');
      expect(response.body.part).toHaveProperty('price', 500);
      expect(response.body.part).toHaveProperty('owner', user.id);
    });

    it('should fail with missing required fields', async () => {
      const { token } = await createUserAndToken();
      const response = await partService
        .post(baseUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          price: 500,
          brand: 'Toyota',
        });

      expect(response.status).toBe(HttpStatusCode.BadRequest);
      expect(response.body).toHaveProperty('message');
    });

    it('should fail without authorization', async () => {
      const response = await partService.post(baseUrl).send({
        category: 'motor',
        price: 4.5,
        carType: 'nisan',
        new: false,
        brand: 'abouhemmid',
        madeIn: 'Iraq',
        year: '2000',
        mainPhoto: 'urlToTheMainPhoto.com',
        stock: 3,
        photos: ['photo1', 'photo2'],
      });

      expect(response.status).toBe(HttpStatusCode.Unauthorized);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Get Part API Testing', () => {
    it('should get a part by its ID', async () => {
      const { user } = await createUserAndToken();
      const part = await createPart(user.id);

      const response = await partService.get(`${baseUrl}/${part.id}`).send();
      expect(response.status).toBe(200);
      expect(response.body.part).toHaveProperty('id', part.id);
    });

    it('should return 404 for invalid ID', async () => {
      const response = await partService.get(`${baseUrl}/9999`).send();
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Get All Parts API Testing', () => {
    it('should get all parts with pagination', async () => {
      const { user } = await createUserAndToken();

      await create10Parts(user.id);
      const response = await partService
        .get(baseUrl)
        .query({ limit: 5, page: 1 })
        .send();

      expect(response.status).toBe(200);
      expect(response.body.parts).toBeInstanceOf(Array);
      expect(response.body.parts.length).toBeLessThanOrEqual(5);
    });

    it('should sort parts by price', async () => {
      const { user } = await createUserAndToken();
      await create10Parts(user.id);
      const response = await partService
        .get(baseUrl)
        .query({ sort: 'price' })
      const parts = response.body.parts;
      expect(response.status).toBe(200);
      expect(parts).toBeInstanceOf(Array);
      expect(parts[0].price).toBeLessThanOrEqual(parts[parts.length - 1].price);

    }
    )


  });


  describe('Cart API Testing', () => {
    it('should add and remove part from cart', async () => {
      const { user, token } = await createUserAndToken();
      const part = await createPart(user.id);

      const addResponse = await partService
        .post(`${baseUrl}/${part.id}/addToCart`)
        .set('Authorization', `Bearer ${token}`)
        .send();
      expect(addResponse.status).toBe(HttpStatusCode.Accepted);

      const deleteResponse = await partService
        .delete(`${baseUrl}/${part.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();
      expect(deleteResponse.status).toBe(HttpStatusCode.NoContent);
    });

    it('should fail to add non-existent part to cart', async () => {
      const { token } = await createUserAndToken();
      const response = await partService
        .post(`${baseUrl}/9999/addToCart`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      console.log(response.body);
      expect(response.status).toBe(404);
    });

    it('should fail to remove non-existent part', async () => {
      const { token } = await createUserAndToken();
      const response = await partService
        .delete(`${baseUrl}/9999`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });
});
