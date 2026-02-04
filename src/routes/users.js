import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { userIdValidator, updateUserValidator } from '../validators/userValidator.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Obtenir tous les utilisateurs
 * @access  Private
 */
router.get('/', protect, getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Obtenir un utilisateur par ID
 * @access  Private
 */
router.get('/:id', protect, userIdValidator, validate, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Mettre à jour un utilisateur
 * @access  Private
 */
router.put('/:id', protect, userIdValidator, updateUserValidator, validate, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Supprimer (désactiver) un utilisateur
 * @access  Private
 */
router.delete('/:id', protect, userIdValidator, validate, deleteUser);

export default router;
