import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import {
  createCarpool,
  getCarpools,
  getCarpool,
  joinCarpool,
  leaveCarpool,
  updateCarpool,
  deleteCarpool
} from '../controllers/carpoolController.js';

router.route('/')
  .post(protect, createCarpool)
  .get(protect, getCarpools);

router.route('/:id')
  .get(protect, getCarpool)
  .put(protect, updateCarpool)
  .delete(protect, deleteCarpool);

router.route('/:id/join')
  .post(protect, joinCarpool);

router.route('/:id/leave')
  .delete(protect, leaveCarpool);

export default router;