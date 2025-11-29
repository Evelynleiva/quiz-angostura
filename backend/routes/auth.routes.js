import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// Login de administrador
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('📧 Login attempt:', email);
    console.log('🔑 Password received:', password ? 'Yes' : 'No');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar administrador
    const [admins] = await pool.query(
      'SELECT * FROM administradores WHERE email = ? AND is_active = 1',
      [email]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const admin = admins[0];

    console.log('🔍 Admin found:', admin.email);
    console.log('🔐 Hash from DB:', admin.password_hash);

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Middleware para verificar token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export default router;