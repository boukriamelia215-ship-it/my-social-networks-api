const mongoose = require('mongoose');

const photoAlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'album est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    default: ''
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'L\'événement est requis']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverPhoto: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index
photoAlbumSchema.index({ event: 1 });
photoAlbumSchema.index({ createdBy: 1 });

const PhotoAlbum = mongoose.model('PhotoAlbum', photoAlbumSchema);

module.exports = PhotoAlbum;
