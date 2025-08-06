import request from 'supertest';
import app from '../src/index';

describe('User Service', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.uuid).toBeDefined();
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123'
      };

      // Register first user
      await request(app)
        .post('/api/users/register')
        .send(userData);

      // Try to register with same email
      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(409);

      expect(response.body.error).toBe('Email already registered');
    });

    it('should return 400 for invalid data', async () => {
      const userData = {
        email: 'invalid-email',
        password: '123' // too short
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Register a test user
      await request(app)
        .post('/api/users/register')
        .send({
          email: 'login-test@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'login-test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'login-test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 401 for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });
});