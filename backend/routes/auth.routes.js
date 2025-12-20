import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// Middleware para verificar token de admin
export const verificarAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Login de administrador
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('📧 Intento de login:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar administrador
    const [admins] = await pool.query(
      'SELECT * FROM administradores WHERE email = ? AND activo = 1',
      [email]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const admin = admins[0];
    console.log('👤 Admin encontrado:', admin.email);

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, rol: admin.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    console.log('✅ Login exitoso para:', admin.email);

    res.json({
      token,
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        email: admin.email,
        rol: admin.rol
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Verificar token
router.get('/verificar', verificarAdmin, (req, res) => {
  res.json({ 
    valido: true,
    admin: req.admin
  });
});

// Obtener estadísticas del dashboard
router.get('/admin/estadisticas', verificarAdmin, async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas...');

    // Total de quizzes activos
    const [quizzes] = await pool.query(
      'SELECT COUNT(*) as total FROM quizzes WHERE activo = 1'
    );

    // Total de usuarios registrados
    const [usuarios] = await pool.query(
      'SELECT COUNT(*) as total FROM usuarios'
    );

    // Total de sesiones completadas
    const [sesiones] = await pool.query(
      'SELECT COUNT(*) as total FROM sesiones_quiz WHERE completada = 1'
    );

    const stats = {
      totalQuizzes: quizzes[0].total,
      totalUsuarios: usuarios[0].total,
      sesionesCompletadas: sesiones[0].total
    };

    console.log('✅ Estadísticas:', stats);

    res.json(stats);
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;