import mongoose from 'mongoose';

const photoCommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Le contenu du commentaire est requis'],
    maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
  },
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: [true, 'La photo est requise']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'auteur est requis']
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index
photoCommentSchema.index({ photo: 1, createdAt: -1 });
photoCommentSchema.index({ author: 1 });

const PhotoComment = mongoose.model('PhotoComment', photoCommentSchema);

export default PhotoComment;
