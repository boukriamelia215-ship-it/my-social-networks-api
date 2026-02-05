const DiscussionThread = require('../models/DiscussionThread');
const Message = require('../models/Message');
const Event = require('../models/Event');
const Group = require('../models/Group');

// @desc    Créer un fil de discussion
// @route   POST /api/discussions
// @access  Private
exports.createDiscussion = async (req, res, next) => {
  try {
    const { event, group, title } = req.body;

    // Vérifier qu'on a soit event soit group (pas les deux)
    if ((event && group) || (!event && !group)) {
      return res.status(400).json({
        success: false,
        message: 'Un fil de discussion doit être lié soit à un événement soit à un groupe'
      });
    }

    // Vérifier que l'événement ou le groupe existe
    if (event) {
      const eventExists = await Event.findById(event);
      if (!eventExists) {
        return res.status(404).json({
          success: false,
          message: 'Événement non trouvé'
        });
      }
    }

    if (group) {
      const groupExists = await Group.findById(group);
      if (!groupExists) {
        return res.status(404).json({
          success: false,
          message: 'Groupe non trouvé'
        });
      }
    }

    const discussion = await DiscussionThread.create({
      event,
      group,
      title,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Fil de discussion créé avec succès',
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les discussions d'un événement ou groupe
// @route   GET /api/discussions
// @access  Private
exports.getDiscussions = async (req, res, next) => {
  try {
    const { event, group } = req.query;

    let filter = {};
    if (event) filter.event = event;
    if (group) filter.group = group;

    const discussions = await DiscussionThread.find(filter)
      .populate('createdBy', 'firstName lastName profilePicture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: discussions.length,
      data: discussions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un fil de discussion
// @route   GET /api/discussions/:id
// @access  Private
exports.getDiscussion = async (req, res, next) => {
  try {
    const discussion = await DiscussionThread.findById(req.params.id)
      .populate('createdBy', 'firstName lastName profilePicture')
      .populate('event', 'name')
      .populate('group', 'name');

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Fil de discussion non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un message dans un fil
// @route   POST /api/discussions/:id/messages
// @access  Private
exports.createMessage = async (req, res, next) => {
  try {
    const { content, parentMessage } = req.body;

    const discussion = await DiscussionThread.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Fil de discussion non trouvé'
      });
    }

    const message = await Message.create({
      discussionThread: req.params.id,
      author: req.user._id,
      content,
      parentMessage
    });

    await message.populate('author', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Message créé avec succès',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les messages d'un fil
// @route   GET /api/discussions/:id/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ discussionThread: req.params.id })
      .populate('author', 'firstName lastName profilePicture')
      .populate('parentMessage')
      .sort('createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Vérifier que c'est l'auteur
    if (message.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce message'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};