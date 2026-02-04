import mongoose from 'mongoose';

const carpoolSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'L\'événement est requis']
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le conducteur est requis']
  },
  departureLocation: {
    type: String,
    required: [true, 'Le lieu de départ est requis'],
    maxlength: [500, 'Le lieu de départ ne peut pas dépasser 500 caractères']
  },
  departureTime: {
    type: Date,
    required: [true, 'L\'heure de départ est requise']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Le nombre de places est requis'],
    min: [1, 'Il doit y avoir au moins 1 place disponible'],
    max: [8, 'Le nombre de places ne peut pas dépasser 8']
  },
  maxDetourTime: {
    type: Number,
    required: [true, 'Le temps maximum de détour est requis'],
    min: [0, 'Le temps de détour ne peut pas être négatif'],
    comment: 'Temps maximum d\'écart en minutes'
  },
  passengers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['available', 'full', 'cancelled', 'completed'],
    default: 'available'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
    default: ''
  }
}, {
  timestamps: true
});

// Index
carpoolSchema.index({ event: 1, driver: 1 });
carpoolSchema.index({ event: 1, status: 1 });

// Mettre à jour le statut automatiquement
carpoolSchema.pre('save', function(next) {
  if (this.passengers.length >= this.availableSeats) {
    this.status = 'full';
  } else if (this.status === 'full' && this.passengers.length < this.availableSeats) {
    this.status = 'available';
  }
  next();
});

const Carpool = mongoose.model('Carpool', carpoolSchema);

export default Carpool;
