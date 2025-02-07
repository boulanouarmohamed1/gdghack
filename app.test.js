const request = require('supertest');
const app = require('/Users/bml/Desktop/Code.BML/gdghack/app.js'); // Replace with the correct path to your app.js file

describe('POST /posts/search', () => {
  it('should return an array of posts matching the search query', async () => {
    const response = await request(app)
      .get('/posts/search')
      .query({ search: 'example' }); // Replace 'example' with your desired search query

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return an empty array if no posts match the search query', async () => {
    const response = await request(app)
      .get('/posts/search')
      .query({ search: 'nonexistent' }); // Replace 'nonexistent' with a search query that won't match any posts

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return an error if the search query is missing', async () => {
    const response = await request(app)
      .get('/posts/search');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email is required!');
  });

  it('should return an error if there is an internal server error', async () => {
    // Mock an error in the route handler
    jest.spyOn(Post, 'find').mockRejectedValueOnce(new Error('Internal server error'));

    const response = await request(app)
      .get('/posts/search')
      .query({ search: 'example' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error fetching posts');
    expect(response.body).toHaveProperty('error');
  });
});const request = require('supertest');
const app = require('/Users/bml/Desktop/Code.BML/gdghack/app.js'); // Replace with the correct path to your app.js file

describe('POST /users', () => {
  it('should create a new user and return a success message', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@example.com' }); // Replace with the desired user data

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User saved successfully!');
    expect(response.body).toHaveProperty('data');
  });

  it('should return an error if there is a problem saving the user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John Doe' }); // Missing required email field

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Error saving user');
    expect(response.body).toHaveProperty('details');
  });
});

describe('GET /users', () => {
  it('should return an array of users', async () => {
    const response = await request(app)
      .get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return an error if there is a problem fetching users', async () => {
    // Mock an error in the database query
    jest.spyOn(User, 'find').mockRejectedValueOnce(new Error('Internal server error'));

    const response = await request(app)
      .get('/users');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Error fetching users');
    expect(response.body).toHaveProperty('details');
  });
});

describe('GET /posts', () => {
  it('should return an array of posts belonging to the user', async () => {
    const response = await request(app)
      .get('/posts')
      .query({ email: 'johndoe@example.com' }); // Replace with the desired user email

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return an error if the user is not found', async () => {
    const response = await request(app)
      .get('/posts')
      .query({ email: 'nonexistent@example.com' }); // Replace with a non-existent user email

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found!');
  });

  it('should return an error if the email is missing', async () => {
    const response = await request(app)
      .get('/posts');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email is required!');
  });

  it('should return an error if there is a problem fetching posts', async () => {
    // Mock an error in the database query
    jest.spyOn(Post, 'find').mockRejectedValueOnce(new Error('Internal server error'));

    const response = await request(app)
      .get('/posts')
      .query({ email: 'johndoe@example.com' }); // Replace with the desired user email

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error fetching posts');
    expect(response.body).toHaveProperty('error');
  });
});