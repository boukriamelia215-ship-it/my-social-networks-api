const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'L\'URL de la photo est requise']
  },
  caption: {
    type: String,
    maxlength: [500, 'La légende ne peut pas dépasser 500 caractères'],
    default: ''
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhotoAlbum',
    required: [true, 'L\'album est requis']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'auteur est requis']
  },
  // Metadata de l'image
  size: {
    type: Number,
    default: 0
  },
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index
photoSchema.index({ album: 1, createdAt: -1 });
photoSchema.index({ uploadedBy: 1 });

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
