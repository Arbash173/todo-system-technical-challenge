import express from 'express';
import { createTodo, getTodos, updateTodo, deleteTodo } from '../controllers/todoController';
import { authenticateToken } from '../middleware/auth';

/**
 * Express router for todo-related endpoints
 * All routes in this router require valid JWT authentication
 */
const router = express.Router();

/**
 * Authentication middleware
 * Applied to all routes in this router to ensure only authenticated users can access
 * Adds user information to req.user for use in controllers
 */
router.use(authenticateToken);

/**
 * Todo CRUD endpoints:
 * - POST /: Create a new todo item
 * - GET /: Retrieve all todos for the authenticated user
 * - PUT /:id: Update an existing todo item by ID
 * - DELETE /:id: Delete a todo item by ID
 * 
 * All endpoints require valid JWT token in Authorization header
 * Format: Authorization: Bearer <token>
 */
router.post('/', createTodo);
router.get('/', getTodos);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;