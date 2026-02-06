const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre du sondage est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
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
    required: [true, 'L\'organisateur est requis']
  },
  questions: [{
    questionText: {
      type: String,
      required: [true, 'Le texte de la question est requis'],
      maxlength: [500, 'La question ne peut pas dépasser 500 caractères']
    },
    options: [{
      optionText: {
        type: String,
        required: [true, 'Le texte de l\'option est requis'],
        maxlength: [200, 'L\'option ne peut pas dépasser 200 caractères']
      }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  closingDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index
pollSchema.index({ event: 1 });
pollSchema.index({ createdBy: 1 });

// Validation : au moins une question avec au moins deux options
pollSchema.pre('save', function(next) {
  if (this.questions.length === 0) {
    return next(new Error('Un sondage doit avoir au moins une question'));
  }
  
  for (let question of this.questions) {
    if (question.options.length < 2) {
      return next(new Error('Chaque question doit avoir au moins deux options'));
    }
  }
  
  next();
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
