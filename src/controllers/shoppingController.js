const ShoppingListItem = require('../models/ShoppingListItem');
const Event = require('../models/Event');

// @desc    Ajouter un item à la shopping list
// @route   POST /api/shopping-list
// @access  Private
exports.addItem = async (req, res, next) => {
  try {
    const { event, name, quantity, arrivalTime } = req.body;

    // Vérifier que l'événement existe
    const eventExists = await Event.findById(event);
    if (!eventExists) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Vérifier que la shopping list est activée
    if (!eventExists.hasShoppingList) {
      return res.status(400).json({
        success: false,
        message: 'La shopping list n\'est pas activée pour cet événement'
      });
    }

    const item = await ShoppingListItem.create({
      event,
      broughtBy: req.user._id,
      name,
      quantity,
      arrivalTime
    });

    await item.populate('broughtBy', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Item ajouté à la shopping list',
      data: item
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Cet item est déjà dans la liste pour cet événement'
      });
    }
    next(error);
  }
};

// @desc    Obtenir la shopping list d'un événement
// @route   GET /api/shopping-list?event=:eventId
// @access  Private
exports.getShoppingList = async (req, res, next) => {
  try {
    const { event } = req.query;

    if (!event) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID de l\'événement est requis'
      });
    }

    const items = await ShoppingListItem.find({ event })
      .populate('broughtBy', 'firstName lastName profilePicture')
      .sort('arrivalTime');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Modifier un item
// @route   PUT /api/shopping-list/:id
// @access  Private
exports.updateItem = async (req, res, next) => {
  try {
    let item = await ShoppingListItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item non trouvé'
      });
    }

    // Vérifier que c'est le créateur
    if (item.broughtBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cet item'
      });
    }

    item = await ShoppingListItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('broughtBy', 'firstName lastName profilePicture');

    res.status(200).json({
      success: true,
      message: 'Item modifié avec succès',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un item
// @route   DELETE /api/shopping-list/:id
// @access  Private
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await ShoppingListItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item non trouvé'
      });
    }

    // Vérifier que c'est le créateur
    if (item.broughtBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cet item'
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};