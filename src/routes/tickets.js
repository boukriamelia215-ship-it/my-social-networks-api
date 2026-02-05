import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import {
  createTicketType,
  getTicketTypes,
  getTicketType,
  purchaseTicket,
  getTickets,
  getTicket,
  deleteTicketType
} from '../controllers/ticketController.js';

// Routes pour les types de billets
router.route('/ticket-types')
  .post(protect, createTicketType)
  .get(getTicketTypes);

router.route('/ticket-types/:id')
  .get(getTicketType)
  .delete(protect, deleteTicketType);

// Routes pour les billets
router.route('/')
  .post(purchaseTicket)
  .get(protect, getTickets);

router.route('/:id')
  .get(getTicket);

export default router;