const Poll = require('../models/Poll');
const PollResponse = require('../models/PollResponse');
const Event = require('../models/Event');

// @desc    Créer un sondage
// @route   POST /api/polls
// @access  Private
exports.createPoll = async (req, res, next) => {
  try {
    const { event, title, questions } = req.body;

    // Vérifier que l'événement existe
    const eventExists = await Event.findById(event);
    if (!eventExists) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier que l'utilisateur est organisateur
    const isOrganizer = eventExists.organizers.some(
      org => org.toString() === req.user._id.toString()
    );

    if (!isOrganizer) {
      return res.status(403).json({
        success: false,
        message: 'Seuls les organisateurs peuvent créer des sondages'
      });
    }

    const poll = await Poll.create({
      event,
      title,
      questions,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Sondage créé avec succès',
      data: poll
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les sondages d'un événement
// @route   GET /api/polls?event=:eventId
// @access  Private
exports.getPolls = async (req, res, next) => {
  try {
    const { event } = req.query;

    const filter = event ? { event } : {};

    const polls = await Poll.find(filter)
      .populate('event', 'name')
      .populate('createdBy', 'firstName lastName')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: polls.length,
      data: polls
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un sondage
// @route   GET /api/polls/:id
// @access  Private
exports.getPoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id)
      .populate('event', 'name')
      .populate('createdBy', 'firstName lastName');

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Sondage non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: poll
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Répondre à un sondage
// @route   POST /api/polls/:id/responses
// @access  Private
exports.respondToPoll = async (req, res, next) => {
  try {
    const { responses } = req.body; // Array de { questionId, selectedOptionId }

    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Sondage non trouvé'
      });
    }

    // Vérifier si l'utilisateur a déjà répondu
    const existingResponse = await PollResponse.findOne({
      poll: req.params.id,
      participant: req.user._id
    });

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà répondu à ce sondage'
      });
    }

    // Créer les réponses
    const pollResponse = await PollResponse.create({
      poll: req.params.id,
      participant: req.user._id,
      responses
    });

    await pollResponse.populate('participant', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Réponse enregistrée avec succès',
      data: pollResponse
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les résultats d'un sondage
// @route   GET /api/polls/:id/results
// @access  Private
exports.getPollResults = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Sondage non trouvé'
      });
    }

    const responses = await PollResponse.find({ poll: req.params.id })
      .populate('participant', 'firstName lastName');

    // Calculer les statistiques
    const results = {
      poll,
      totalResponses: responses.length,
      responses
    };

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un sondage
// @route   DELETE /api/polls/:id
// @access  Private
exports.deletePoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Sondage non trouvé'
      });
    }

    // Vérifier que c'est le créateur
    if (poll.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce sondage'
      });
    }

    await poll.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sondage supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};