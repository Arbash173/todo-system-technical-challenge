import { Response } from 'express';
import { TodoModel } from '../models/Todo';
import { AuthenticatedRequest } from '../middleware/auth';
import Joi from 'joi';

const createTodoSchema = Joi.object({
  title: Joi.string().required().max(255),
  description: Joi.string().optional().max(1000)
});

const updateTodoSchema = Joi.object({
  title: Joi.string().optional().max(255),
  description: Joi.string().optional().max(1000),
  completed: Joi.boolean().optional()
});

export const createTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error } = createTodoSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { title, description } = req.body;
    const userUuid = req.user!.userUuid;

    const todo = await TodoModel.create({
      user_uuid: userUuid,
      title,
      description
    });

    res.status(201).json({
      message: 'Todo created successfully',
      todo
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTodos = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userUuid = req.user!.userUuid;
    const todos = await TodoModel.findByUserUuid(userUuid);

    res.status(200).json({
      todos
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error } = updateTodoSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const todoId = parseInt(req.params.id);
    const userUuid = req.user!.userUuid;

    if (isNaN(todoId)) {
      res.status(400).json({ error: 'Invalid todo ID' });
      return;
    }

    // Check if todo exists and belongs to user
    const existingTodo = await TodoModel.findById(todoId);
    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    if (existingTodo.user_uuid !== userUuid) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updatedTodo = await TodoModel.update(todoId, userUuid, req.body);
    
    if (!updatedTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(200).json({
      message: 'Todo updated successfully',
      todo: updatedTodo
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const todoId = parseInt(req.params.id);
    const userUuid = req.user!.userUuid;

    if (isNaN(todoId)) {
      res.status(400).json({ error: 'Invalid todo ID' });
      return;
    }

    // Check if todo exists and belongs to user
    const existingTodo = await TodoModel.findById(todoId);
    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    if (existingTodo.user_uuid !== userUuid) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const deleted = await TodoModel.delete(todoId, userUuid);
    
    if (!deleted) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};