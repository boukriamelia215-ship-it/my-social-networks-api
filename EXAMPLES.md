# Exemples de requêtes API

Ce fichier contient des exemples de requêtes pour tester l'API avec curl, Postman ou HTTPie.

## Variables

```bash
BASE_URL="http://localhost:3000/api"
TOKEN="votre_token_jwt_ici"
```

## 🔐 Authentification

### Inscription

```bash
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Marie",
    "lastName": "Dupont",
    "email": "marie.dupont@example.com",
    "password": "password123",
    "dateOfBirth": "1995-03-15",
    "phone": "+33612345678",
    "location": "Paris, France",
    "bio": "Passionnée de photographie et de voyages"
  }'
```

### Connexion

```bash
curl -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "marie.dupont@example.com",
    "password": "password123"
  }'
```

### Obtenir le profil connecté

```bash
curl -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 👤 Utilisateurs

### Liste des utilisateurs

```bash
curl -X GET "$BASE_URL/users?search=marie&limit=10&page=1" \
  -H "Authorization: Bearer $TOKEN"
```

### Détails d'un utilisateur

```bash
curl -X GET $BASE_URL/users/60d5ec49f1b2c8b1f8c7e8a1 \
  -H "Authorization: Bearer $TOKEN"
```

### Modifier son profil

```bash
curl -X PUT $BASE_URL/users/60d5ec49f1b2c8b1f8c7e8a1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Nouvelle bio mise à jour",
    "location": "Lyon, France"
  }'
```

## 👥 Groupes

### Créer un groupe

```bash
curl -X POST $BASE_URL/groups \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Passionnés de Tech",
    "description": "Un groupe pour échanger sur les nouvelles technologies",
    "type": "public",
    "allowMembersToPost": true,
    "allowMembersToCreateEvents": false
  }'
```

### Créer un groupe privé

```bash
curl -X POST $BASE_URL/groups \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Groupe Famille",
    "description": "Groupe privé pour la famille",
    "type": "private",
    "allowMembersToPost": true,
    "allowMembersToCreateEvents": true
  }'
```

### Liste des groupes

```bash
curl -X GET "$BASE_URL/groups?search=tech&type=public&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Détails d'un groupe

```bash
curl -X GET $BASE_URL/groups/60d5ec49f1b2c8b1f8c7e8a2 \
  -H "Authorization: Bearer $TOKEN"
```

### Modifier un groupe

```bash
curl -X PUT $BASE_URL/groups/60d5ec49f1b2c8b1f8c7e8a2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Description mise à jour",
    "allowMembersToCreateEvents": true
  }'
```

### Ajouter un membre

```bash
curl -X POST $BASE_URL/groups/60d5ec49f1b2c8b1f8c7e8a2/members \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "60d5ec49f1b2c8b1f8c7e8a3"
  }'
```

### Retirer un membre

```bash
curl -X DELETE $BASE_URL/groups/60d5ec49f1b2c8b1f8c7e8a2/members/60d5ec49f1b2c8b1f8c7e8a3 \
  -H "Authorization: Bearer $TOKEN"
```

### Ajouter un administrateur

```bash
curl -X POST $BASE_URL/groups/60d5ec49f1b2c8b1f8c7e8a2/administrators \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "60d5ec49f1b2c8b1f8c7e8a3"
  }'
```

### Supprimer un groupe

```bash
curl -X DELETE $BASE_URL/groups/60d5ec49f1b2c8b1f8c7e8a2 \
  -H "Authorization: Bearer $TOKEN"
```

## 📅 Événements

### Créer un événement simple

```bash
curl -X POST $BASE_URL/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Soirée jeux de société",
    "description": "Venez passer une soirée conviviale autour de jeux !",
    "startDate": "2026-07-20T19:00:00.000Z",
    "endDate": "2026-07-20T23:00:00.000Z",
    "location": "15 Rue des Lilas, 75018 Paris",
    "isPrivate": false
  }'
```

### Créer un événement avec toutes les options

```bash
curl -X POST $BASE_URL/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Festival d'\''été",
    "description": "Le plus grand festival de l'\''année avec concerts, food trucks et animations !",
    "startDate": "2026-08-15T14:00:00.000Z",
    "endDate": "2026-08-15T23:00:00.000Z",
    "location": "Parc de la Villette, Paris",
    "coverPhoto": "https://example.com/festival-cover.jpg",
    "isPrivate": false,
    "hasTicketing": true,
    "hasShoppingList": true,
    "hasCarpooling": true
  }'
```

### Créer un événement lié à un groupe

```bash
curl -X POST $BASE_URL/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sortie groupe Tech",
    "description": "Visite d'\''une startup innovante",
    "startDate": "2026-06-10T14:00:00.000Z",
    "endDate": "2026-06-10T18:00:00.000Z",
    "location": "Station F, Paris",
    "group": "60d5ec49f1b2c8b1f8c7e8a2"
  }'
```

### Liste des événements

```bash
curl -X GET "$BASE_URL/events?search=festival&isPrivate=false&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

### Événements d'un groupe spécifique

```bash
curl -X GET "$BASE_URL/events?group=60d5ec49f1b2c8b1f8c7e8a2" \
  -H "Authorization: Bearer $TOKEN"
