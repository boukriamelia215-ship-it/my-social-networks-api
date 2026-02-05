import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import {
  createAlbum,
  getAlbums,
  getAlbum,
  addPhoto,
  getPhotos,
  addComment,
  getComments,
  deletePhoto
} from '../controllers/photoController.js';

// Routes pour les albums
router.route('/')
  .post(protect, createAlbum)
  .get(protect, getAlbums);

router.route('/:id')
  .get(protect, getAlbum);

router.route('/:id/photos')
  .post(protect, addPhoto)
  .get(protect, getPhotos);

// Routes pour les photos
router.route('/photos/:id')
  .delete(protect, deletePhoto);

router.route('/photos/:id/comments')
  .post(protect, addComment)
  .get(protect, getComments);

export default router;