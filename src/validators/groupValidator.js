import { body, param } from 'express-validator';

export const createGroupValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom du groupe est requis')
    .isLength({ max: 100 }).withMessage('Le nom ne peut pas dépasser 100 caractères'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('La description est requise')
    .isLength({ max: 1000 }).withMessage('La description ne peut pas dépasser 1000 caractères'),
  
  body('type')
    .notEmpty().withMessage('Le type de groupe est requis')
    .isIn(['public', 'private', 'secret']).withMessage('Le type doit être public, private ou secret'),
  
  body('allowMembersToPost')
    .optional()
    .isBoolean().withMessage('allowMembersToPost doit être un booléen'),
  
  body('allowMembersToCreateEvents')
    .optional()
    .isBoolean().withMessage('allowMembersToCreateEvents doit être un booléen'),
  
  body('administrators')
    .optional()
    .isArray().withMessage('Les administrateurs doivent être un tableau')
    .custom((value) => {
      if (value && value.length > 0) {
        for (let id of value) {
          if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error('ID d\'administrateur invalide');
          }
        }
      }
      return true;
    })
];

export const updateGroupValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Le nom ne peut pas dépasser 100 caractères'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La description ne peut pas dépasser 1000 caractères'),
  
  body('type')
    .optional()
    .isIn(['public', 'private', 'secret']).withMessage('Le type doit être public, private ou secret'),
  
  body('allowMembersToPost')
    .optional()
    .isBoolean().withMessage('allowMembersToPost doit être un booléen'),
  
  body('allowMembersToCreateEvents')
    .optional()
    .isBoolean().withMessage('allowMembersToCreateEvents doit être un booléen')
];

export const groupIdValidator = [
  param('id')
    .isMongoId().withMessage('ID de groupe invalide')
];

export const addMemberValidator = [
  param('id')
    .isMongoId().withMessage('ID de groupe invalide'),
  
  body('userId')
    .notEmpty().withMessage('L\'ID de l\'utilisateur est requis')
    .isMongoId().withMessage('ID d\'utilisateur invalide')
];
