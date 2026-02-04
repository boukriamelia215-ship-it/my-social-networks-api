import express from 'express';
import { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent,
  addParticipant,
  removeParticipant
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';
import { 
  createEventValidator, 
  updateEventValidator, 
  eventIdValidator,
  addParticipantValidator
} from '../validators/eventValidator.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * @route   POST /api/events
 * @desc    Créer un événement
 * @access  Private
 */
router.post('/', protect, createEventValidator, validate, createEvent);

/**
 * @route   GET /api/events
 * @desc    Obtenir tous les événements
 * @access  Private
 */
router.get('/', protect, getAllEvents);

/**
 * @route   GET /api/events/:id
 * @desc    Obtenir un événement par ID
 * @access  Private
 */
router.get('/:id', protect, eventIdValidator, validate, getEventById);

/**
 * @route   PUT /api/events/:id
 * @desc    Mettre à jour un événement
 * @access  Private
 */
router.put('/:id', protect, eventIdValidator, updateEventValidator, validate, updateEvent);

/**
 * @route   DELETE /api/events/:id
 * @desc    Supprimer un événement
 * @access  Private
 */
router.delete('/:id', protect, eventIdValidator, validate, deleteEvent);

/**
 * @route   POST /api/events/:id/participants
 * @desc    Ajouter un participant à un événement
 * @access  Private
 */
router.post('/:id/participants', protect, addParticipantValidator, validate, addParticipant);

/**
 * @route   DELETE /api/events/:id/participants/:userId
 * @desc    Retirer un participant d'un événement
 * @access  Private
 */
router.delete('/:id/participants/:userId', protect, removeParticipant);

export default router;
