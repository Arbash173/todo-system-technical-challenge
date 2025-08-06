import pool from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  uuid: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const { email, password } = userData;
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING uuid, email, created_at, updated_at
    `;
    
    const result = await pool.query(query, [email, password_hash]);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findByUuid(uuid: string): Promise<User | null> {
    const query = 'SELECT uuid, email, created_at, updated_at FROM users WHERE uuid = $1';
    const result = await pool.query(query, [uuid]);
    return result.rows[0] || null;
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}