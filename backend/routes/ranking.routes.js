import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Obtener el ranking global (top puntuaciones)
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit || 10; // Por defecto top 10

    const [ranking] = await pool.query(
      `SELECT 
        u.id,
        u.nickname,
        sq.puntaje_obtenido,
        sq.fecha_hora_fin as fecha,
        q.titulo as quiz_titulo
      FROM sesiones_quiz sq
      INNER JOIN usuarios u ON sq.usuario_id = u.id
      INNER JOIN quizzes q ON sq.quiz_id = q.id
      WHERE sq.completado = 1
      ORDER BY sq.puntaje_obtenido DESC, sq.tiempo_completado ASC
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
        u.id,
        u.nickname,
        sq.puntaje_obtenido,
        sq.fecha_hora_fin as fecha,
        sq.tiempo_completado
      FROM sesiones_quiz sq
      INNER JOIN usuarios u ON sq.usuario_id = u.id
      WHERE sq.quiz_id = ? AND sq.completado = 1
      ORDER BY sq.puntaje_obtenido DESC, sq.tiempo_completado ASC
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
        sq.id,
        sq.puntaje_obtenido,
        sq.fecha_hora_fin,
        q.titulo as quiz_titulo,
        (
          SELECT COUNT(*) + 1
          FROM sesiones_quiz sq2
          WHERE sq2.completado = 1 
          AND sq2.puntaje_obtenido > sq.puntaje_obtenido
        ) as posicion
      FROM sesiones_quiz sq
      INNER JOIN quizzes q ON sq.quiz_id = q.id
      WHERE sq.usuario_id = ? AND sq.completado = 1
      ORDER BY sq.puntaje_obtenido DESC
      LIMIT 1`,
      [usuarioId]
    );

    if (resultado.length === 0) {
      return res.status(404).json({ error: 'El usuario no tiene sesiones completadas' });
    }

    res.json(resultado[0]);

  } catch (error) {
    console.error('Error al obtener posición del usuario:', error);
    res.status(500).json({ error: 'Error al obtener posición' });
  }
});

export default router;