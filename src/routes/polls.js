import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import {
  createPoll,
  getPolls,
  getPoll,
  respondToPoll,
  getPollResults,
  deletePoll
} from '../controllers/pollController.js';

// Routes pour les sondages
router.route('/')
  .post(protect, createPoll)
  .get(protect, getPolls);

router.route('/:id')
  .get(protect, getPoll)
  .delete(protect, deletePoll);

router.route('/:id/responses')
  .post(protect, respondToPoll);

router.route('/:id/results')
  .get(protect, getPollResults);

export default router;