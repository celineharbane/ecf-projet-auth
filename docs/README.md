# 🛒 TrouvTout - Plateforme de Petites Annonces

**Projet ECF - Développement Web Back-end**

TrouvTout est une plateforme de petites annonces entre particuliers, développée avec Node.js, Express et Supabase. L'application utilise une architecture MVC robuste et offre toutes les fonctionnalités essentielles d'un site de petites annonces moderne.

## 🚀 Fonctionnalités

### ✅ Authentification & Utilisateurs
- Inscription et connexion sécurisées
- Profils utilisateur avec informations publiques/privées
- Gestion des mots de passe avec hachage bcrypt
- Tokens JWT pour l'authentification
- Système de favoris personnalisé

### 📝 Gestion des Annonces
- CRUD complet des annonces
- Upload d'images multiples (jusqu'à 10 par annonce)
- Système de catégories
- Recherche et filtres avancés
- Géolocalisation par localité

### 🔍 Fonctionnalités Avancées
- Recherche textuelle avec PostgreSQL
- Pagination intelligente
- Statistiques utilisateur et plateforme
- API REST complète et documentée
- Sécurité renforcée avec validation des données

## 🏗️ Architecture Technique

### Stack Technologique
- **Backend**: Node.js 18+ avec Express.js
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: JWT (JSON Web Tokens)
- **Stockage**: Supabase Storage pour les images
- **Sécurité**: bcryptjs, helmet, CORS, rate limiting
- **Validation**: Joi pour la validation des données

### Architecture MVC
```
📁 trouvtout/
├── 📄 app.js                 # Point d'entrée
├── 📁 config/               # Configuration
│   └── database.js          # Connexion Supabase
├── 📁 models/               # Modèles de données
│   ├── User.js
│   ├── Annonce.js
│   ├── Category.js
│   ├── Favoris.js
│   └── Image.js
├── 📁 controllers/          # Logique métier
│   ├── authController.js
│   ├── userController.js
│   ├── annonceController.js
│   └── categoryController.js
├── 📁 routes/               # Routes API
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── annonceRoutes.js
│   └── categoryRoutes.js
├── 📁 middleware/           # Middlewares
│   ├── auth.js
│   └── validation.js
└── 📁 utils/               # Utilitaires
    └── helpers.js
```

## 📊 Schéma de Base de Données

### Tables Principales

#### `users` - Utilisateurs
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique (PK) |
| email | VARCHAR(255) | Email unique |
| password | VARCHAR(255) | Mot de passe hashé |
| pseudo | VARCHAR(50) | Nom d'affichage unique |
| prenom | VARCHAR(50) | Prénom (optionnel) |
| nom | VARCHAR(50) | Nom (optionnel) |
| telephone | VARCHAR(20) | Téléphone (optionnel) |
| localite | VARCHAR(100) | Ville/région (optionnel) |
| avatar_url | VARCHAR(500) | URL photo de profil |
| created_at | TIMESTAMP | Date de création |
| last_active | TIMESTAMP | Dernière activité |

#### `annonces` - Annonces
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique (PK) |
| titre | VARCHAR(100) | Titre de l'annonce |
| description | TEXT | Description détaillée |
| prix | DECIMAL(10,2) | Prix en euros |
| localite | VARCHAR(100) | Localisation |
| user_id | UUID | Propriétaire (FK → users.id) |
| category_id | INTEGER | Catégorie (FK → categories.id) |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Dernière modification |

#### `categories` - Catégories
| Champ | Type | Description |
|-------|------|-------------|
| id | SERIAL | Identifiant unique (PK) |
| nom | VARCHAR(100) | Nom de la catégorie |
| created_at | TIMESTAMP | Date de création |

#### `favoris` - Favoris
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique (PK) |
| user_id | UUID | Utilisateur (FK → users.id) |
| annonce_id | UUID | Annonce (FK → annonces.id) |
| created_at | TIMESTAMP | Date d'ajout |

#### `images` - Images
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique (PK) |
| annonce_id | UUID | Annonce (FK → annonces.id) |
| url | VARCHAR(500) | URL de l'image |
| uploaded_at | TIMESTAMP | Date d'upload |

## 🔧 Installation et Configuration

### Prérequis
- Node.js 18+ et npm
- Compte Supabase
- Git

### 1. Cloner et installer
```bash
git clone <repository_url>
cd trouvtout
npm install
```

### 2. Configuration environnement
```bash
cp .env.example .env
```

Remplir le fichier `.env`:
```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# JWT
JWT_SECRET=your_super_secret_key_32_chars_min
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Storage
SUPABASE_STORAGE_BUCKET=annonces-images
```

### 3. Configuration Supabase

#### a) Créer le projet
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et les clés dans le dashboard

#### b) Créer les tables
1. Aller dans "SQL Editor"
2. Exécuter le script de création des tables :

```sql
-- Création des tables (voir script complet dans le projet)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    pseudo VARCHAR(50) NOT NULL UNIQUE,
    -- ... autres champs
);

-- ... autres tables
```

#### c) Configurer le stockage
1. Aller dans "Storage"
2. Créer un bucket "annonces-images"
3. Configurer comme public pour la lecture

### 4. Démarrage
```bash
# Développement
npm run dev

# Production
npm start
```

