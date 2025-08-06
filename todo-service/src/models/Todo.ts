import pool from '../config/database';

export interface Todo {
  id: number;
  user_uuid: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTodoData {
  user_uuid: string;
  title: string;
  description?: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export class TodoModel {
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

  static async findByUserUuid(userUuid: string): Promise<Todo[]> {
    const query = 'SELECT * FROM todos WHERE user_uuid = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userUuid]);
    return result.rows;
  }

  static async findById(id: number): Promise<Todo | null> {
    const query = 'SELECT * FROM todos WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id: number, userUuid: string, updateData: UpdateTodoData): Promise<Todo | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updateData.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(updateData.title);
    }
    
    if (updateData.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updateData.description);
    }
    
    if (updateData.completed !== undefined) {
      fields.push(`completed = $${paramCount++}`);
      values.push(updateData.completed);
    }

    if (fields.length === 0) {
      return null;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
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

static async delete(id: number, userUuid: string): Promise<boolean> {
  const query = 'DELETE FROM todos WHERE id = $1 AND user_uuid = $2';
  const result = await pool.query(query, [id, userUuid]);
  return (result.rowCount ?? 0) > 0;
}
}