```

### Événements à venir

```bash
curl -X GET "$BASE_URL/events?startDate=2026-06-01" \
  -H "Authorization: Bearer $TOKEN"
```

### Détails d'un événement

```bash
curl -X GET $BASE_URL/events/60d5ec49f1b2c8b1f8c7e8a4 \
  -H "Authorization: Bearer $TOKEN"
```

### Modifier un événement

```bash
curl -X PUT $BASE_URL/events/60d5ec49f1b2c8b1f8c7e8a4 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Description mise à jour avec plus de détails",
    "location": "Nouveau lieu : 123 Avenue des Champs"
  }'
```

### Ajouter un participant

```bash
curl -X POST $BASE_URL/events/60d5ec49f1b2c8b1f8c7e8a4/participants \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "60d5ec49f1b2c8b1f8c7e8a3"
  }'
```

### Se retirer d'un événement

```bash
curl -X DELETE $BASE_URL/events/60d5ec49f1b2c8b1f8c7e8a4/participants/60d5ec49f1b2c8b1f8c7e8a3 \
  -H "Authorization: Bearer $TOKEN"
```

### Supprimer un événement

```bash
curl -X DELETE $BASE_URL/events/60d5ec49f1b2c8b1f8c7e8a4 \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Scénarios de test complets

### Scénario 1: Créer un groupe et un événement

```bash
# 1. S'inscrire
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sophie",
    "lastName": "Martin",
    "email": "sophie.martin@example.com",
    "password": "password123",
    "dateOfBirth": "1992-05-20"
  }'

# 2. Se connecter et récupérer le token
TOKEN=$(curl -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sophie.martin@example.com",
    "password": "password123"
  }' | jq -r '.data.token')

# 3. Créer un groupe
GROUP_ID=$(curl -X POST $BASE_URL/groups \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Amis Sportifs",
    "description": "Groupe pour organiser des sorties sportives",
    "type": "public",
    "allowMembersToCreateEvents": true
  }' | jq -r '.data._id')

# 4. Créer un événement dans le groupe
curl -X POST $BASE_URL/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Match de tennis\",
    \"description\": \"Tournoi amical de tennis\",
    \"startDate\": \"2026-07-01T10:00:00.000Z\",
    \"endDate\": \"2026-07-01T18:00:00.000Z\",
    \"location\": \"Courts de tennis municipaux\",
    \"group\": \"$GROUP_ID\"
  }"
```

### Scénario 2: Événement avec billetterie

```bash
# 1. Créer un événement avec billetterie activée
EVENT_ID=$(curl -X POST $BASE_URL/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Concert Jazz",
    "description": "Soirée jazz exceptionnelle",
    "startDate": "2026-09-15T20:00:00.000Z",
    "endDate": "2026-09-15T23:00:00.000Z",
    "location": "Salle Pleyel, Paris",
    "hasTicketing": true
  }' | jq -r '.data._id')

# 2. Créer des types de billets (à implémenter via route dédiée)
# 3. Acheter des billets (à implémenter via route dédiée)
```

### Scénario 3: Gestion complète d'un groupe

```bash
# 1. Créer un groupe privé
GROUP_ID=$(curl -X POST $BASE_URL/groups \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Projet Secret",
    "description": "Groupe pour le projet confidentiel",
    "type": "private"
  }' | jq -r '.data._id')

# 2. Inviter des membres (nécessite leurs IDs)
curl -X POST $BASE_URL/groups/$GROUP_ID/members \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "60d5ec49f1b2c8b1f8c7e8a5"
  }'

# 3. Nommer un administrateur
curl -X POST $BASE_URL/groups/$GROUP_ID/administrators \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "60d5ec49f1b2c8b1f8c7e8a5"
  }'

# 4. Créer un événement dans le groupe
curl -X POST $BASE_URL/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Réunion de projet\",
    \"description\": \"Discussion sur l'avancement\",
    \"startDate\": \"2026-06-25T14:00:00.000Z\",
    \"endDate\": \"2026-06-25T16:00:00.000Z\",
    \"location\": \"Salle de réunion B\",
    \"group\": \"$GROUP_ID\",
    \"isPrivate\": true
  }"
```

## 🧪 Tests de validation

### Test de validation email invalide

```bash
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "email-invalide",
    "password": "password123",
    "dateOfBirth": "1990-01-01"
  }'
# Devrait retourner une erreur de validation
```

### Test de mot de passe trop court

```bash
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "123",
    "dateOfBirth": "1990-01-01"
  }'
# Devrait retourner une erreur (min 6 caractères)
```

### Test de date d'événement invalide

```bash
curl -X POST $BASE_URL/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Événement test",
    "description": "Test",
    "startDate": "2026-07-20T19:00:00.000Z",
    "endDate": "2026-07-20T18:00:00.000Z",
    "location": "Paris"
  }'
# Devrait retourner une erreur (endDate avant startDate)
```

## 📌 Notes

- Remplacez `$TOKEN` par votre vrai token JWT après connexion
- Remplacez les IDs (ex: `60d5ec49f1b2c8b1f8c7e8a1`) par les vrais IDs de votre base de données
- Les dates doivent être au format ISO 8601 (ex: `2026-07-20T19:00:00.000Z`)
- Toutes les routes nécessitent l'authentification sauf `/auth/register` et `/auth/login`
