import request from 'supertest';
import app from '../app'; // Ensure this points to your app setup file
import UserAuth from '../src/auth/authDao/UserAuth';
import Part from '../src/models/Part';
import { Gender } from '../types/types';
import User from '../src/models/User';
import {addPartRequest } from '../types/partApi'
const auth = new UserAuth();

// 1.
// Test for getting a part by its ID:
// Test with a valid ID.
// Test with an invalid ID (e.g., non-numeric ID).
// Test with a non-existent ID.
// 2.
// Test for getting all parts:
// Test without filters, sorting, and pagination.
// Test with filters.
// Test with sorting.
// Test with pagination.
// Test with invalid filters.
// 3.
// Test for adding a new part to the database:
// Test with valid data.
// Test with missing required fields.
// Test with not logged in user.
// 4.
// Test for adding a part to the user's cart:
// Test with a valid part ID and logged in user.
// Test with an invalid part ID.
// Test with not logged in user.
// 5.
// Test for removing a part from the user's cart:
// Test with a valid part ID and logged in user.
// Test with an invalid part ID or non-existent part ID in the cart.
// Test with not logged in

// describe('Parts API Testing', () => {
//   let user: User;
//   let token: string;
//   let partId: number;
//   let partService :any ;
//   const baseUrl = '/api/v1/parts';
//   beforeAll(async () => {
//     // init 
//     partService = request(app);
//     // Sign up a user for authenticated routes
//     describe('it initlize the environment', async() => {
    
//     it('should sign up a user', async () => {


//       const userData = {
//         name: 'Test User',
//         email: 'test@gmail.com', 
//         password : 'password',
//         gender : Gender.male
//       }

//     const response = await auth.signup('normal', userData);
//     user = response.user;
//     token = response.token;
//     expect(user).toHaveProperty('id');
//     expect(token).toBeDefined();
//     })
//     // add defualt part :
//     it('should add a default part', async () => { 
//     const part = await Part.create({
//       category: 'engine',
//       price: 500,
//       carType: 'Sedan',
//       new: true,
//       brand: 'Toyota',
//       madeIn: 'Japan',
//       year: new Date('2022-01-01'),
//       mainPhoto: 'main_photo_url',
//       stock: 10,
//       photos: ['photo1_url', 'photo2_url'],
//       owner: user.id,
//       country: 'Egypt',
//       city: 'Giza'
//     });
//     partId = part.id;
//     expect(part).toHaveProperty('id');
//     })
//     // add 10 parts to the database
//     for (let i = 0; i < 10; i++) {
//       await Part.create({
//         category: 'engine',
//         price: 100 + i * 100,
//         carType: 'Sedan',
//         new: true,
//         brand: 'Toyota',
//         madeIn: 'Japan',
//         year: new Date('2022-01-01'),
//         mainPhoto: 'main_photo_url',
//         stock: 10,
//         photos: ['photo1_url', 'photo2_url'],
//         owner: user.id,
//         country: 'Egypt',
//         city: 'Giza'
//       });
//     }
//     console.log(user.id, token, partId);
//   });
//   });

//   describe('Add Part API Testing', () => {
//     /**
//      * This function tests the Add Part API.
//      *
//      * It signs up a user for authenticated routes, then performs several tests to ensure the API functionality.
//      *
//      * @param {User} user - The user object.
//      * @param {string} token - The authentication token for the user.
//      * @param {number} partId - The ID of the part being tested.
//      *
//      * @returns {void} - This function does not return a value.
//      */
//     it('should add a part successfully', async () => {

//       const newPartRequestBody : addPartRequest = {
//         category: 'engine',
//         price: 500,
//         carType: 'Sedan',
//         new: true,
//         brand: 'Toyota',
//         madeIn: 'Japan',
//         year: new Date('2022-01-01'),
//         mainPhoto: 'main_photo_url',
//         stock: 10,
//         photos: ['photo1_url', 'photo2_url'],
//         owner: 0,
//         country: 'Egypt',
//         city: 'Giza'
//       }
//       const response = await partService.post(baseUrl)
//         .set('Authorization', `Bearer ${token}`)
//         .send(newPartRequestBody);
//       expect(response.status).toBe(201);
//       expect(response.body.part).toHaveProperty('id');
//       expect(response.body.part).toHaveProperty('category', 'engine');
//       expect(response.body.part).toHaveProperty('price', 500);
//       expect(response.body.part).toHaveProperty('owner', user.id);
//     });

