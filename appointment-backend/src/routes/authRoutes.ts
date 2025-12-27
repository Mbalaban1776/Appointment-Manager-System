import express from 'express';
import { register, login, getMe, registerSchema, loginSchema } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

export default router;

