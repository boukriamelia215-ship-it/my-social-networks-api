const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TicketType',
    required: [true, 'Le type de billet est requis']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'L\'événement est requis']
  },
  // Données de la personne qui a acheté le billet
  buyer: {
    firstName: {
      type: String,
      required: [true, 'Le prénom est requis'],
      trim: true,
      maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
    },
    lastName: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    address: {
      street: {
        type: String,
        required: [true, 'La rue est requise']
      },
      city: {
        type: String,
        required: [true, 'La ville est requise']
      },
      postalCode: {
        type: String,
        required: [true, 'Le code postal est requis']
      },
      country: {
        type: String,
        required: [true, 'Le pays est requis']
      }
    }
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['valid', 'used', 'cancelled', 'refunded'],
    default: 'valid'
  }
}, {
  timestamps: true
});

// Index
ticketSchema.index({ ticketType: 1 });
ticketSchema.index({ event: 1 });
ticketSchema.index({ 'buyer.email': 1 });
ticketSchema.index({ ticketNumber: 1 }, { unique: true });

// Générer un numéro de billet unique avant la sauvegarde
ticketSchema.pre('save', function(next) {
  if (this.isNew) {
    this.ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
