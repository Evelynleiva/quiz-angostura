import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Crear un nuevo usuario (visitante del museo)
router.post('/registro', async (req, res) => {
  try {
    const { nickname } = req.body;

    // Validar que venga el nickname
    if (!nickname || nickname.trim() === '') {
      return res.status(400).json({ error: 'El nickname es requerido' });
    }

    // Verificar si el nickname ya existe
    const [existingUser] = await pool.query(
      'SELECT id FROM usuarios WHERE nickname = ?',
      [nickname]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Este nickname ya está en uso' });
    }

    // Insertar nuevo usuario
    const [result] = await pool.query(
      'INSERT INTO usuarios (nickname, fecha_registro, total_quizzes_completados) VALUES (?, NOW(), 0)',
      [nickname]
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: result.insertId,
        nickname: nickname
      }
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Obtener un usuario por nickname
router.get('/buscar/:nickname', async (req, res) => {
  try {
    const { nickname } = req.params;

    const [usuarios] = await pool.query(
      'SELECT id, nickname, fecha_registro, total_quizzes_completados FROM usuarios WHERE nickname = ?',
      [nickname]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuarios[0]);

  } catch (error) {
    console.error('Error al buscar usuario:', error);
    res.status(500).json({ error: 'Error al buscar usuario' });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      'SELECT id, nickname, fecha_registro, total_quizzes_completados FROM usuarios ORDER BY fecha_registro DESC'
    );

    res.json(usuarios);

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

export default router;