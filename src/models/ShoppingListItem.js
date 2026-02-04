import mongoose from 'mongoose';

const shoppingListItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'article est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  quantity: {
    type: Number,
    required: [true, 'La quantité est requise'],
    min: [1, 'La quantité doit être au moins 1']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'L\'heure d\'arrivée est requise']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'L\'événement est requis']
  },
  broughtBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  notes: {
    type: String,
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères'],
    default: ''
  },
  isBrought: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour garantir l'unicité par événement
shoppingListItemSchema.index({ event: 1, name: 1 }, { unique: true });
shoppingListItemSchema.index({ event: 1, broughtBy: 1 });

const ShoppingListItem = mongoose.model('ShoppingListItem', shoppingListItemSchema);

export default ShoppingListItem;
