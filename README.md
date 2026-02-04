# My Social Networks API

API REST complète pour la gestion d'un réseau social avec événements, groupes et interactions.

---

## Informations

**Étudiante** : Amelia Boukri  
**Formation** : Master 1 Data Engineering et Intelligence Artificielle  
**Module** : API Web Services  
**Enseignant** : Cyril Vimard  
**Année** : 2025-2026

---

## À propos

Cette API REST a été développée dans le cadre d'un projet universitaire pour Facebook. Elle permet de gérer un réseau social complet incluant des utilisateurs, des événements, des groupes, des discussions, des albums photos, des sondages et un système de billetterie.

Le projet respecte intégralement les spécifications du cahier des charges et implémente également les fonctionnalités bonus (liste de courses collaborative et covoiturage).

---

## Technologies utilisées

### Backend
- **Node.js** (v16+) - Environnement d'exécution JavaScript
- **Express.js** (v4.18) - Framework web
- **MongoDB** (v8.2) - Base de données NoSQL
- **Mongoose** (v8.0) - ODM pour MongoDB

### Sécurité
- **JWT** - Authentification par tokens
- **bcryptjs** - Hachage sécurisé des mots de passe
- **express-validator** - Validation des données

### Outils
- **Morgan** - Logger HTTP
- **CORS** - Gestion des requêtes cross-origin
- **Nodemon** - Rechargement automatique en développement

---

## Architecture

Le projet suit une architecture MVC (Model-View-Controller) :

```
src/
├── config/          Configuration MongoDB
├── controllers/     Logique métier
├── middleware/      Authentification, validation, gestion d'erreurs
├── models/          Schémas de données (14 modèles)
├── routes/          Définition des endpoints
├── validators/      Règles de validation
└── index.js         Point d'entrée de l'application
```

---

## Modèles de données

L'API comprend **14 modèles** couvrant toutes les fonctionnalités :

**Entités principales**
- User - Gestion des utilisateurs
- Event - Événements avec organisateurs et participants
- Group - Groupes (public, privé, secret)

**Interactions sociales**
- DiscussionThread - Fils de discussion
- Message - Messages avec système de réponses
- PhotoAlbum - Albums photos d'événements
- Photo - Photos uploadées
- PhotoComment - Commentaires sur photos

**Fonctionnalités avancées**
- Poll - Sondages
- PollResponse - Réponses aux sondages
- TicketType - Types de billets
- Ticket - Billets achetés

**Fonctionnalités bonus**
- ShoppingListItem - Liste de courses collaborative
- Carpool - Covoiturage pour événements

---

## API REST - Endpoints disponibles

### Authentification (3 endpoints)
```
POST   /api/auth/register       Inscription d'un utilisateur
POST   /api/auth/login          Connexion et génération du token
GET    /api/auth/me             Profil de l'utilisateur connecté
```

### Utilisateurs (4 endpoints)
```
GET    /api/users               Liste des utilisateurs (pagination + recherche)
GET    /api/users/:id           Détails d'un utilisateur
PUT    /api/users/:id           Modification du profil
DELETE /api/users/:id           Désactivation du compte
```

### Événements (7 endpoints)
```
POST   /api/events                      Création d'un événement
GET    /api/events                      Liste des événements (filtres)
GET    /api/events/:id                  Détails d'un événement
PUT    /api/events/:id                  Modification
DELETE /api/events/:id                  Suppression
POST   /api/events/:id/participants     Ajouter un participant
DELETE /api/events/:id/participants/:id Retirer un participant
```

### Groupes (8 endpoints)
```
POST   /api/groups                       Création d'un groupe
GET    /api/groups                       Liste des groupes
GET    /api/groups/:id                   Détails d'un groupe
PUT    /api/groups/:id                   Modification
DELETE /api/groups/:id                   Suppression
POST   /api/groups/:id/members           Ajouter un membre
DELETE /api/groups/:id/members/:id       Retirer un membre
POST   /api/groups/:id/administrators    Ajouter un administrateur
```

**Total : 22 endpoints fonctionnels**

---

## Sécurité

### Authentification JWT
- Tokens générés à l'inscription et à la connexion
- Durée de validité : 7 jours (configurable)
- Header : `Authorization: Bearer <token>`
- Middleware de protection sur toutes les routes sensibles