L'API sera disponible sur `http://localhost:3000/api`

## 📡 Documentation API

### Authentification

#### POST `/api/auth/register`
Inscription d'un nouvel utilisateur
```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "pseudo": "monpseudo",
  "prenom": "Jean",
  "nom": "Dupont",
  "telephone": "01 23 45 67 89",
  "localite": "Paris"
}
```

#### POST `/api/auth/login`
Connexion utilisateur
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

### Annonces

#### GET `/api/annonces`
Récupérer toutes les annonces avec filtres
- **Paramètres**: `category`, `localite`, `search`, `min_prix`, `max_prix`, `page`, `limit`

#### GET `/api/annonces/:id`
Récupérer une annonce spécifique

#### POST `/api/annonces`
Créer une nouvelle annonce (authentifié)
```json
{
  "titre": "iPhone 13 Pro",
  "description": "En excellent état, acheté il y a 6 mois",
  "prix": 800.00,
  "localite": "Paris 15ème",
  "category_id": 3
}
```

#### PUT `/api/annonces/:id`
Modifier une annonce (propriétaire seulement)

#### DELETE `/api/annonces/:id`
Supprimer une annonce (propriétaire seulement)

### Upload d'images

#### POST `/api/annonces/:id/images`
Uploader des images (max 10, 5MB chacune)
- **Content-Type**: `multipart/form-data`
- **Champ**: `images[]`

### Utilisateurs

#### GET `/api/users/profile/:id`
Profil public d'un utilisateur

#### PUT `/api/users/profile`
Modifier son profil (authentifié)

#### GET `/api/users/favoris`
Récupérer ses favoris (authentifié)

#### POST `/api/users/favoris/:annonceId`
Ajouter aux favoris (authentifié)

### Catégories

#### GET `/api/categories`
Liste des catégories avec compteurs optionnels

#### GET `/api/categories/:id/annonces`
Annonces d'une catégorie

## 🔒 Sécurité

### Mesures Implémentées
- **Mots de passe** : Hachage bcrypt avec salt de 12 rounds
- **JWT** : Tokens sécurisés avec expiration configurable
- **Validation** : Joi pour valider toutes les entrées utilisateur
- **Rate Limiting** : 100 requêtes par IP toutes les 15 minutes
- **CORS** : Configuration pour domaines autorisés
- **Helmet** : Protection des en-têtes HTTP
- **RLS** : Row Level Security sur Supabase
- **Upload** : Validation format et taille des fichiers

### Headers de Sécurité
```javascript
// Authentification requise
Authorization: Bearer <jwt_token>

// Upload de fichiers
Content-Type: multipart/form-data
```

## 🧪 Tests et Validation

### Tests de Base
```bash
# Santé de l'API
curl http://localhost:3000/api/health

# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","pseudo":"testuser"}'

# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Annonces
curl http://localhost:3000/api/annonces?limit=5
```

### Validation des Données
- **Email** : Format valide et unique
- **Pseudo** : 2-50 caractères, alphanumériques uniquement
- **Mot de passe** : Minimum 6 caractères
- **Prix** : Nombre positif, max 999,999.99€
- **Images** : JPEG/PNG/WebP/GIF, max 5MB

## 📈 Performance et Optimisation

### Base de Données
- Index sur colonnes fréquemment utilisées
- Recherche full-text PostgreSQL
- Relations optimisées avec foreign keys
- Pagination pour limiter les résultats

### API
- Middleware de compression
- Cache des catégories
- Lazy loading des images
- Rate limiting intelligent

## 🚢 Déploiement Production

### Variables d'Environnement
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_production_secret_32_chars_min
SUPABASE_URL=your_production_supabase_url
# ... autres variables
```

### Recommandations
- Utiliser PM2 pour la gestion des processus
- Configurer nginx comme reverse proxy
- Activer HTTPS avec Let's Encrypt
- Monitorer avec des logs centralisés
- Sauvegardes automatiques Supabase

### Docker (Optionnel)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Debugging et Logs

### Logs Structurés
```javascript
// Chaque requête est loggée
2025-06-30T10:00:00.000Z - GET /api/annonces

// Erreurs détaillées en développement
Erreur création annonce: { code: '23503', message: '...' }
```

### Codes d'Erreur API
- `400` : Erreur de validation
- `401` : Authentification requise
- `403` : Accès refusé
- `404` : Ressource non trouvée
- `429` : Rate limit dépassé
- `500` : Erreur serveur

## 🤝 Contribution

### Structure des Commits
```
feat: ajouter système de notifications
fix: corriger l'upload d'images
docs: mettre à jour la documentation API
style: formater le code avec prettier
```

### Standards de Code
- ESLint pour la qualité du code
- Prettier pour le formatage
- JSDoc pour la documentation
- Tests unitaires avec Jest (à implémenter)

## 📚 Documentation Supplémentaire

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

## 📄 Licence

Ce projet est développé dans le cadre d'une épreuve ECF pour la formation développement web back-end.

---

## 📞 Support

Pour toute question ou problème :

1. **Vérifier les logs** dans la console
2. **Tester les endpoints** avec curl ou Postman  
3. **Consulter la documentation** Supabase
4. **Vérifier la configuration** des variables d'environnement

**Développé avec ❤️ pour l'épreuve ECF - Développement Web Back-end**