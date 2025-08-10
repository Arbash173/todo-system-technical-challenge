import { Response } from 'express';
import { TodoModel } from '../models/Todo';
import { AuthenticatedRequest } from '../middleware/auth';
import Joi from 'joi';

/**
 * Joi validation schema for creating a new todo
 * - title: Required string with max length of 255 characters
 * - description: Optional string with max length of 1000 characters
 */
const createTodoSchema = Joi.object({
  title: Joi.string().required().max(255),
  description: Joi.string().optional().max(1000)
});

/**
 * Joi validation schema for updating an existing todo
 * - title: Optional string with max length of 255 characters
 * - description: Optional string with max length of 1000 characters
 * - completed: Optional boolean to mark todo as complete/incomplete
 */
const updateTodoSchema = Joi.object({
  title: Joi.string().optional().max(255),
  description: Joi.string().optional().max(1000),
  completed: Joi.boolean().optional()
});

/**
 * Creates a new todo item for the authenticated user
 * 
 * @param req - Express request object with authenticated user information
 * @param res - Express response object
 * @returns Promise<void> - Sends JSON response with created todo or error
 * 
 * Flow:
 * 1. Validates request body against createTodoSchema
 * 2. Extracts title and description from request body
 * 3. Gets user UUID from authenticated request
 * 4. Creates todo in database
 * 5. Returns success response with created todo
 */
export const createTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Validate request body against the schema
    const { error } = createTodoSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    // Extract todo data from request body
    const { title, description } = req.body;
    // Get authenticated user's UUID from middleware
    const userUuid = req.user!.userUuid;

    // Create todo in database
    const todo = await TodoModel.create({
      user_uuid: userUuid,
      title,
      description
    });

    // Return success response with created todo
    res.status(201).json({
      message: 'Todo created successfully',
      todo
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Retrieves all todo items for the authenticated user
 * 
 * @param req - Express request object with authenticated user information
 * @param res - Express response object
 * @returns Promise<void> - Sends JSON response with todos array or error
 * 
 * Flow:
 * 1. Gets user UUID from authenticated request
 * 2. Fetches all todos belonging to the user
 * 3. Returns todos array in response
 */
export const getTodos = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get authenticated user's UUID from middleware
    const userUuid = req.user!.userUuid;
    
    // Fetch all todos for the authenticated user
    const todos = await TodoModel.findByUserUuid(userUuid);

    // Return todos array
    res.status(200).json({
      todos
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Updates an existing todo item for the authenticated user
 * 
 * @param req - Express request object with authenticated user information and todo ID in params
 * @param res - Express response object
 * @returns Promise<void> - Sends JSON response with updated todo or error
 * 
 * Flow:
 * 1. Validates request body against updateTodoSchema
 * 2. Parses and validates todo ID from URL parameters
 * 3. Gets user UUID from authenticated request
 * 4. Verifies todo exists and belongs to the user
 * 5. Updates todo in database
 * 6. Returns success response with updated todo
 */
export const updateTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Validate request body against the schema
    const { error } = updateTodoSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    // Parse todo ID from URL parameters and validate it's a number
    const todoId = parseInt(req.params.id);
    // Get authenticated user's UUID from middleware
    const userUuid = req.user!.userUuid;

    // Ensure todo ID is a valid number
    if (isNaN(todoId)) {
      res.status(400).json({ error: 'Invalid todo ID' });
      return;
    }

    // Check if todo exists and belongs to the authenticated user
    const existingTodo = await TodoModel.findById(todoId);
    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    // Ensure user can only update their own todos
    if (existingTodo.user_uuid !== userUuid) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Update todo in database
    const updatedTodo = await TodoModel.update(todoId, userUuid, req.body);
    
    // Handle case where update operation fails
    if (!updatedTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    // Return success response with updated todo
    res.status(200).json({
      message: 'Todo updated successfully',
      todo: updatedTodo
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Deletes a todo item for the authenticated user
 * 
 * @param req - Express request object with authenticated user information and todo ID in params
 * @param res - Express response object
 * @returns Promise<void> - Sends success response (204) or error
 * 
 * Flow:
 * 1. Parses and validates todo ID from URL parameters
 * 2. Gets user UUID from authenticated request
 * 3. Verifies todo exists and belongs to the user
 * 4. Deletes todo from database
 * 5. Returns success response (204 No Content)
 */
export const deleteTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Parse todo ID from URL parameters and validate it's a number
    const todoId = parseInt(req.params.id);
    // Get authenticated user's UUID from middleware
    const userUuid = req.user!.userUuid;

    // Ensure todo ID is a valid number
    if (isNaN(todoId)) {
      res.status(400).json({ error: 'Invalid todo ID' });
      return;
    }

    // Check if todo exists and belongs to the authenticated user
    const existingTodo = await TodoModel.findById(todoId);
    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    // Ensure user can only delete their own todos
    if (existingTodo.user_uuid !== userUuid) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Delete todo from database
    const deleted = await TodoModel.delete(todoId, userUuid);
    
    // Handle case where delete operation fails
    if (!deleted) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    // Return success response (204 No Content)
    res.status(204).send();
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};