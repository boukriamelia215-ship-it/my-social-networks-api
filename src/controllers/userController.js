import User from '../models/User.js';

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res, next) => {
  try {
    const { search, limit = 20, page = 1 } = req.query;
    
    let query = {};
    
    // Recherche par nom ou email
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users: users.map(user => user.toPublicJSON()),
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

// @desc    Obtenir un utilisateur par ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un utilisateur
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    // Un utilisateur ne peut modifier que son propre profil
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier ce profil'
      });
    }

    const { firstName, lastName, bio, location, phone, profilePicture, coverPhoto } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, bio, location, phone, profilePicture, coverPhoto },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un utilisateur
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = async (req, res, next) => {
  try {
    // Un utilisateur ne peut supprimer que son propre compte
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce compte'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Compte désactivé avec succès'
    });
  } catch (error) {
    next(error);
  }
};
