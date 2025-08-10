import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { generateToken } from '../utils/jwt';

/**
 * Registers a new user in the system
 * 
 * @param req - Express request object containing email and password
 * @param res - Express response object
 * @returns Promise<void> - Sends JSON response with user data or error
 * 
 * Flow:
 * 1. Extracts email and password from request body
 * 2. Checks if user with email already exists
 * 3. Creates new user with hashed password
 * 4. Returns success response with user data (excluding password)
 * 
 * Error Responses:
 * - 409: Email already registered
 * - 500: Internal server error
 * 
 * Success Response:
 * - 201: User created successfully with user data
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user registration data from request body
    const { email, password } = req.body;

    // Check if user already exists to prevent duplicate registrations
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    // Create new user with hashed password
    const user = await UserModel.create({ email, password });
    
    // Return success response with user data (excluding sensitive information)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        uuid: user.uuid,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Authenticates a user and generates JWT token for access
 * 
 * @param req - Express request object containing email and password
 * @param res - Express response object
 * @returns Promise<void> - Sends JSON response with token and user data or error
 * 
 * Flow:
 * 1. Extracts email and password from request body
 * 2. Finds user by email address
 * 3. Verifies password against stored hash
 * 4. Generates JWT token with user information
 * 5. Returns success response with token and user data
 * 
 * Error Responses:
 * - 401: Invalid credentials (user not found or wrong password)
 * - 500: Internal server error
 * 
 * Success Response:
 * - 200: Login successful with JWT token and user data
 * 
 * Security Note: Uses bcrypt to compare password hashes securely
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;

    // Find user by email address
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password using secure hash comparison
    const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token for authenticated user
    const token = generateToken({
      userUuid: user.uuid,
      email: user.email
    });

    // Return success response with token and user data
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        uuid: user.uuid,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};