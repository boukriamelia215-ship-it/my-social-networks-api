# My Social Networks API

API REST complète pour la gestion d'un réseau social avec événements, groupes, discussions, albums photos, sondages, billetterie et fonctionnalités bonus.

---

##  Informations

**Étudiante** : Amelia Boukri  
**Formation** : Master 1 Data Engineering et Intelligence Artificielle  
**Module** : API Web Services  
**Enseignant** : Cyril Vimard  
**Année** : 2025-2026
**Lien pour la documentation** :  https://documenter.getpostman.com/view/49048388/2sBXc8pPXd
---

##  À propos

Cette API REST a été développée dans le cadre d'un projet école pour Facebook. Elle permet de gérer un réseau social complet incluant :

- Gestion des utilisateurs avec authentification JWT
- Création et gestion d'événements (publics/privés)
- Groupes (public, privé, secret) avec permissions personnalisables
- Fils de discussion et messagerie
- Albums photos avec commentaires
- Sondages pour les événements
- Système de billetterie complet
- **BONUS** : Liste de courses collaborative
- **BONUS** : Système de covoiturage

Le projet respecte intégralement les spécifications du cahier des charges et implémente les deux fonctionnalités bonus demandées.

---

## 🛠 Technologies utilisées

### Backend
- **Node.js** (v16+) - Environnement d'exécution JavaScript
- **Express.js** (v4.18) - Framework web minimaliste
- **MongoDB** (v8.2) - Base de données NoSQL orientée documents
- **Mongoose** (v8.0) - ODM (Object Data Modeling) pour MongoDB

### Sécurité & Validation
- **JWT (jsonwebtoken)** - Authentification par tokens sécurisés
- **bcryptjs** - Hachage sécurisé des mots de passe (10 rounds)
- **express-validator** - Validation et sanitization des données d'entrée

### Outils de développement
- **Morgan** - Logger HTTP pour le développement
- **CORS** - Gestion des requêtes cross-origin
- **Nodemon** - Rechargement automatique du serveur en développement
- **dotenv** - Gestion des variables d'environnement

---

## Architecture du projet

Le projet suit une architecture **MVC (Model-View-Controller)** modulaire :
```
my-social-networks-api/
├── src/
│   ├── config/              # Configuration (MongoDB)
│   ├── controllers/         # Logique métier (10 controllers)
│   ├── middleware/          # Middlewares (auth, validation, erreurs)
│   ├── models/              # Schémas Mongoose (14 modèles)
│   ├── routes/              # Définition des endpoints (10 fichiers)
│   ├── validators/          # Règles de validation
│   └── index.js             # Point d'entrée de l'application
├── .env                     # Variables d'environnement (non versionné)
├── .env.example             # Exemple de configuration
├── .gitignore               # Fichiers à ignorer par Git
├── package.json             # Dépendances et scripts npm
└── README.md                # Documentation du projet
```

---

## Modèles de données

L'API comprend **14 modèles** couvrant l'ensemble des fonctionnalités :

### Entités principales
- **User** - Utilisateurs avec authentification
- **Event** - Événements avec organisateurs et participants
- **Group** - Groupes (public, privé, secret)

### Communication
- **DiscussionThread** - Fils de discussion liés aux groupes/événements
- **Message** - Messages avec système de réponses (threads)

### Médias
- **PhotoAlbum** - Albums photos d'événements
- **Photo** - Photos uploadées par les participants
- **PhotoComment** - Commentaires sur les photos

### Interactions
- **Poll** - Sondages créés par les organisateurs
- **PollResponse** - Réponses des participants aux sondages

### Billetterie
- **TicketType** - Types de billets configurables
- **Ticket** - Billets achetés avec informations acheteur

### Fonctionnalités bonus
- **ShoppingListItem** - Liste de courses collaborative
- **Carpool** - Covoiturage pour les événements

---

##  API REST - Endpoints disponibles

**Total : 58 endpoints fonctionnels**

###  Authentification (3 endpoints)
- POST `/api/auth/register` - Inscription
- POST `/api/auth/login` - Connexion
- GET `/api/auth/me` - Profil connecté

###  Utilisateurs (4 endpoints)
- GET `/api/users` - Liste des utilisateurs
- GET `/api/users/:id` - Détails utilisateur
- PUT `/api/users/:id` - Modifier profil
- DELETE `/api/users/:id` - Désactiver compte

###  Événements (7 endpoints)
- POST `/api/events` - Créer événement
- GET `/api/events` - Liste événements
- GET `/api/events/:id` - Détails événement
- PUT `/api/events/:id` - Modifier événement
- DELETE `/api/events/:id` - Supprimer événement
- POST `/api/events/:id/participants` - Ajouter participant
- DELETE `/api/events/:id/participants/:userId` - Retirer participant

###  Groupes (8 endpoints)
- POST `/api/groups` - Créer groupe
- GET `/api/groups` - Liste groupes
- GET `/api/groups/:id` - Détails groupe
- PUT `/api/groups/:id` - Modifier groupe
- DELETE `/api/groups/:id` - Supprimer groupe
- POST `/api/groups/:id/members` - Ajouter membre
- DELETE `/api/groups/:id/members/:userId` - Retirer membre
- POST `/api/groups/:id/administrators` - Ajouter admin

###  Discussions & Messages (6 endpoints)
- POST `/api/discussions` - Créer discussion
- GET `/api/discussions` - Liste discussions
- GET `/api/discussions/:id` - Détails discussion
- POST `/api/discussions/:id/messages` - Poster message
- GET `/api/discussions/:id/messages` - Récupérer messages
- DELETE `/api/messages/:id` - Supprimer message

