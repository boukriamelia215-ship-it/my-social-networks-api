import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidator, loginValidator } from '../validators/userValidator.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post('/register', registerValidator, validate, register);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post('/login', loginValidator, validate, login);

/**
 * @route   GET /api/auth/me
 * @desc    Obtenir l'utilisateur connecté
 * @access  Private
 */
router.get('/me', protect, getMe);

export default router;
