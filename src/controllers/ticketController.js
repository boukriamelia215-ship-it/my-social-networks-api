const TicketType = require('../models/TicketType');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

// @desc    Créer un type de billet
// @route   POST /api/ticket-types
// @access  Private
exports.createTicketType = async (req, res, next) => {
  try {
    const { event, name, description, price, quantity } = req.body;

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
        message: 'Seuls les organisateurs peuvent créer des types de billets'
      });
    }

    const ticketType = await TicketType.create({
      event,
      name,
      description,
      price,
      quantity,
      availableQuantity: quantity
    });

    res.status(201).json({
      success: true,
      message: 'Type de billet créé avec succès',
      data: ticketType
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les types de billets d'un événement
// @route   GET /api/ticket-types?event=:eventId
// @access  Public
exports.getTicketTypes = async (req, res, next) => {
  try {
    const { event } = req.query;

    const filter = event ? { event } : {};

    const ticketTypes = await TicketType.find(filter)
      .populate('event', 'name startDate endDate location')
      .sort('price');

    res.status(200).json({
      success: true,
      count: ticketTypes.length,
      data: ticketTypes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un type de billet
// @route   GET /api/ticket-types/:id
// @access  Public
exports.getTicketType = async (req, res, next) => {
  try {
    const ticketType = await TicketType.findById(req.params.id)
      .populate('event', 'name startDate endDate location');

    if (!ticketType) {
      return res.status(404).json({
        success: false,
        message: 'Type de billet non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: ticketType
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Acheter un billet
// @route   POST /api/tickets
// @access  Public (pas besoin d'être connecté)
exports.purchaseTicket = async (req, res, next) => {
  try {
    const { ticketType, buyer } = req.body;

    // Vérifier que le type de billet existe
    const ticketTypeDoc = await TicketType.findById(ticketType);
    if (!ticketTypeDoc) {
      return res.status(404).json({
        success: false,
        message: 'Type de billet non trouvé'
      });
    }

    // Vérifier la disponibilité
    if (ticketTypeDoc.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Ce type de billet n\'est plus disponible'
      });
    }

    // Vérifier si la personne a déjà acheté un billet (1 par personne)
    const existingTicket = await Ticket.findOne({
      ticketType,
      'buyer.email': buyer.email
    });

    if (existingTicket) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà acheté un billet pour cet événement'
      });
    }

    // Créer le billet
    const ticket = await Ticket.create({
      ticketType,
      event: ticketTypeDoc.event,
      buyer,
      purchaseDate: new Date()
    });

    // Décrémenter la quantité disponible
    ticketTypeDoc.availableQuantity -= 1;
    await ticketTypeDoc.save();

    await ticket.populate('ticketType');
    await ticket.populate('event', 'name startDate location');

    res.status(201).json({
      success: true,
      message: 'Billet acheté avec succès',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les billets d'un événement
// @route   GET /api/tickets?event=:eventId
// @access  Private
exports.getTickets = async (req, res, next) => {
  try {
    const { event } = req.query;

    // Vérifier que l'utilisateur est organisateur
    const eventDoc = await Event.findById(event);
    if (!eventDoc) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    const isOrganizer = eventDoc.organizers.some(
      org => org.toString() === req.user._id.toString()
    );

    if (!isOrganizer) {
      return res.status(403).json({
        success: false,
        message: 'Seuls les organisateurs peuvent voir les billets vendus'
      });
    }

    const tickets = await Ticket.find({ event })
      .populate('ticketType')
      .sort('-purchaseDate');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un billet
// @route   GET /api/tickets/:id
// @access  Public
exports.getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('ticketType')
      .populate('event', 'name startDate endDate location');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Billet non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un type de billet
// @route   DELETE /api/ticket-types/:id
// @access  Private
exports.deleteTicketType = async (req, res, next) => {
  try {
    const ticketType = await TicketType.findById(req.params.id).populate('event');

    if (!ticketType) {
      return res.status(404).json({
        success: false,
        message: 'Type de billet non trouvé'
      });
    }

    // Vérifier que l'utilisateur est organisateur
    const isOrganizer = ticketType.event.organizers.some(
      org => org.toString() === req.user._id.toString()
    );

    if (!isOrganizer) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    await ticketType.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Type de billet supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};