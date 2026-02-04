import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token existe dans le header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraire le token
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur depuis le token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Compte utilisateur désactivé'
        });
      }

      next();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return res.status(401).json({
        success: false,
        message: 'Non autorisé, token invalide'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé, aucun token fourni'
    });
  }
};

// Générer un token JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};
