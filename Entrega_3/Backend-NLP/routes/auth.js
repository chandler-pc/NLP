import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { register, login, getProfile } from '../controllers/authController.js';
import { loginLimiter } from '../middleware/loginMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/profile', authMiddleware, getProfile);

export default router;
