import { body, param } from 'express-validator';

export const createEventValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom de l\'événement est requis')
    .isLength({ max: 200 }).withMessage('Le nom ne peut pas dépasser 200 caractères'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('La description est requise')
    .isLength({ max: 5000 }).withMessage('La description ne peut pas dépasser 5000 caractères'),
  
  body('startDate')
    .notEmpty().withMessage('La date de début est requise')
    .isISO8601().withMessage('Date de début invalide')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      if (startDate < today) {
        throw new Error('La date de début ne peut pas être dans le passé');
      }
      return true;
    }),
  
  body('endDate')
    .notEmpty().withMessage('La date de fin est requise')
    .isISO8601().withMessage('Date de fin invalide')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      if (endDate <= startDate) {
        throw new Error('La date de fin doit être postérieure à la date de début');
      }
      return true;
    }),
  
  body('location')
    .trim()
    .notEmpty().withMessage('Le lieu est requis')
    .isLength({ max: 500 }).withMessage('Le lieu ne peut pas dépasser 500 caractères'),
  
  body('isPrivate')
    .optional()
    .isBoolean().withMessage('isPrivate doit être un booléen'),
  
  body('organizers')
    .optional()
    .isArray().withMessage('Les organisateurs doivent être un tableau')
    .custom((value) => {
      if (value && value.length > 0) {
        for (let id of value) {
          if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error('ID d\'organisateur invalide');
          }
        }
      }
      return true;
    }),
  
  body('group')
    .optional()
    .isMongoId().withMessage('ID de groupe invalide'),
  
  body('hasTicketing')
    .optional()
    .isBoolean().withMessage('hasTicketing doit être un booléen'),
  
  body('hasShoppingList')
    .optional()
    .isBoolean().withMessage('hasShoppingList doit être un booléen'),
  
  body('hasCarpooling')
    .optional()
    .isBoolean().withMessage('hasCarpooling doit être un booléen')
];

export const updateEventValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Le nom ne peut pas dépasser 200 caractères'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('La description ne peut pas dépasser 5000 caractères'),
  
  body('startDate')
    .optional()
    .isISO8601().withMessage('Date de début invalide'),
  
  body('endDate')
    .optional()
    .isISO8601().withMessage('Date de fin invalide'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Le lieu ne peut pas dépasser 500 caractères'),
  
  body('isPrivate')
    .optional()
    .isBoolean().withMessage('isPrivate doit être un booléen')
];

export const eventIdValidator = [
  param('id')
    .isMongoId().withMessage('ID d\'événement invalide')
];

export const addParticipantValidator = [
  param('id')
    .isMongoId().withMessage('ID d\'événement invalide'),
  
  body('userId')
    .notEmpty().withMessage('L\'ID de l\'utilisateur est requis')
    .isMongoId().withMessage('ID d\'utilisateur invalide')
];
