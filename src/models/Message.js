const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Le contenu du message est requis'],
    maxlength: [10000, 'Le message ne peut pas dépasser 10000 caractères']
  },
  discussionThread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscussionThread',
    required: [true, 'Le fil de discussion est requis']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'auteur est requis']
  },
  // Pour les réponses à un message
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  attachments: [{
    type: String
  }],
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
messageSchema.index({ discussionThread: 1, createdAt: -1 });
messageSchema.index({ author: 1 });
messageSchema.index({ parentMessage: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
