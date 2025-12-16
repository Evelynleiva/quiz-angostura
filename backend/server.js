// backend/server.js - VERSIÓN ES MODULES CON SEGURIDAD

import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import pool from './config/database.js';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import quizzesRoutes from './routes/quizzes.routes.js';
import sesionesRoutes from './routes/sesiones.routes.js';
import rankingRoutes from './routes/ranking.routes.js';
import qrRoutes from './routes/qr.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARES DE SEGURIDAD
// ============================================

// Helmet para headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS - Configuración flexible para hotspot
app.use(cors({
  origin: function (origin, callback) {
    // Permitir cualquier origen en desarrollo
    callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Parameter pollution protection
app.use(hpp());

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// RATE LIMITING
// ============================================

// General limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intente más tarde' }
});

// Login limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Demasiados intentos de login' }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', loginLimiter);

// ============================================
// RUTAS
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/qr', qrRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// ============================================
// MANEJO DE ERRORES
// ============================================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: 'No permitido por CORS' });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  Servidor Quiz Museo Angostura             ║
║  Puerto: ${PORT}                             ║
║  Seguridad: ACTIVADA ✓                     ║
║  Rate Limiting: ACTIVADO ✓                 ║
╚════════════════════════════════════════════╝
  `);
  
  pool.query('SELECT 1')
    .then(() => console.log('✓ Conexión a MySQL exitosa'))
    .catch(err => console.error('✗ Error MySQL:', err.message));
});

export default app;