###  Albums & Photos (8 endpoints)
- POST `/api/albums` - Créer album
- GET `/api/albums` - Liste albums
- GET `/api/albums/:id` - Détails album
- POST `/api/albums/:id/photos` - Ajouter photo
- GET `/api/albums/:id/photos` - Photos d'un album
- DELETE `/api/albums/photos/:id` - Supprimer photo
- POST `/api/albums/photos/:id/comments` - Commenter photo
- GET `/api/albums/photos/:id/comments` - Commentaires photo

###  Sondages (6 endpoints)
- POST `/api/polls` - Créer sondage
- GET `/api/polls` - Liste sondages
- GET `/api/polls/:id` - Détails sondage
- POST `/api/polls/:id/responses` - Répondre au sondage
- GET `/api/polls/:id/results` - Résultats sondage
- DELETE `/api/polls/:id` - Supprimer sondage

###  Billetterie (6 endpoints)
- POST `/api/tickets/ticket-types` - Créer type de billet
- GET `/api/tickets/ticket-types` - Liste types de billets
- GET `/api/tickets/ticket-types/:id` - Détails type billet
- DELETE `/api/tickets/ticket-types/:id` - Supprimer type billet
- POST `/api/tickets` - Acheter billet
- GET `/api/tickets` - Liste billets vendus

### 🛒 Shopping List - BONUS (4 endpoints)
- POST `/api/shopping-list` - Ajouter item
- GET `/api/shopping-list` - Liste items
- PUT `/api/shopping-list/:id` - Modifier item
- DELETE `/api/shopping-list/:id` - Supprimer item

###  Covoiturage - BONUS (6 endpoints)
- POST `/api/carpools` - Proposer covoiturage
- GET `/api/carpools` - Liste covoiturages
- GET `/api/carpools/:id` - Détails covoiturage
- PUT `/api/carpools/:id` - Modifier covoiturage
- DELETE `/api/carpools/:id` - Supprimer covoiturage
- POST `/api/carpools/:id/join` - Rejoindre covoiturage
- DELETE `/api/carpools/:id/leave` - Quitter covoiturage

---

## Sécurité

### Authentification JWT
- Tokens générés à l'inscription et à la connexion
- Durée de validité : 7 jours (configurable)
- Header requis : `Authorization: Bearer <token>`
- Middleware de protection sur routes sensibles

### Protection des données
- Mots de passe hashés avec bcryptjs (10 rounds)
- Email unique garanti (index MongoDB)
- Validation systématique avec express-validator
- Gestion centralisée des erreurs

### Autorisations
- Un utilisateur ne peut modifier que son propre profil
- Seuls les organisateurs peuvent modifier un événement
- Seuls les administrateurs peuvent gérer un groupe
- Validation des permissions avant chaque action

---

##  Installation

### Prérequis
- Node.js v16+
- MongoDB v5+
- npm

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/boukriamelia215-ship-it/my-social-networks-api.git
cd my-social-networks-api
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Modifier le fichier `.env` :
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/my-social-networks
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRE=7d
NODE_ENV=development
```

4. **Démarrer MongoDB**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

5. **Lancer l'application**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

L'API sera accessible sur `http://localhost:3000`

---

##  Tests

L'API a été testée avec **Postman**. Résultats des tests principaux :

###  Test 1 - Inscription utilisateur
**Endpoint** : `POST /api/auth/register`  
**Résultat** : Utilisateur créé, token JWT généré, email unique vérifié

### Test 2 - Authentification
**Endpoint** : `POST /api/auth/login`  
**Résultat** : Connexion réussie, token JWT valide

### Test 3 - Création de groupe
**Endpoint** : `POST /api/groups`  
**Résultat** : Groupe créé, utilisateur ajouté comme admin

###  Test 4 - Création d'événement
**Endpoint** : `POST /api/events`  
**Résultat** : Événement créé, utilisateur ajouté comme organisateur

**Statut global** :  Tous les tests réussis

---

##  Fonctionnalités clés

- Architecture RESTful respectant les standards HTTP
- Authentification sécurisée avec JWT
- Validation complète des données
- Gestion des relations entre entités (Mongoose populate)
- Pagination et filtres sur les listes
- Gestion d'erreurs centralisée
- Code modulaire et maintenable
- Conformité totale au cahier des charges
- Fonctionnalités bonus implémentées

---

##  Format des réponses

**Succès** :
```json
{
  "success": true,
  "message": "Description de l'action",
  "data": { }
}
```

**Erreur** :
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": [...]
}
```

---

##  Codes HTTP

- `200 OK` - Requête réussie
- `201 Created` - Ressource créée
- `400 Bad Request` - Erreur de validation
- `401 Unauthorized` - Authentification requise
- `403 Forbidden` - Accès refusé
- `404 Not Found` - Ressource non trouvée
- `500 Internal Server Error` - Erreur serveur

---

## Repository

**https://github.com/boukriamelia215-ship-it/my-social-networks-api**
**Lien pour la documentation** :  https://documenter.getpostman.com/view/49048388/2sBXc8pPXd
---

##  Conformité au cahier des charges

-  Tous les modèles de données spécifiés sont implémentés
-  Toutes les relations entre entités sont gérées
-  Validation des schémas avec Mongoose
-  Sécurisation avec express-validator
-  Authentification JWT fonctionnelle
-  Routes RESTful cohérentes
-  Fonctionnalités bonus (shopping list, covoiturage)
-  Documentation complète
-  Code sur repository Git

---

##  Évolutions possibles

- Tests unitaires automatisés (Jest)
- Documentation interactive (Swagger)
- Upload réel de fichiers
- Notifications en temps réel (WebSockets)
- Caching avec Redis
- Déploiement CI/CD

---

**Projet réalisé par Amelia Boukri - M1 Data Engineering et IA - 2026**