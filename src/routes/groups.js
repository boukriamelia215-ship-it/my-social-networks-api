import express from 'express';
import { 
  createGroup, 
  getAllGroups, 
  getGroupById, 
  updateGroup, 
  deleteGroup,
  addMember,
  removeMember,
  addAdministrator
} from '../controllers/groupController.js';
import { protect } from '../middleware/auth.js';
import { 
  createGroupValidator, 
  updateGroupValidator, 
  groupIdValidator,
  addMemberValidator
} from '../validators/groupValidator.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * @route   POST /api/groups
 * @desc    Créer un groupe
 * @access  Private
 */
router.post('/', protect, createGroupValidator, validate, createGroup);

/**
 * @route   GET /api/groups
 * @desc    Obtenir tous les groupes
 * @access  Private
 */
router.get('/', protect, getAllGroups);

/**
 * @route   GET /api/groups/:id
 * @desc    Obtenir un groupe par ID
 * @access  Private
 */
router.get('/:id', protect, groupIdValidator, validate, getGroupById);

/**
 * @route   PUT /api/groups/:id
 * @desc    Mettre à jour un groupe
 * @access  Private
 */
router.put('/:id', protect, groupIdValidator, updateGroupValidator, validate, updateGroup);

/**
 * @route   DELETE /api/groups/:id
 * @desc    Supprimer un groupe
 * @access  Private
 */
router.delete('/:id', protect, groupIdValidator, validate, deleteGroup);

/**
 * @route   POST /api/groups/:id/members
 * @desc    Ajouter un membre à un groupe
 * @access  Private
 */
router.post('/:id/members', protect, addMemberValidator, validate, addMember);

/**
 * @route   DELETE /api/groups/:id/members/:userId
 * @desc    Retirer un membre d'un groupe
 * @access  Private
 */
router.delete('/:id/members/:userId', protect, removeMember);

/**
 * @route   POST /api/groups/:id/administrators
 * @desc    Ajouter un administrateur à un groupe
 * @access  Private
 */
router.post('/:id/administrators', protect, addMemberValidator, validate, addAdministrator);

export default router;
