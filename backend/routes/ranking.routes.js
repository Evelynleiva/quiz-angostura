import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Obtener el ranking global (top puntuaciones)
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit || 10; // Por defecto top 10

    const [ranking] = await pool.query(
      `SELECT
        r.posicion,
        u.nombre,
        u.email,
        u.ciudad,
        r.puntaje,
        r.tiempo_segundos,
        q.titulo as quiz_titulo,
        r.fecha_registro
      FROM ranking r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      INNER JOIN quizzes q ON r.quiz_id = q.id
      ORDER BY r.puntaje DESC, r.tiempo_segundos ASC
      LIMIT ?`,
      [parseInt(limit)]
    );

    res.json(ranking);

  } catch (error) {
    console.error('Error al obtener ranking:', error);
    res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

// Obtener ranking por quiz específico
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    const limit = req.query.limit || 10;

    const [ranking] = await pool.query(
      `SELECT
        r.posicion,
        u.nombre,
        u.email,
        r.puntaje,
        r.tiempo_segundos,
        r.fecha_registro
      FROM ranking r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.quiz_id = ?
      ORDER BY r.posicion ASC
      LIMIT ?`,
      [quizId, parseInt(limit)]
    );

    res.json(ranking);

  } catch (error) {
    console.error('Error al obtener ranking por quiz:', error);
    res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

// Obtener la posición de un usuario en el ranking
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const [resultado] = await pool.query(
      `SELECT
        r.posicion,
        r.puntaje,
        r.tiempo_segundos,
        r.fecha_registro,
        q.titulo as quiz_titulo
      FROM ranking r
      INNER JOIN quizzes q ON r.quiz_id = q.id
      WHERE r.usuario_id = ?
      ORDER BY r.puntaje DESC, r.tiempo_segundos ASC
      LIMIT 1`,
      [usuarioId]
    );

    if (resultado.length === 0) {
      return res.status(404).json({ error: 'El usuario no tiene ranking' });
    }

    res.json(resultado[0]);

  } catch (error) {
    console.error('Error al obtener posición del usuario:', error);
    res.status(500).json({ error: 'Error al obtener posición' });
  }
});

export default router;