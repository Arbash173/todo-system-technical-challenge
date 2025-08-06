import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';
import './TodoPage.css';

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { logout, user } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.getTodos();
      setTodos(response.todos);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch todos. Please try again.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) {
      setError('Please enter a todo title');
      return;
    }

    try {
      const todoData: CreateTodoRequest = {
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim() || undefined,
      };

      const response = await api.createTodo(todoData);
      setTodos([...todos, response.todo]);
      setNewTodoTitle('');
      setNewTodoDescription('');
      setShowAddForm(false);
      setSuccess('Todo created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create todo');
    }
  };

  const handleUpdateTodo = async (todo: Todo) => {
    try {
      const updateData: UpdateTodoRequest = {
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      };

      const response = await api.updateTodo(todo.id, updateData);
      setTodos(todos.map(t => t.id === todo.id ? response.todo : t));
      setEditingTodo(null);
      setSuccess('Todo updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await api.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setSuccess('Todo deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete todo');
    }
  };

  const toggleComplete = async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await handleUpdateTodo(updatedTodo);
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="todo-container">
        <div className="loading">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <header className="todo-header">
        <h1>My Todo List</h1>
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="todo-actions">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-todo-btn"
        >
          {showAddForm ? 'Cancel' : 'Add New Todo'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateTodo} className="add-todo-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Enter todo title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              placeholder="Enter todo description (optional)"
              rows={3}
            />
          </div>
          <button type="submit" className="submit-btn">
            Create Todo
          </button>
        </form>
      )}

      <div className="todos-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            <p>No todos yet. Create your first todo!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editingTodo?.id === todo.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editingTodo.title}
                    onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                    className="edit-input"
                  />
                  <textarea
                    value={editingTodo.description}
                    onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                    className="edit-textarea"
                    rows={2}
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => handleUpdateTodo(editingTodo)}
                      className="save-btn"
                    >
                      Save
                    </button>
                    <button onClick={cancelEditing} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="todo-content">
                    <div className="todo-header-row">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo)}
                        className="todo-checkbox"
                      />
                      <h3 className="todo-title">{todo.title}</h3>
                    </div>
                    {todo.description && (
                      <p className="todo-description">{todo.description}</p>
                    )}
                    <div className="todo-meta">
                      <span className="todo-date">
                        Created: {new Date(todo.created_at).toLocaleDateString()}
                      </span>
                      {todo.completed && (
                        <span className="completed-badge">Completed</span>
                      )}
                    </div>
                  </div>
                  <div className="todo-actions">
                    <button
                      onClick={() => startEditing(todo)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoPage; 