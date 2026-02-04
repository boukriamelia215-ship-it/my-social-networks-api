# My Social Networks API

API REST pour le service My Social Networks de Facebook. Cette API permet de gérer des événements, des groupes, des fils de discussion, des albums photo, des sondages et bien plus encore.

## 📋 Table des matières

- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Architecture](#architecture)
- [Documentation API](#documentation-api)
- [Modèles de données](#modèles-de-données)

## 🛠 Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcryptjs** - Hachage des mots de passe
- **express-validator** - Validation des données

## 📦 Installation

```bash
# Cloner le repository
git clone <votre-repo-url>
cd my-social-networks-api

# Installer les dépendances
npm install
```

## ⚙️ Configuration

Créer un fichier `.env` à la racine du projet :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/my-social-networks
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🚀 Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

L'API sera accessible sur `http://localhost:3000`

## 🏗 Architecture

```
src/
├── config/
│   └── database.js          # Configuration MongoDB
├── controllers/
│   ├── authController.js    # Authentification
│   ├── userController.js    # Gestion utilisateurs
│   ├── eventController.js   # Gestion événements
│   └── groupController.js   # Gestion groupes
├── middleware/
│   ├── auth.js              # Middleware JWT
│   ├── error.js             # Gestion erreurs
│   └── validate.js          # Validation
├── models/
│   ├── User.js              # Modèle utilisateur
│   ├── Event.js             # Modèle événement
│   ├── Group.js             # Modèle groupe
│   ├── DiscussionThread.js  # Modèle fil discussion
│   ├── Message.js           # Modèle message
│   ├── PhotoAlbum.js        # Modèle album photo
│   ├── Photo.js             # Modèle photo
│   ├── PhotoComment.js      # Modèle commentaire photo
│   ├── Poll.js              # Modèle sondage
│   ├── PollResponse.js      # Modèle réponse sondage
│   ├── TicketType.js        # Modèle type de billet
│   ├── Ticket.js            # Modèle billet
│   ├── ShoppingListItem.js  # Modèle liste courses (BONUS)
│   └── Carpool.js           # Modèle covoiturage (BONUS)
├── routes/
│   ├── auth.js              # Routes authentification
│   ├── users.js             # Routes utilisateurs
│   ├── events.js            # Routes événements
│   └── groups.js            # Routes groupes
├── validators/
│   ├── userValidator.js     # Validation utilisateurs
│   ├── eventValidator.js    # Validation événements
│   └── groupValidator.js    # Validation groupes
└── index.js                 # Point d'entrée
```

## 📚 Documentation API

### Base URL

```
http://localhost:3000/api
```

### Authentification

Toutes les routes (sauf `/auth/register` et `/auth/login`) nécessitent un token JWT dans le header :

```
Authorization: Bearer <votre_token_jwt>
```

---

## 🔐 Authentification

### Inscription

```http
POST /api/auth/register
```

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "dateOfBirth": "1990-01-01",
  "phone": "+33612345678",
  "location": "Paris, France",
  "bio": "Passionné de technologie"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Connexion

```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Obtenir l'utilisateur connecté

```http
GET /api/auth/me
```

---

## 👤 Utilisateurs

### Obtenir tous les utilisateurs

```http
GET /api/users?search=john&limit=20&page=1
```

**Query Parameters:**
- `search` (optionnel) - Rechercher par nom ou email
- `limit` (optionnel) - Nombre de résultats par page (défaut: 20)
- `page` (optionnel) - Numéro de page (défaut: 1)

### Obtenir un utilisateur par ID

```http
GET /api/users/:id
```

### Mettre à jour un utilisateur

```http
PUT /api/users/:id
```

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Nouvelle bio",
  "location": "Lyon, France",
  "phone": "+33612345678"
}
```

### Supprimer un utilisateur

```http
DELETE /api/users/:id
```

---

## 📅 Événements

### Créer un événement

```http
POST /api/events
```

**Body:**
```json
{
  "name": "Soirée d'anniversaire",
  "description": "Venez célébrer mes 30 ans !",
  "startDate": "2026-06-15T19:00:00.000Z",
  "endDate": "2026-06-16T02:00:00.000Z",
  "location": "123 Rue de la Fête, 75001 Paris",
  "coverPhoto": "https://example.com/photo.jpg",
  "isPrivate": false,
  "organizers": ["60d5ec49f1b2c8b1f8c7e8a1"],
  "group": "60d5ec49f1b2c8b1f8c7e8a2",
  "hasTicketing": true,
  "hasShoppingList": true,
  "hasCarpooling": true
}
```

**Champs requis:**
- `name` - Nom de l'événement (max 200 caractères)
- `description` - Description (max 5000 caractères)
- `startDate` - Date de début (ISO 8601)
- `endDate` - Date de fin (ISO 8601, doit être après startDate)
- `location` - Lieu de l'événement (max 500 caractères)

**Champs optionnels:**
- `coverPhoto` - URL de la photo de couverture
- `isPrivate` - Événement privé ou public (défaut: false)
- `organizers` - Array d'IDs d'organisateurs (l'utilisateur connecté est toujours organisateur)
- `group` - ID du groupe lié (optionnel)
- `hasTicketing` - Activer la billetterie (défaut: false)
- `hasShoppingList` - Activer la liste de courses (défaut: false)
- `hasCarpooling` - Activer le covoiturage (défaut: false)

### Obtenir tous les événements

```http
GET /api/events?search=anniversaire&isPrivate=false&group=60d5ec49f1b2c8b1f8c7e8a2&limit=20&page=1
```

**Query Parameters:**
- `search` - Rechercher par nom ou description
- `isPrivate` - Filtrer par type (true/false)
- `group` - Filtrer par groupe
- `startDate` - Filtrer par date de début minimum
- `endDate` - Filtrer par date de fin maximum
- `limit` - Nombre de résultats par page (défaut: 20)
- `page` - Numéro de page (défaut: 1)

### Obtenir un événement par ID

```http
GET /api/events/:id
```

### Mettre à jour un événement

```http
PUT /api/events/:id
```

**Note:** Seuls les organisateurs peuvent modifier un événement

### Supprimer un événement

```http
DELETE /api/events/:id
```

**Note:** Seuls le créateur ou les organisateurs peuvent supprimer un événement

### Ajouter un participant

```http
POST /api/events/:id/participants
```

**Body:**
```json
{
  "userId": "60d5ec49f1b2c8b1f8c7e8a1"
}
```

### Retirer un participant

```http
DELETE /api/events/:id/participants/:userId
```

---

## 👥 Groupes

### Créer un groupe

```http
POST /api/groups
```

**Body:**
```json
{
  "name": "Tech Enthusiasts",
  "description": "Groupe pour les passionnés de technologie",
  "icon": "https://example.com/icon.jpg",
  "coverPhoto": "https://example.com/cover.jpg",
  "type": "public",
  "allowMembersToPost": true,
  "allowMembersToCreateEvents": false,
  "administrators": ["60d5ec49f1b2c8b1f8c7e8a1"]
}
```

**Champs requis:**
- `name` - Nom du groupe (max 100 caractères)
- `description` - Description (max 1000 caractères)
- `type` - Type de groupe: "public", "private" ou "secret"

**Champs optionnels:**
- `icon` - URL de l'icône
- `coverPhoto` - URL de la photo de couverture
- `allowMembersToPost` - Les membres peuvent poster (défaut: true)
- `allowMembersToCreateEvents` - Les membres peuvent créer des événements (défaut: false)
- `administrators` - Array d'IDs d'administrateurs (l'utilisateur connecté est toujours admin)

### Obtenir tous les groupes

```http
GET /api/groups?search=tech&type=public&limit=20&page=1
```

**Query Parameters:**
- `search` - Rechercher par nom ou description
- `type` - Filtrer par type (public/private/secret)
- `limit` - Nombre de résultats par page (défaut: 20)
- `page` - Numéro de page (défaut: 1)

### Obtenir un groupe par ID

```http
GET /api/groups/:id
```

### Mettre à jour un groupe

```http
PUT /api/groups/:id
```

**Note:** Seuls les administrateurs peuvent modifier un groupe

### Supprimer un groupe

```http
DELETE /api/groups/:id
```

**Note:** Seul le créateur peut supprimer un groupe

### Ajouter un membre

```http
POST /api/groups/:id/members
```

**Body:**
```json
{
  "userId": "60d5ec49f1b2c8b1f8c7e8a1"
}
```

### Retirer un membre

```http
DELETE /api/groups/:id/members/:userId
```

### Ajouter un administrateur

```http
POST /api/groups/:id/administrators
```

**Body:**
```json
{
  "userId": "60d5ec49f1b2c8b1f8c7e8a1"
}
```

---

## 📊 Modèles de données

### User (Utilisateur)

```javascript
{
  firstName: String,        // Requis, max 50 caractères
  lastName: String,         // Requis, max 50 caractères
  email: String,            // Requis, unique, format email
  password: String,         // Requis, min 6 caractères (hashé)
  dateOfBirth: Date,        // Requis
  profilePicture: String,   // URL, optionnel
  coverPhoto: String,       // URL, optionnel
  bio: String,              // Max 500 caractères
  location: String,         // Optionnel
  phone: String,            // Optionnel
  isActive: Boolean,        // Défaut: true
  createdAt: Date,          // Auto-généré
  updatedAt: Date           // Auto-généré
}
```

### Event (Événement)

```javascript
{
  name: String,                    // Requis, max 200 caractères
  description: String,             // Requis, max 5000 caractères
  startDate: Date,                 // Requis
  endDate: Date,                   // Requis (doit être après startDate)
  location: String,                // Requis, max 500 caractères
  coverPhoto: String,              // URL, optionnel
  isPrivate: Boolean,              // Défaut: false
  organizers: [ObjectId],          // Référence User, au moins 1 requis
  participants: [ObjectId],        // Référence User
  group: ObjectId,                 // Référence Group, optionnel
  createdBy: ObjectId,             // Référence User, requis
  hasTicketing: Boolean,           // Défaut: false
  hasShoppingList: Boolean,        // Défaut: false
  hasCarpooling: Boolean,          // Défaut: false
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### Group (Groupe)

```javascript
{
  name: String,                    // Requis, max 100 caractères
  description: String,             // Requis, max 1000 caractères
  icon: String,                    // URL, optionnel
  coverPhoto: String,              // URL, optionnel
  type: String,                    // Requis: "public", "private", "secret"
  allowMembersToPost: Boolean,     // Défaut: true
  allowMembersToCreateEvents: Boolean, // Défaut: false
  administrators: [ObjectId],      // Référence User, au moins 1 requis
  members: [ObjectId],             // Référence User
  createdBy: ObjectId,             // Référence User, requis
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### DiscussionThread (Fil de discussion)

```javascript
{
  title: String,                   // Requis, max 200 caractères
  group: ObjectId,                 // Référence Group (exclusif avec event)
  event: ObjectId,                 // Référence Event (exclusif avec group)
  createdBy: ObjectId,             // Référence User, requis
  isPinned: Boolean,               // Défaut: false
  isLocked: Boolean,               // Défaut: false
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### Message

```javascript
{
  content: String,                 // Requis, max 10000 caractères
  discussionThread: ObjectId,      // Référence DiscussionThread, requis
  author: ObjectId,                // Référence User, requis
  parentMessage: ObjectId,         // Référence Message, pour les réponses
  attachments: [String],           // URLs, optionnel
  isEdited: Boolean,               // Défaut: false
  editedAt: Date,                  // Optionnel
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### PhotoAlbum (Album photo)

```javascript
{
  name: String,                    // Requis, max 100 caractères
  description: String,             // Max 500 caractères
  event: ObjectId,                 // Référence Event, requis
  createdBy: ObjectId,             // Référence User, requis
  coverPhoto: String,              // URL, optionnel
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### Photo

```javascript
{
  url: String,                     // Requis
  caption: String,                 // Max 500 caractères
  album: ObjectId,                 // Référence PhotoAlbum, requis
  uploadedBy: ObjectId,            // Référence User, requis
  size: Number,                    // Taille en octets
  width: Number,                   // Largeur en pixels
  height: Number,                  // Hauteur en pixels
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### PhotoComment (Commentaire photo)

```javascript
{
  content: String,                 // Requis, max 1000 caractères
  photo: ObjectId,                 // Référence Photo, requis
  author: ObjectId,                // Référence User, requis
  isEdited: Boolean,               // Défaut: false
  editedAt: Date,                  // Optionnel
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### Poll (Sondage)

```javascript
{
  title: String,                   // Requis, max 200 caractères
  description: String,             // Max 1000 caractères
  event: ObjectId,                 // Référence Event, requis
  createdBy: ObjectId,             // Référence User, requis
  questions: [{
    questionText: String,          // Requis, max 500 caractères
    options: [{
      optionText: String           // Requis, max 200 caractères
    }]
  }],
  isActive: Boolean,               // Défaut: true
  closingDate: Date,               // Optionnel
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### PollResponse (Réponse au sondage)

```javascript
{
  poll: ObjectId,                  // Référence Poll, requis
  participant: ObjectId,           // Référence User, requis
  answers: [{
    questionId: ObjectId,          // ID de la question, requis
    selectedOptionId: ObjectId     // ID de l'option sélectionnée, requis
  }],
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### TicketType (Type de billet)

```javascript
{
  name: String,                    // Requis, max 100 caractères
  description: String,             // Max 500 caractères
  price: Number,                   // Requis, min 0
  quantity: Number,                // Requis, min 1
  availableQuantity: Number,       // Auto-calculé
  event: ObjectId,                 // Référence Event, requis
  createdBy: ObjectId,             // Référence User, requis
  isActive: Boolean,               // Défaut: true
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### Ticket (Billet)

```javascript
{
  ticketType: ObjectId,            // Référence TicketType, requis
  event: ObjectId,                 // Référence Event, requis
  buyer: {
    firstName: String,             // Requis, max 50 caractères
    lastName: String,              // Requis, max 50 caractères
    email: String,                 // Requis, format email
    address: {
      street: String,              // Requis
      city: String,                // Requis
      postalCode: String,          // Requis
      country: String              // Requis
    }
  },
  purchaseDate: Date,              // Défaut: Date.now
  ticketNumber: String,            // Auto-généré, unique
  price: Number,                   // Requis
  status: String,                  // "valid", "used", "cancelled", "refunded"
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### ShoppingListItem (Liste de courses - BONUS)

```javascript
{
  name: String,                    // Requis, max 100 caractères
  quantity: Number,                // Requis, min 1
  arrivalTime: Date,               // Requis
  event: ObjectId,                 // Référence Event, requis
  broughtBy: ObjectId,             // Référence User, requis
  notes: String,                   // Max 500 caractères
  isBrought: Boolean,              // Défaut: false
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

### Carpool (Covoiturage - BONUS)

```javascript
{
  event: ObjectId,                 // Référence Event, requis
  driver: ObjectId,                // Référence User, requis
  departureLocation: String,       // Requis, max 500 caractères
  departureTime: Date,             // Requis
  price: Number,                   // Requis, min 0
  availableSeats: Number,          // Requis, min 1, max 8
  maxDetourTime: Number,           // Requis, en minutes
  passengers: [ObjectId],          // Référence User
  status: String,                  // "available", "full", "cancelled", "completed"
  notes: String,                   // Max 1000 caractères
  createdAt: Date,                 // Auto-généré
  updatedAt: Date                  // Auto-généré
}
```

---

## 🔒 Règles de sécurité

1. **Authentification**: Toutes les routes (sauf register/login) nécessitent un token JWT
2. **Autorisation**:
   - Un utilisateur ne peut modifier que son propre profil
   - Seuls les organisateurs peuvent modifier/supprimer un événement
   - Seuls les administrateurs peuvent modifier un groupe
   - Seul le créateur peut supprimer un groupe
3. **Validation**: Tous les inputs sont validés avec express-validator
4. **Mots de passe**: Hashés avec bcryptjs (10 rounds)
5. **Emails uniques**: Pas de doublons autorisés

---

## 📝 Notes importantes

### Événements
- Un événement doit avoir au moins un organisateur
- La date de fin doit être postérieure à la date de début
- Les événements liés à un groupe invitent automatiquement tous les membres
- Les événements privés ne sont visibles que par les organisateurs et participants

### Groupes
- Un groupe doit avoir au moins un administrateur
- Les groupes "secret" ne sont visibles que par les membres
- Les groupes "private" sont visibles mais l'accès est contrôlé
- Les groupes "public" sont visibles et accessibles à tous

### Fils de discussion
- Un fil doit être lié soit à un groupe, soit à un événement (pas les deux)
- Les messages peuvent avoir des réponses (parentMessage)

### Sondages
- Chaque sondage doit avoir au moins une question
- Chaque question doit avoir au moins deux options
- Un participant ne peut répondre qu'une seule fois à un sondage

### Billetterie
- La quantité disponible est automatiquement mise à jour lors de l'achat
- Un numéro de billet unique est généré automatiquement
- Une personne ne peut acheter qu'un seul billet

### Shopping List (BONUS)
- Chaque article doit être unique par événement
- Un utilisateur indique ce qu'il apporte

### Covoiturage (BONUS)
- Le statut est automatiquement mis à jour ("full" quand complet)
- Le temps de détour maximum est en minutes

---

## 🤝 Contribution

Ce projet a été réalisé selon les spécifications du cahier des charges Facebook pour My Social Networks.

## 📄 Licence

ISC

---

**Développé avec ❤️ pour Facebook**
