import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import {
  addItem,
  getShoppingList,
  updateItem,
  deleteItem
} from '../controllers/shoppingController.js';

router.route('/')
  .post(protect, addItem)
  .get(protect, getShoppingList);

router.route('/:id')
  .put(protect, updateItem)
  .delete(protect, deleteItem);

export default router;