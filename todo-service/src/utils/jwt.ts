import jwt from 'jsonwebtoken';

/**
 * JWT secret key for signing and verifying tokens
 * Uses environment variable JWT_SECRET or falls back to a default key
 * 
 * WARNING: In production, always set JWT_SECRET environment variable
 * The fallback secret is only for development purposes
 */
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

/**
 * JWT payload interface defining the structure of user data in tokens
 * This data is encoded in the JWT and can be decoded to identify users
 */
export interface JWTPayload {
  userUuid: string;  // Unique identifier for the user
  email: string;     // User's email address for identification
}

/**
 * Generates a new JWT token for user authentication
 * 
 * @param payload - User data to encode in the token
 * @returns string - JWT token string
 * 
 * Token Configuration:
 * - Algorithm: HS256 (HMAC SHA-256)
 * - Expiration: 24 hours from creation
 * - Secret: Uses JWT_SECRET environment variable
 * 
 * Usage: Send this token in Authorization header as "Bearer <token>"
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

/**
 * Verifies and decodes a JWT token to extract user information
 * 
 * @param token - JWT token string to verify
 * @returns JWTPayload - Decoded user data from the token
 * @throws Error - If token is invalid, expired, or malformed
 * 
 * Verification Process:
 * 1. Validates token signature using JWT_SECRET
 * 2. Checks token expiration
 * 3. Decodes payload and returns user data
 * 
 * Note: This function will throw an error for invalid tokens,
 * so it should be used in try-catch blocks
 */
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};