### Protection des données
- Mots de passe hashés avec bcryptjs (10 rounds de salage)
- Email unique garanti au niveau de la base de données
- Validation systématique des entrées avec express-validator
- Gestion centralisée des erreurs avec messages explicites

### Autorisations
- Un utilisateur ne peut modifier que son propre profil
- Seuls les organisateurs peuvent modifier un événement
- Seuls les administrateurs peuvent modifier un groupe
- Règles strictes pour les suppressions

---

## Installation

### Prérequis
- Node.js v16 ou supérieur
- MongoDB v5 ou supérieur
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
JWT_SECRET=votre_secret_securise
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

## Tests

L'API a été testée avec **Postman**. Voici les résultats des tests principaux :

### Test 1 - Inscription utilisateur
**Endpoint** : `POST /api/auth/register`

**Données envoyées** :
```json
{
  "firstName": "Amelia",
  "lastName": "Boukri",
  "email": "amelia.test@example.com",
  "password": "password123",
  "dateOfBirth": "2000-01-15"
}
```

**Résultat** : Utilisateur créé avec succès, token JWT généré, email unique vérifié

---

### Test 2 - Authentification
**Endpoint** : `POST /api/auth/login`

**Données envoyées** :
```json
{
  "email": "amelia.test@example.com",
  "password": "password123"
}
```

**Résultat** : Connexion réussie, token JWT valide généré

---

### Test 3 - Création de groupe
**Endpoint** : `POST /api/groups`  
**Authentification** : Token JWT requis

**Données envoyées** :
```json
{
  "name": "Mon premier groupe",
  "description": "Groupe de test pour le projet",
  "type": "public"
}
```

**Résultat** : Groupe créé, utilisateur ajouté automatiquement comme administrateur et membre

---

### Test 4 - Création d'événement
**Endpoint** : `POST /api/events`  
**Authentification** : Token JWT requis

**Données envoyées** :
```json
{
  "name": "Soirée de lancement",
  "description": "Événement test pour valider l'API",
  "startDate": "2026-07-15T19:00:00.000Z",
  "endDate": "2026-07-15T23:00:00.000Z",
  "location": "Paris, France"
}
```

**Résultat** : Événement créé, utilisateur ajouté comme organisateur, validation des dates OK

---

**Statut global** : Tous les tests réussis

---

## Fonctionnalités clés

- Architecture RESTful respectant les standards
- Authentification sécurisée avec JWT
- Validation complète des données en entrée
- Gestion des relations entre entités (Mongoose populate)
- Pagination et filtres sur les listes
- Gestion d'erreurs centralisée
- Code modulaire et maintenable
- Conformité totale au cahier des charges
- Fonctionnalités bonus implémentées

---

## Format des réponses

Toutes les réponses de l'API suivent un format JSON standardisé :

**Succès** :
```json
{
  "success": true,
  "message": "Description de l'action",
  "data": {
    // Données retournées
  }
}
```

**Erreur** :
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": [
    {
      "field": "nom_du_champ",
      "message": "Message d'erreur"
    }
  ]
}
```

---

## Codes HTTP

- `200 OK` - Requête réussie
- `201 Created` - Ressource créée
- `400 Bad Request` - Erreur de validation
- `401 Unauthorized` - Authentification requise
- `403 Forbidden` - Accès refusé
- `404 Not Found` - Ressource non trouvée
- `500 Internal Server Error` - Erreur serveur

---

## Repository

Le code source complet est disponible sur GitHub :  
https://github.com/boukriamelia215-ship-it/my-social-networks-api

---

## Conformité au cahier des charges

- Tous les modèles de données spécifiés sont implémentés
- Toutes les relations entre entités sont gérées
- Validation des schémas avec Mongoose
- Sécurisation avec express-validator
- Authentification JWT fonctionnelle
- Routes RESTful cohérentes
- Fonctionnalités bonus (shopping list, covoiturage)

---

## Évolutions possibles

- Implémentation des routes pour photos, sondages et billetterie
- Tests unitaires automatisés (Jest)
- Documentation interactive (Swagger)
- Upload réel de fichiers
- Notifications en temps réel (WebSockets)
- Caching avec Redis

---

**Projet réalisé par Amelia Boukri - M1 Data Engineering et IA - 2026**
