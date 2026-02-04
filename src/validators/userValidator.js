import { body, param } from 'express-validator';

export const registerValidator = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('Le prénom est requis')
    .isLength({ max: 50 }).withMessage('Le prénom ne peut pas dépasser 50 caractères'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ max: 50 }).withMessage('Le nom ne peut pas dépasser 50 caractères'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  
  body('dateOfBirth')
    .notEmpty().withMessage('La date de naissance est requise')
    .isISO8601().withMessage('Date invalide')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      if (age < 13) {
        throw new Error('Vous devez avoir au moins 13 ans');
      }
      return true;
    })
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
];

export const updateUserValidator = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Le prénom ne peut pas dépasser 50 caractères'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Le nom ne peut pas dépasser 50 caractères'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La bio ne peut pas dépasser 500 caractères'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Le lieu ne peut pas dépasser 200 caractères'),
  
  body('phone')
    .optional()
    .trim()
];

export const userIdValidator = [
  param('id')
    .isMongoId().withMessage('ID utilisateur invalide')
];
