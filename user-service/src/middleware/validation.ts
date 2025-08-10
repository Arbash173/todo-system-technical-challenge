import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

/**
 * Joi validation schema for user registration
 * - email: Must be a valid email format and is required
 * - password: Must be at least 6 characters long and is required
 */
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

/**
 * Joi validation schema for user login
 * - email: Must be a valid email format and is required
 * - password: Must be provided (no length requirement for login)
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * Validation middleware for user registration
 * 
 * Validates request body against registerSchema before allowing
 * the request to proceed to the registration controller.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * 
 * Validation Rules:
 * - Email must be in valid format (e.g., user@example.com)
 * - Password must be at least 6 characters long
 * 
 * Error Response:
 * - 400: Bad Request with specific validation error message
 */
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body against the registration schema
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

/**
 * Validation middleware for user login
 * 
 * Validates request body against loginSchema before allowing
 * the request to proceed to the login controller.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * 
 * Validation Rules:
 * - Email must be in valid format (e.g., user@example.com)
 * - Password must be provided (no length requirement)
 * 
 * Error Response:
 * - 400: Bad Request with specific validation error message
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body against the login schema
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};