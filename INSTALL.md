# Guide d'installation et de démarrage rapide

##  Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 16 ou supérieure) - [Télécharger](https://nodejs.org/)
- **MongoDB** (version 5 ou supérieure) - [Télécharger](https://www.mongodb.com/try/download/community)
- **Git** - [Télécharger](https://git-scm.com/)
- Un éditeur de code (VS Code recommandé)

### Vérifier les installations

```bash
node --version   # Doit afficher v16.x.x ou supérieur
npm --version    # Doit afficher 8.x.x ou supérieur
mongo --version  # Doit afficher v5.x.x ou supérieur
git --version    # Doit afficher 2.x.x ou supérieur
```

##  Installation

### 1. Cloner le projet

```bash
git clone <url-du-repository>
cd my-social-networks-api
```

### 2. Installer les dépendances

```bash
npm install
```

Cela installera toutes les dépendances listées dans `package.json` :
- express
- mongoose
- bcryptjs
- jsonwebtoken
- express-validator
- cors
- dotenv
- morgan
- multer

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
# ou créer manuellement le fichier
```

Contenu du fichier `.env` :

```env
# Port du serveur
PORT=3000

# URI de connexion MongoDB
MONGODB_URI=mongodb://localhost:27017/my-social-networks

# Secret pour JWT (à changer en production !)
JWT_SECRET=votre_secret_jwt_tres_securise_a_changer_absolument

# Durée de validité du token JWT
JWT_EXPIRE=7d

# Environnement
NODE_ENV=development
```

** IMPORTANT** : 
- Changez `JWT_SECRET` par une chaîne aléatoire et sécurisée
- Ne commitez JAMAIS le fichier `.env` sur Git (il est dans `.gitignore`)

### 4. Démarrer MongoDB

#### Sur Windows :
```bash
# Démarrer MongoDB comme service
net start MongoDB
```

#### Sur macOS :
```bash
# Avec Homebrew
brew services start mongodb-community@5.0
```

#### Sur Linux :
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Vérifier que MongoDB fonctionne :
```bash
# Se connecter au shell MongoDB
mongosh
# ou
mongo
```

##  Démarrage

### Mode développement (avec rechargement automatique)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

### Vérifier que l'API fonctionne

```bash
curl http://localhost:3000
```

Vous devriez voir :
```json
{
  "success": true,
  "message": "Bienvenue sur l'API My Social Networks",
  "version": "1.0.0",
  "documentation": "/api-docs"
}
```

## Vérifier la base de données

### Se connecter à MongoDB

```bash
mongosh
```

### Commandes utiles

```javascript
// Afficher toutes les bases de données
show dbs

// Utiliser la base de données
use my-social-networks

// Afficher les collections
show collections

// Compter les documents dans une collection
db.users.countDocuments()

// Afficher tous les utilisateurs
db.users.find().pretty()

// Supprimer toutes les données (ATTENTION !)
db.dropDatabase()
```

##  Tester l'API

### 1. Inscription d'un utilisateur

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "dateOfBirth": "1990-01-01"
  }'
```

### 2. Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

Copiez le `token` retourné dans la réponse.

### 3. Tester une route protégée

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

Remplacez `VOTRE_TOKEN_ICI` par le token obtenu à l'étape 2.

## 🔧 Outils de développement recommandés

### Postman / Insomnia
Pour tester les endpoints de l'API facilement :
- [Postman](https://www.postman.com/downloads/)
- [Insomnia](https://insomnia.rest/download)

### MongoDB Compass
Interface graphique pour MongoDB :
- [Télécharger MongoDB Compass](https://www.mongodb.com/try/download/compass)

### Extension VS Code recommandées
- REST Client
- MongoDB for VS Code
- ESLint
- Prettier

##  Résolution des problèmes courants

### Erreur : MongoDB connection failed

**Problème** : MongoDB n'est pas démarré ou l'URI est incorrecte

**Solution** :
```bash
# Vérifier que MongoDB est démarré
sudo systemctl status mongod  # Linux
brew services list            # macOS

# Vérifier l'URI dans .env
MONGODB_URI=mongodb://localhost:27017/my-social-networks
```

### Erreur : Port already in use

**Problème** : Le port 3000 est déjà utilisé

**Solution** :
```bash
# Trouver le processus qui utilise le port
lsof -i :3000          # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Tuer le processus
kill -9 <PID>          # macOS/Linux
taskkill /PID <PID> /F # Windows

# Ou changer le port dans .env
PORT=3001
```

### Erreur : Module not found

**Problème** : Dépendances manquantes

**Solution** :
```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### Erreur : JWT malformed

**Problème** : Token JWT invalide ou manquant

**Solution** :
- Vérifier que vous avez bien copié le token complet
- Vérifier le format du header : `Authorization: Bearer <token>`
- Se reconnecter pour obtenir un nouveau token

##  Structure du projet

```
my-social-networks-api/
├── src/
│   ├── config/
│   │   └── database.js          # Configuration MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Logique d'authentification
│   │   ├── userController.js    # Logique utilisateurs
│   │   ├── eventController.js   # Logique événements
│   │   └── groupController.js   # Logique groupes
│   ├── middleware/
│   │   ├── auth.js              # Middleware JWT
│   │   ├── error.js             # Gestion erreurs
│   │   └── validate.js          # Validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Group.js
│   │   └── ... (autres modèles)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── events.js
│   │   └── groups.js
│   ├── validators/
│   │   ├── userValidator.js
│   │   ├── eventValidator.js
│   │   └── groupValidator.js
│   └── index.js                 # Point d'entrée
├── .env                         # Variables d'environnement
├── .gitignore
├── package.json
├── README.md                    # Documentation principale
├── EXAMPLES.md                  # Exemples de requêtes
└── INSTALL.md                   # Ce fichier
```

##  Déploiement en production

### Préparer l'application

1. **Changer les variables d'environnement** :
```env
NODE_ENV=production
JWT_SECRET=un_secret_tres_long_et_tres_securise_genere_aleatoirement
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/my-social-networks
```

2. **Optimiser pour la production** :
```bash
# Installer uniquement les dépendances de production
npm install --production
```

### Options de déploiement

#### Option 1 : Heroku

```bash
# Installer Heroku CLI
# Créer une application
heroku create my-social-networks-api

# Ajouter MongoDB Atlas
heroku addons:create mongolab

# Configurer les variables d'environnement
heroku config:set JWT_SECRET=votre_secret
heroku config:set NODE_ENV=production

# Déployer
git push heroku main
```

#### Option 2 : Railway / Render

1. Connecter votre repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

#### Option 3 : VPS (DigitalOcean, AWS, etc.)

```bash
# Sur le serveur
git clone <repository>
cd my-social-networks-api
npm install --production

# Installer PM2 pour gérer le processus
npm install -g pm2

# Démarrer l'application
pm2 start src/index.js --name my-social-networks

# Configuration PM2 pour démarrage auto
pm2 startup
pm2 save
```

##  Ressources supplémentaires

- [Documentation Express](https://expressjs.com/)
- [Documentation MongoDB](https://docs.mongodb.com/)
- [Documentation Mongoose](https://mongoosejs.com/docs/)
- [JWT.io](https://jwt.io/)

##  Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez les logs du serveur
2. Vérifiez la connexion MongoDB
3. Vérifiez les variables d'environnement
4. Consultez la documentation API dans README.md
5. Testez avec les exemples dans EXAMPLES.md

##  Checklist de démarrage

- [ ] Node.js installé
- [ ] MongoDB installé et démarré
- [ ] Projet cloné
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` créé et configuré
- [ ] Serveur démarré (`npm run dev`)
- [ ] Test d'inscription réussi
- [ ] Test de connexion réussi
- [ ] Route protégée testée avec succès

**Bon développement ! 🚀**
