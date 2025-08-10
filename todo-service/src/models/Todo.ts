import pool from '../config/database';

/**
 * Todo entity interface representing a todo item in the database
 */
export interface Todo {
  id: number;                    // Unique identifier for the todo
  user_uuid: string;            // Foreign key to users table
  title: string;                // Todo title (required)
  description?: string;          // Optional description
  completed: boolean;            // Completion status
  created_at: Date;             // Timestamp when todo was created
  updated_at: Date;             // Timestamp when todo was last updated
}

/**
 * Data structure for creating a new todo item
 * Only includes fields that are required/optional during creation
 */
export interface CreateTodoData {
  user_uuid: string;            // User who owns the todo
  title: string;                // Todo title (required)
  description?: string;          // Optional description
}

/**
 * Data structure for updating an existing todo item
 * All fields are optional to allow partial updates
 */
export interface UpdateTodoData {
  title?: string;                // New title (optional)
  description?: string;          // New description (optional)
  completed?: boolean;           // New completion status (optional)
}

/**
 * TodoModel class provides database operations for todo items
 * Uses parameterized queries to prevent SQL injection
 * All methods are static for easy access without instantiation
 */
export class TodoModel {
  /**
   * Creates a new todo item in the database
   * 
   * @param todoData - Object containing todo creation data
   * @returns Promise<Todo> - The created todo item with all fields populated
   * 
   * SQL: INSERT INTO todos (user_uuid, title, description) VALUES ($1, $2, $3) RETURNING *
   */
  static async create(todoData: CreateTodoData): Promise<Todo> {
    const { user_uuid, title, description } = todoData;
    
    const query = `
      INSERT INTO todos (user_uuid, title, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [user_uuid, title, description]);
    return result.rows[0];
  }

  /**
   * Retrieves all todo items for a specific user
   * Results are ordered by creation date (newest first)
   * 
   * @param userUuid - Unique identifier of the user
   * @returns Promise<Todo[]> - Array of todo items belonging to the user
   * 
   * SQL: SELECT * FROM todos WHERE user_uuid = $1 ORDER BY created_at DESC
   */
  static async findByUserUuid(userUuid: string): Promise<Todo[]> {
    const query = 'SELECT * FROM todos WHERE user_uuid = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userUuid]);
    return result.rows;
  }

  /**
   * Finds a todo item by its unique ID
   * 
   * @param id - Unique identifier of the todo item
   * @returns Promise<Todo | null> - Todo item if found, null otherwise
   * 
   * SQL: SELECT * FROM todos WHERE id = $1
   */
  static async findById(id: number): Promise<Todo | null> {
    const query = 'SELECT * FROM todos WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Updates an existing todo item with new data
   * Only updates fields that are provided in updateData
   * Automatically updates the updated_at timestamp
   * Ensures only the owner can update their todos
   * 
   * @param id - Unique identifier of the todo item
   * @param userUuid - UUID of the user (for authorization)
   * @param updateData - Object containing fields to update
   * @returns Promise<Todo | null> - Updated todo item if successful, null otherwise
   * 
   * SQL: UPDATE todos SET field1 = $1, field2 = $2, updated_at = CURRENT_TIMESTAMP 
   *      WHERE id = $3 AND user_uuid = $4 RETURNING *
   */
  static async update(id: number, userUuid: string, updateData: UpdateTodoData): Promise<Todo | null> {
    // Build dynamic update query based on provided fields
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Add title to update if provided
    if (updateData.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(updateData.title);
    }
    
    // Add description to update if provided
    if (updateData.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updateData.description);
    }
    
    // Add completed status to update if provided
    if (updateData.completed !== undefined) {
      fields.push(`completed = $${paramCount++}`);
      values.push(updateData.completed);
    }

    // Return null if no fields to update
    if (fields.length === 0) {
      return null;
    }

    // Always update the updated_at timestamp
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add WHERE clause parameters (id and user_uuid)
    values.push(id, userUuid);

    const query = `
      UPDATE todos 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount++} AND user_uuid = $${paramCount++}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Deletes a todo item from the database
   * Ensures only the owner can delete their todos
   * 
   * @param id - Unique identifier of the todo item
   * @param userUuid - UUID of the user (for authorization)
   * @returns Promise<boolean> - True if todo was deleted, false otherwise
   * 
   * SQL: DELETE FROM todos WHERE id = $1 AND user_uuid = $2
   */
  static async delete(id: number, userUuid: string): Promise<boolean> {
    const query = 'DELETE FROM todos WHERE id = $1 AND user_uuid = $2';
    const result = await pool.query(query, [id, userUuid]);
    
    // Return true if at least one row was affected (deleted)
    return (result.rowCount ?? 0) > 0;
  }
}