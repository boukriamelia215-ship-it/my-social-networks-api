import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import {
  createDiscussion,
  getDiscussions,
  getDiscussion,
  createMessage,
  getMessages,
  deleteMessage
} from '../controllers/discussionController.js';

// Routes pour les discussions
router.route('/')
  .post(protect, createDiscussion)
  .get(protect, getDiscussions);

router.route('/:id')
  .get(protect, getDiscussion);

router.route('/:id/messages')
  .post(protect, createMessage)
  .get(protect, getMessages);

// Route pour supprimer un message
router.route('/messages/:id')
  .delete(protect, deleteMessage);

export default router;