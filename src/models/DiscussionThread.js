const mongoose = require('mongoose');

const discussionThreadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre du fil de discussion est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  // Lié soit à un groupe, soit à un événement (mais pas les deux)
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index
discussionThreadSchema.index({ group: 1 });
discussionThreadSchema.index({ event: 1 });
discussionThreadSchema.index({ createdBy: 1 });

// Validation : doit être lié soit à un groupe, soit à un événement, mais pas les deux
discussionThreadSchema.pre('save', function(next) {
  if ((this.group && this.event) || (!this.group && !this.event)) {
    next(new Error('Un fil de discussion doit être lié soit à un groupe, soit à un événement, mais pas les deux'));
  }
  next();
});

const DiscussionThread = mongoose.model('DiscussionThread', discussionThreadSchema);

module.exports = DiscussionThread;
