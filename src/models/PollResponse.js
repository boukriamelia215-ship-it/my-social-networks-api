const mongoose = require('mongoose');

const pollResponseSchema = new mongoose.Schema({
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: [true, 'Le sondage est requis']
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le participant est requis']
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'L\'ID de la question est requis']
    },
    selectedOptionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'L\'option sélectionnée est requise']
    }
  }]
}, {
  timestamps: true
});

// Index pour éviter les réponses multiples au même sondage
pollResponseSchema.index({ poll: 1, participant: 1 }, { unique: true });

const PollResponse = mongoose.model('PollResponse', pollResponseSchema);

module.exports = PollResponse;
