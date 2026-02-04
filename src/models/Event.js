import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'événement est requis'],
    trim: true,
    maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [5000, 'La description ne peut pas dépasser 5000 caractères']
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  endDate: {
    type: Date,
    required: [true, 'La date de fin est requise']
  },
  location: {
    type: String,
    required: [true, 'Le lieu est requis'],
    maxlength: [500, 'Le lieu ne peut pas dépasser 500 caractères']
  },
  coverPhoto: {
    type: String,
    default: null
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  organizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Options bonus
  hasTicketing: {
    type: Boolean,
    default: false
  },
  hasShoppingList: {
    type: Boolean,
    default: false
  },
  hasCarpooling: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
eventSchema.index({ name: 'text', description: 'text' });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ isPrivate: 1 });
eventSchema.index({ organizers: 1 });
eventSchema.index({ participants: 1 });
eventSchema.index({ group: 1 });

// Validation : la date de fin doit être après la date de début
eventSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('La date de fin doit être postérieure à la date de début'));
  }
  
  if (this.organizers.length === 0) {
    next(new Error('Un événement doit avoir au moins un organisateur'));
  }
  
  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
