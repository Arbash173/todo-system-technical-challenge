import { Pool } from 'pg';

// Test database setup
const testPool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL || 'postgresql://todouser:todopass@localhost:5432/tododb_test',
});

beforeAll(async () => {
  // Create test tables
  await testPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      user_uuid UUID NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

afterAll(async () => {
  // Clean up test data
  await testPool.query('TRUNCATE todos CASCADE');
  await testPool.query('TRUNCATE users CASCADE');
  await testPool.end();
});