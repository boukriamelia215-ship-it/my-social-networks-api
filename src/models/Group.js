import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du groupe est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  icon: {
    type: String,
    default: null
  },
  coverPhoto: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: {
      values: ['public', 'private', 'secret'],
      message: 'Le type doit être public, private ou secret'
    },
    required: [true, 'Le type de groupe est requis']
  },
  allowMembersToPost: {
    type: Boolean,
    default: true
  },
  allowMembersToCreateEvents: {
    type: Boolean,
    default: false
  },
  administrators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
groupSchema.index({ name: 'text', description: 'text' });
groupSchema.index({ type: 1 });
groupSchema.index({ administrators: 1 });
groupSchema.index({ members: 1 });

// Validation : au moins un administrateur
groupSchema.pre('save', function(next) {
  if (this.administrators.length === 0) {
    next(new Error('Un groupe doit avoir au moins un administrateur'));
  }
  next();
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
