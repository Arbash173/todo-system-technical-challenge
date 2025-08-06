export interface User {
  uuid: string;
  email: string;
  created_at?: string;
}

export interface Todo {
  id: number;
  user_uuid: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface TodosResponse {
  todos: Todo[];
}

export interface TodoResponse {
  message: string;
  todo: Todo;
}

export interface ApiError {
  message: string;
  status?: number;
} 