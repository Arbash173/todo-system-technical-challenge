import request from 'supertest';
import app from '../src/index';
import { generateToken } from '../src/utils/jwt';

const testUser = {
  userUuid: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com'
};

const authToken = generateToken(testUser);

describe('Todo Service', () => {
  describe('POST /api/todos', () => {
    it('should create a new todo with valid token', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo'
      };

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData)
        .expect(201);

      expect(response.body.message).toBe('Todo created successfully');
      expect(response.body.todo.title).toBe(todoData.title);
      expect(response.body.todo.description).toBe(todoData.description);
      expect(response.body.todo.user_uuid).toBe(testUser.userUuid);
    });

    it('should return 401 without token', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });

    it('should return 400 for invalid data', async () => {
      const todoData = {
        // Missing required title
        description: 'This is a test todo'
      };

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/todos', () => {
    it('should get todos for authenticated user', async () => {
      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.todos).toBeDefined();
      expect(Array.isArray(response.body.todos)).toBe(true);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/todos')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('PUT /api/todos/:id', () => {
    let todoId: number;

    beforeEach(async () => {
      // Create a todo first
      const createResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Todo to update',
          description: 'Original description'
        });
      
      todoId = createResponse.body.todo.id;
    });

    it('should update todo with valid data', async () => {
      const updateData = {
        title: 'Updated Todo',
        description: 'Updated description',
        completed: true
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Todo updated successfully');
      expect(response.body.todo.title).toBe(updateData.title);
      expect(response.body.todo.completed).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .put('/api/todos/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('Todo not found');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let todoId: number;

    beforeEach(async () => {
      // Create a todo first
      const createResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Todo to delete',
          description: 'Will be deleted'
        });
      
      todoId = createResponse.body.todo.id;
    });

    it('should delete todo successfully', async () => {
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .delete('/api/todos/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error).toBe('Todo not found');
    });
  });
});