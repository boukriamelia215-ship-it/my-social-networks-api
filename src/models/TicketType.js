import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du type de billet est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  quantity: {
    type: Number,
    required: [true, 'La quantité est requise'],
    min: [1, 'La quantité doit être au moins 1']
  },
  availableQuantity: {
    type: Number,
    required: true
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index
ticketTypeSchema.index({ event: 1 });

// Initialiser availableQuantity avec quantity lors de la création
ticketTypeSchema.pre('save', function(next) {
  if (this.isNew) {
    this.availableQuantity = this.quantity;
  }
  next();
});

const TicketType = mongoose.model('TicketType', ticketTypeSchema);

export default TicketType;