//     // Test: Add a part with missing required fields
//     it('should fail to add a part with missing required fields', async () => {
//       const response = await partService
//         .post('baseUrl')
//         .set('Authorization', `Bearer ${token}`)
//         .send({
//           price: 500,
//           brand: 'Toyota',
//         });

//       expect(response.status).toBe(400);
//       expect(response.body).toHaveProperty('message');
//     });

//     // Test: Add a part without authorization
//     it('should fail to add a part without authorization', async () => {
//       const response = await partService
//         .post(baseUrl)
//         .send({
//           category: 'motor',
//           price: 4.5,
//           carType: 'nisan',
//           new: false,
//           brand: 'abouhemmid',
//           madeIn: 'Iraq',
//           year: '2000',
//           mainPhoto: 'urlToTheMainPhoto.com',
//           stock: 3,
//           photos: ['photo1', 'photo2'],
//         });
//       expect(response.status).toBe(403);
//       expect(response.body).toHaveProperty('message');
//     });
//   });

//   describe('Get Part API Testing', () => {
//     // Test: Get a part by ID
//     it('should get a part by its ID', async () => {
//       const response = await partService.get(`${baseUrl}/${partId}`).send();
//       expect(response.status).toBe(200);
//       expect(response.body.part).toHaveProperty('id', partId);
//     });

//     // Test: Attempt to get a part with invalid ID
//     it('should fail to get a part with invalid ID', async () => {
//       const response = await partService
//         .get(`${baseUrl}/invalid-id`) // Invalid ID type
//         .send();

//       expect(response.status).toBe(404);
//       expect(response.body).toHaveProperty('message');
//     });

//   });

//   describe('Get All Parts API Testing', () => {
//     // Test: Get all parts with pagination
//     it('should get all parts with pagination', async () => {
//       const response = await request(app)
//         .get('/api/parts')
//         .query({ limit: 5, page: 1 })
//         .send();

//       expect(response.status).toBe(200);
//       expect(response.body.parts).toBeInstanceOf(Array);
//       expect(response.body.parts.length).toBeLessThanOrEqual(5); // Assuming pagination limit is 5
//     });

//     // Test: Get all parts with sorting
//     it('should get all parts sorted by price', async () => {
//       const response = await request(app)
//         .get('/api/parts')
//         .query({ sort: 'price' })
//         .send();

//       expect(response.status).toBe(200);
//       expect(response.body.parts).toBeInstanceOf(Array);
//     });

//     // Test: Get all parts with invalid query parameters
//     it('should fail with invalid query parameters', async () => {
//       const response = await request(app)
//         .get('/api/parts')
//         .query({ limit: 'invalid' }) // Invalid limit parameter
//         .send();

//       expect(response.status).toBe(400); // Adjust if validation for query parameters is implemented
//     });
//   });

//   describe('Cart API Testing', () => {
//     // Test: Add a part to cart
//     it('should add a part to the cart', async () => {
//       const response = await request(app)
//         .post(`/api/${partId}/addToCart`)
//         .set('Authorization', `Bearer ${token}`)
//         .send();

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('message', 'Part added to cart');
//     });

//     // Test: Remove a part from the cart
//     it('should remove a part from the cart', async () => {
//       const response = await request(app)
//         .delete(`/api/${partId}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send();

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('message', 'Part removed from cart');
//     });

//     // Test: Add a non-existent part to the cart
//     it('should fail to add a non-existent part to the cart', async () => {
//       const response = await request(app)
//         .post('/api/9999/addToCart') // Non-existent part ID
//         .set('Authorization', `Bearer ${token}`)
//         .send();

//       expect(response.status).toBe(404);
//       expect(response.body).toHaveProperty('message', 'Part not found');
//     });

//     // Test: Remove a non-existent part from the cart
//     it('should fail to remove a non-existent part from the cart', async () => {
//       const response = await request(app)
//         .delete('/api/9999') // Non-existent part ID
//         .set('Authorization', `Bearer ${token}`)
//         .send();

//       expect(response.status).toBe(404);
//       expect(response.body).toHaveProperty('message', 'Part not found');
//     });
//   });
//   it('it should delete a non-existent part from the cart', async () => {
//     const response = await request(app)
//       .delete('/api/9999') // Non-existent part ID
//       .set('Authorization', `Bearer ${token}`)
//       .send();
//   });

//   afterAll(async () => {
//     await Part.destroy(); // Clean up the added part after tests
//     await user.destroy(); // Clean up the user after tests
//     // print validation
//   });
// });
