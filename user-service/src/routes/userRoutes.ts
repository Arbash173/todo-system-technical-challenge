import express from 'express';
import { register, login } from '../controllers/userController';
import { validateRegister, validateLogin } from '../middleware/validation';

/**
 * Express router for user authentication endpoints
 * These routes handle user registration and login without requiring authentication
 */
const router = express.Router();

/**
 * User authentication endpoints:
 * - POST /register: Create a new user account
 * - POST /login: Authenticate existing user and receive JWT token
 * 
 * Both endpoints use validation middleware to ensure data integrity:
 * - validateRegister: Validates email format and password requirements
 * - validateLogin: Validates login credentials format
 * 
 * Request Format:
 * - register: { email: string, password: string }
 * - login: { email: string, password: string }
 * 
 * Response Format:
 * - register: 201 with user data (excluding password)
 * - login: 200 with JWT token and user data
 */
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;