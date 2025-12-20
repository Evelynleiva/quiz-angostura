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
// BODY PARSER (ANTES DE TODO)
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// CORS - CONFIGURACIÓN DEFINITIVA
// ============================================
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://192.168.100.10:5173',
      'http://10.215.93.231:5173',
      'http://10.66.49.132:5173',
      'http://10.66.49.223:5173',
    ];
    
    // Permitir cualquier IP local 192.168.x.x o 10.x.x.x
    const isLocalIP = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}):\d+$/.test(origin);
    
    if (allowedOrigins.includes(origin) || isLocalIP) {
      callback(null, true);
    } else {
      console.warn('⚠️ CORS bloqueado para:', origin);
      callback(null, true); // Permitir de todas formas en desarrollo
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Headers adicionales para asegurar CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// ============================================
// MIDDLEWARES DE SEGURIDAD
// ============================================

// HPP - Protección contra HTTP Parameter Pollution
app.use(hpp());

// Helmet para headers de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Desactivar para desarrollo
}));

// ============================================
// RATE LIMITING
// ============================================

// General limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: 'Demasiadas solicitudes, intente más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Demasiados intentos de login' },
  standardHeaders: true,
  legacyHeaders: false,
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
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    env: process.env.NODE_ENV || 'development'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Quiz Museo Angostura del Biobío',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      quizzes: '/api/quizzes',
      sesiones: '/api/sesiones',
      ranking: '/api/ranking',
      qr: '/api/qr'
    }
  });
});

// ============================================
// MANEJO DE ERRORES
// ============================================

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Error handler general
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: 'No permitido por CORS' });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🏛️  Servidor Quiz Museo Angostura        ║
║                                            ║
║  Puerto: ${PORT}                             ║
║  CORS: ✓ CONFIGURADO                       ║
║  Seguridad: ✓ ACTIVADA                     ║
║  Rate Limiting: ✓ ACTIVADO                 ║
║                                            ║
║  Endpoints:                                ║
║  • /api/auth                               ║
║  • /api/usuarios                           ║
║  • /api/quizzes                            ║
║  • /api/sesiones                           ║
║  • /api/ranking                            ║
║  • /api/qr                                 ║
╚════════════════════════════════════════════╝
  `);
  
  // Verificar conexión a BD
  pool.query('SELECT 1')
    .then(() => console.log('✅ Conexión a MySQL exitosa\n'))
    .catch(err => console.error('❌ Error MySQL:', err.message, '\n'));
});

export default app;