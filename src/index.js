import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/error.js';

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();

// Connexion à la base de données
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger en développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route de test
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API My Social Networks',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Routes API
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import groupRoutes from './routes/groups.js';
import discussionRoutes from './routes/discussions.js';
import albumRoutes from './routes/albums.js';
import pollRoutes from './routes/polls.js';
import ticketRoutes from './routes/tickets.js';
import shoppingRoutes from './routes/shopping.js';
import carpoolsRoutes from './routes/carpools.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/carpools', carpoolsRoutes);

// Middleware de gestion d'erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║    My Social Networks API                          ║
║                                                       ║
║    Serveur démarré sur le port ${PORT}                ║
║    Environnement: ${process.env.NODE_ENV || 'development'}              ║
║    Documentation: http://localhost:${PORT}/api-docs    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Gestion des erreurs non gérées
process.on('unhandledRejection', (err) => {
  console.error(' Erreur non gérée:', err);
  process.exit(1);
});

export default app;