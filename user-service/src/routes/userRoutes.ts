import express from 'express';
import { register, login } from '../controllers/userController';
import { validateRegister, validateLogin } from '../middleware/validation';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;