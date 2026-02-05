const Carpool = require('../models/Carpool');
const Event = require('../models/Event');

// @desc    Créer un covoiturage
// @route   POST /api/carpools
// @access  Private
exports.createCarpool = async (req, res, next) => {
  try {
    const { event, departureLocation, departureTime, price, availableSeats, maxDetourTime } = req.body;

    // Vérifier que l'événement existe
    const eventExists = await Event.findById(event);
    if (!eventExists) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier que le covoiturage est activé
    if (!eventExists.hasCarpooling) {
      return res.status(400).json({
        success: false,
        message: 'Le covoiturage n\'est pas activé pour cet événement'
      });
    }

    const carpool = await Carpool.create({
      event,
      driver: req.user._id,
      departureLocation,
      departureTime,
      price,
      availableSeats,
      maxDetourTime
    });

    await carpool.populate('driver', 'firstName lastName profilePicture phone');

    res.status(201).json({
      success: true,
      message: 'Covoiturage créé avec succès',
      data: carpool
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les covoiturages d'un événement
// @route   GET /api/carpools?event=:eventId
// @access  Private
exports.getCarpools = async (req, res, next) => {
  try {
    const { event } = req.query;

    if (!event) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID de l\'événement est requis'
      });
    }

    const carpools = await Carpool.find({ event })
      .populate('driver', 'firstName lastName profilePicture phone')
      .populate('passengers', 'firstName lastName profilePicture')
      .sort('departureTime');

    res.status(200).json({
      success: true,
      count: carpools.length,
      data: carpools
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un covoiturage
// @route   GET /api/carpools/:id
// @access  Private
exports.getCarpool = async (req, res, next) => {
  try {
    const carpool = await Carpool.findById(req.params.id)
      .populate('driver', 'firstName lastName profilePicture phone')
      .populate('passengers', 'firstName lastName profilePicture phone')
      .populate('event', 'name startDate location');

    if (!carpool) {
      return res.status(404).json({
        success: false,
        message: 'Covoiturage non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: carpool
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rejoindre un covoiturage
// @route   POST /api/carpools/:id/join
// @access  Private
exports.joinCarpool = async (req, res, next) => {
  try {
    const carpool = await Carpool.findById(req.params.id);

    if (!carpool) {
      return res.status(404).json({
        success: false,
        message: 'Covoiturage non trouvé'
      });
    }

    // Vérifier qu'il reste des places
    if (carpool.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Plus de places disponibles'
      });
    }

    // Vérifier que l'utilisateur n'est pas déjà passager
    if (carpool.passengers.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà passager de ce covoiturage'
      });
    }

    // Vérifier que l'utilisateur n'est pas le conducteur
    if (carpool.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes le conducteur de ce covoiturage'
      });
    }

    carpool.passengers.push(req.user._id);
    carpool.availableSeats -= 1;
    await carpool.save();

    await carpool.populate('driver', 'firstName lastName profilePicture phone');
    await carpool.populate('passengers', 'firstName lastName profilePicture');

    res.status(200).json({
      success: true,
      message: 'Vous avez rejoint le covoiturage',
      data: carpool
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quitter un covoiturage
// @route   DELETE /api/carpools/:id/leave
// @access  Private
exports.leaveCarpool = async (req, res, next) => {
  try {
    const carpool = await Carpool.findById(req.params.id);

    if (!carpool) {
      return res.status(404).json({
        success: false,
        message: 'Covoiturage non trouvé'
      });
    }

    // Vérifier que l'utilisateur est passager
    if (!carpool.passengers.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Vous n\'êtes pas passager de ce covoiturage'
      });
    }

    carpool.passengers = carpool.passengers.filter(
      p => p.toString() !== req.user._id.toString()
    );
    carpool.availableSeats += 1;
    await carpool.save();

    res.status(200).json({
      success: true,
      message: 'Vous avez quitté le covoiturage'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Modifier un covoiturage
// @route   PUT /api/carpools/:id
// @access  Private
exports.updateCarpool = async (req, res, next) => {
  try {
    let carpool = await Carpool.findById(req.params.id);

    if (!carpool) {
      return res.status(404).json({
        success: false,
        message: 'Covoiturage non trouvé'
      });
    }

    // Vérifier que c'est le conducteur
    if (carpool.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Seul le conducteur peut modifier le covoiturage'
      });
    }

    carpool = await Carpool.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('driver', 'firstName lastName profilePicture phone')
      .populate('passengers', 'firstName lastName profilePicture');

    res.status(200).json({
      success: true,
      message: 'Covoiturage modifié avec succès',
      data: carpool
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un covoiturage
// @route   DELETE /api/carpools/:id
// @access  Private
exports.deleteCarpool = async (req, res, next) => {
  try {
    const carpool = await Carpool.findById(req.params.id);

    if (!carpool) {
      return res.status(404).json({
        success: false,
        message: 'Covoiturage non trouvé'
      });
    }

    // Vérifier que c'est le conducteur
    if (carpool.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Seul le conducteur peut supprimer le covoiturage'
      });
    }

    await carpool.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Covoiturage supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};