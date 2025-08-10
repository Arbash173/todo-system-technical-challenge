import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * PostgreSQL connection pool configuration
 * Uses connection pooling for efficient database connections
 * 
 * Configuration:
 * - connectionString: Database URL from environment variable
 * - ssl: SSL configuration based on environment (enabled in production)
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Establishes initial database connection to verify connectivity
 * This function is called during server startup to ensure the database is accessible
 * 
 * @returns Promise<void> - Resolves when connection is established, rejects on failure
 * 
 * Flow:
 * 1. Attempts to connect to PostgreSQL using the connection pool
 * 2. Logs successful connection
 * 3. Releases the connection back to the pool
 * 4. Throws error if connection fails (causing server startup to fail)
 * 
 * Note: This is a startup check only. The actual connection pool handles
 * all subsequent database operations automatically.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    // Get a client from the connection pool
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    // Release the client back to the pool
    client.release();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

/**
 * Default export of the database connection pool
 * Use this pool for all database operations in the application
 * The pool automatically manages connections and provides connection reuse
 */
export default pool;