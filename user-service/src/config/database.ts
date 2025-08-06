import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();


console.log('DATABASE_URL:', process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    client.release();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export default pool;