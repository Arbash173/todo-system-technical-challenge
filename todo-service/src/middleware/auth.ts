import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

/**
 * Extended Express Request interface that includes authenticated user information
 * This interface is populated by the authenticateToken middleware
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userUuid: string;  // Unique identifier for the user
    email: string;     // User's email address
  };
}

/**
 * JWT Authentication Middleware
 * 
 * This middleware validates JWT tokens from the Authorization header and
 * populates req.user with decoded user information for use in route handlers.
 * 
 * @param req - Express request object (will be extended with user info)
 * @param res - Express response object
 * @param next - Express next function to continue to next middleware/route
 * 
 * Flow:
 * 1. Extracts Bearer token from Authorization header
 * 2. Validates JWT token using secret key
 * 3. Decodes token payload and adds user info to req.user
 * 4. Calls next() to continue to protected route
 * 
 * Error Responses:
 * - 401: No token provided or invalid/expired token
 */
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Extract Bearer token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Verify and decode JWT token
    const decoded = verifyToken(token);
    
    // Add user information to request object for use in route handlers
    req.user = decoded;
    
    // Continue to next middleware or route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};