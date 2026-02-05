const PhotoAlbum = require('../models/PhotoAlbum');
const Photo = require('../models/Photo');
const PhotoComment = require('../models/PhotoComment');
const Event = require('../models/Event');

// @desc    Créer un album photo
// @route   POST /api/albums
// @access  Private
exports.createAlbum = async (req, res, next) => {
  try {
    const { event, name, description } = req.body;

    // Vérifier que l'événement existe
    const eventExists = await Event.findById(event);
    if (!eventExists) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    const album = await PhotoAlbum.create({
      event,
      name,
      description,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Album créé avec succès',
      data: album
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les albums d'un événement
// @route   GET /api/albums?event=:eventId
// @access  Private
exports.getAlbums = async (req, res, next) => {
  try {
    const { event } = req.query;

    const filter = event ? { event } : {};

    const albums = await PhotoAlbum.find(filter)
      .populate('event', 'name')
      .populate('createdBy', 'firstName lastName profilePicture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: albums.length,
      data: albums
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un album
// @route   GET /api/albums/:id
// @access  Private
exports.getAlbum = async (req, res, next) => {
  try {
    const album = await PhotoAlbum.findById(req.params.id)
      .populate('event', 'name')
      .populate('createdBy', 'firstName lastName profilePicture');

    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: album
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter une photo à un album
// @route   POST /api/albums/:id/photos
// @access  Private
exports.addPhoto = async (req, res, next) => {
  try {
    const { url, caption } = req.body;

    const album = await PhotoAlbum.findById(req.params.id);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album non trouvé'
      });
    }

    const photo = await Photo.create({
      album: req.params.id,
      uploadedBy: req.user._id,
      url,
      caption
    });

    await photo.populate('uploadedBy', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Photo ajoutée avec succès',
      data: photo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les photos d'un album
// @route   GET /api/albums/:id/photos
// @access  Private
exports.getPhotos = async (req, res, next) => {
  try {
    const photos = await Photo.find({ album: req.params.id })
      .populate('uploadedBy', 'firstName lastName profilePicture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Commenter une photo
// @route   POST /api/photos/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo non trouvée'
      });
    }

    const comment = await PhotoComment.create({
      photo: req.params.id,
      author: req.user._id,
      content
    });

    await comment.populate('author', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Commentaire ajouté avec succès',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les commentaires d'une photo
// @route   GET /api/photos/:id/comments
// @access  Private
exports.getComments = async (req, res, next) => {
  try {
    const comments = await PhotoComment.find({ photo: req.params.id })
      .populate('author', 'firstName lastName profilePicture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une photo
// @route   DELETE /api/photos/:id
// @access  Private
exports.deletePhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo non trouvée'
      });
    }

    // Vérifier que c'est l'uploader
    if (photo.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cette photo'
      });
    }

    await photo.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Photo supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};