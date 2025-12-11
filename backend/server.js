import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Importar rutas
import usuariosRoutes from './routes/usuarios.routes.js';
import rankingRoutes from './routes/ranking.routes.js';
import quizzesRoutes from './routes/quizzes.routes.js';
import sesionesRoutes from './routes/sesiones.routes.js';
import authRoutes from './routes/auth.routes.js';
import qrRoutes from './routes/qr.routes.js';

// Cargar variables de entorno
dotenv.config();

// Crear app de Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🦊 API Museo Angostura del Biobío',
    status: 'running',
    version: '1.0.0'
  });
});

// Ruta para probar conexión a BD
app.get('/api/test-db', async (req, res) => {
  const isConnected = await testConnection();
  if (isConnected) {
    res.json({ message: 'Conexión a base de datos exitosa ✅' });
  } else {
    res.status(500).json({ message: 'Error al conectar con la base de datos ❌' });
  }
});

// Rutas de la API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('📊 Probando conexión a base de datos...\n');
  await testConnection();
  console.log('\n📋 Rutas disponibles:');
  console.log('   GET  /api/usuarios');
  console.log('   POST /api/usuarios/registro');
  console.log('   GET  /api/ranking');
  console.log('   GET  /api/quizzes');
  console.log('   GET  /api/sesiones/usuario/:usuarioId');
  console.log('   POST /api/sesiones/iniciar');
  console.log('   POST /api/sesiones/finalizar/:sesionId\n');
});