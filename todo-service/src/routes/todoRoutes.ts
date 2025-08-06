import express from 'express';
import { createTodo, getTodos, updateTodo, deleteTodo } from '../controllers/todoController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', createTodo);
router.get('/', getTodos);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;