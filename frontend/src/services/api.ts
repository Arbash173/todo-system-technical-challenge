import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
  TodosResponse,
  TodoResponse,
  CreateTodoRequest,
  UpdateTodoRequest
} from '../types';

const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:3001';
const TODO_SERVICE_URL = process.env.REACT_APP_TODO_SERVICE_URL || 'http://localhost:3002';

// Create axios instances for each service
const userApi: AxiosInstance = axios.create({
  baseURL: USER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const todoApi: AxiosInstance = axios.create({
  baseURL: TODO_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to todo requests
todoApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
todoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // User authentication
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response: AxiosResponse<RegisterResponse> = await userApi.post('/api/users/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await userApi.post('/api/users/login', data);
    return response.data;
  },

  // Todo operations
  getTodos: async (): Promise<TodosResponse> => {
    const response: AxiosResponse<TodosResponse> = await todoApi.get('/api/todos');
    return response.data;
  },

  createTodo: async (data: CreateTodoRequest): Promise<TodoResponse> => {
    const response: AxiosResponse<TodoResponse> = await todoApi.post('/api/todos', data);
    return response.data;
  },

  updateTodo: async (id: number, data: UpdateTodoRequest): Promise<TodoResponse> => {
    const response: AxiosResponse<TodoResponse> = await todoApi.put(`/api/todos/${id}`, data);
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await todoApi.delete(`/api/todos/${id}`);
  },
};

export default api; 