import Event from '../models/Event.js';
import Group from '../models/Group.js';

// @desc    Créer un événement
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, location, coverPhoto, isPrivate, organizers, group, hasTicketing, hasShoppingList, hasCarpooling } = req.body;

    // Si lié à un groupe, vérifier l'autorisation
    if (group) {
      const groupDoc = await Group.findById(group);
      
      if (!groupDoc) {
        return res.status(404).json({
          success: false,
          message: 'Groupe non trouvé'
        });
      }

      // Vérifier si l'utilisateur est admin ou si les membres peuvent créer des événements
      const isAdmin = groupDoc.administrators.some(admin => admin.toString() === req.user._id.toString());
      const isMember = groupDoc.members.some(member => member.toString() === req.user._id.toString());

      if (!isAdmin && (!isMember || !groupDoc.allowMembersToCreateEvents)) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas autorisé à créer un événement dans ce groupe'
        });
      }
    }

    // Créer l'événement
    const organizersList = organizers && organizers.length > 0 ? organizers : [req.user._id];

    const event = await Event.create({
      name,
      description,
      startDate,
      endDate,
      location,
      coverPhoto,
      isPrivate: isPrivate || false,
      organizers: organizersList,
      group,
      createdBy: req.user._id,
      hasTicketing: hasTicketing || false,
      hasShoppingList: hasShoppingList || false,
      hasCarpooling: hasCarpooling || false
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('organizers', 'firstName lastName email profilePicture')
      .populate('createdBy', 'firstName lastName email profilePicture')
      .populate('group', 'name type');

    // Si l'événement est lié à un groupe, inviter automatiquement tous les membres
    if (group) {
      const groupDoc = await Group.findById(group);
      event.participants = groupDoc.members;
      await event.save();
    }

    res.status(201).json({
      success: true,
      message: 'Événement créé avec succès',
      data: populatedEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir tous les événements
// @route   GET /api/events
// @access  Private
export const getAllEvents = async (req, res, next) => {
  try {
    const { search, isPrivate, group, startDate, endDate, limit = 20, page = 1 } = req.query;
    
    let query = {};

    // Recherche par nom ou description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtrer par type (privé/public)
    if (isPrivate !== undefined) {
      query.isPrivate = isPrivate === 'true';
    } else {
      // Par défaut, montrer seulement les événements publics ou ceux où l'utilisateur participe
      query.$or = [
        { isPrivate: false },
        { participants: req.user._id },
        { organizers: req.user._id }
      ];
    }

    // Filtrer par groupe
    if (group) {
      query.group = group;
    }

    // Filtrer par date
    if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query.endDate = { $lte: new Date(endDate) };
    }

    const events = await Event.find(query)
      .populate('organizers', 'firstName lastName email profilePicture')
      .populate('createdBy', 'firstName lastName email profilePicture')
      .populate('group', 'name type')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ startDate: 1 });

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        events,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un événement par ID
// @route   GET /api/events/:id
// @access  Private
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizers', 'firstName lastName email profilePicture')
      .populate('participants', 'firstName lastName email profilePicture')
      .populate('createdBy', 'firstName lastName email profilePicture')
      .populate('group', 'name type');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier l'accès aux événements privés
    if (event.isPrivate) {
      const isOrganizer = event.organizers.some(org => org._id.toString() === req.user._id.toString());
      const isParticipant = event.participants.some(part => part._id.toString() === req.user._id.toString());

      if (!isOrganizer && !isParticipant) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé à cet événement privé'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un événement
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier si l'utilisateur est organisateur
    const isOrganizer = event.organizers.some(org => org.toString() === req.user._id.toString());

    if (!isOrganizer) {
      return res.status(403).json({
        success: false,
        message: 'Seuls les organisateurs peuvent modifier cet événement'
      });
    }

    const { name, description, startDate, endDate, location, coverPhoto, isPrivate } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { name, description, startDate, endDate, location, coverPhoto, isPrivate },
      { new: true, runValidators: true }
    ).populate('organizers', 'firstName lastName email profilePicture')
     .populate('participants', 'firstName lastName email profilePicture')
     .populate('group', 'name type');

    res.status(200).json({
      success: true,
      message: 'Événement mis à jour avec succès',
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un événement
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier si l'utilisateur est le créateur ou un organisateur
    const isCreator = event.createdBy.toString() === req.user._id.toString();
    const isOrganizer = event.organizers.some(org => org.toString() === req.user._id.toString());

    if (!isCreator && !isOrganizer) {
      return res.status(403).json({
        success: false,
        message: 'Seuls le créateur ou les organisateurs peuvent supprimer cet événement'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Événement supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter un participant à un événement
// @route   POST /api/events/:id/participants
// @access  Private
export const addParticipant = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier si l'événement est privé
    if (event.isPrivate) {
      const isOrganizer = event.organizers.some(org => org.toString() === req.user._id.toString());
      
      if (!isOrganizer) {
        return res.status(403).json({
          success: false,
          message: 'Seuls les organisateurs peuvent ajouter des participants à un événement privé'
        });
      }
    }

    // Vérifier si l'utilisateur est déjà participant
    if (event.participants.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Cet utilisateur est déjà participant'
      });
    }

    event.participants.push(userId);
    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('participants', 'firstName lastName email profilePicture');

    res.status(200).json({
      success: true,
      message: 'Participant ajouté avec succès',
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retirer un participant d'un événement
// @route   DELETE /api/events/:id/participants/:userId
// @access  Private
export const removeParticipant = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Un utilisateur peut se retirer lui-même ou un organisateur peut retirer quelqu'un
    const isOrganizer = event.organizers.some(org => org.toString() === req.user._id.toString());
    const isSelf = userId === req.user._id.toString();

    if (!isOrganizer && !isSelf) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    event.participants = event.participants.filter(p => p.toString() !== userId);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Participant retiré avec succès'
    });
  } catch (error) {
    next(error);
  }
};
