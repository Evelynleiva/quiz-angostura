import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Crear una nueva sesión de quiz
router.post('/iniciar', async (req, res) => {
  try {
    const { usuarioId, quizId, codigoQrId } = req.body;

    // Validar datos requeridos
    if (!usuarioId || !quizId) {
      return res.status(400).json({ error: 'Usuario y Quiz son requeridos' });
    }

    // Obtener puntaje máximo del quiz
    const [puntajeMaximo] = await pool.query(
      'SELECT SUM(puntaje) as total FROM preguntas WHERE quiz_id = ?',
      [quizId]
    );

    // Crear la sesión
    const [result] = await pool.query(
      `INSERT INTO sesiones_quiz 
       (usuario_id, quiz_id, codigo_qr_id, puntaje_obtenido, puntaje_maximo, tiempo_completado, fecha_hora_inicio, completado) 
       VALUES (?, ?, ?, 0, ?, 0, NOW(), 0)`,
      [usuarioId, quizId, codigoQrId || null, puntajeMaximo[0].total || 0]
    );

    res.status(201).json({
      message: 'Sesión iniciada',
      sesionId: result.insertId
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Finalizar una sesión y guardar resultados
router.post('/finalizar/:sesionId', async (req, res) => {
  try {
    const { sesionId } = req.params;
    const { puntajeObtenido, tiempoCompletado } = req.body;

    // Actualizar la sesión
    await pool.query(
      `UPDATE sesiones_quiz 
       SET puntaje_obtenido = ?, 
           tiempo_completado = ?, 
           fecha_hora_fin = NOW(), 
           completado = 1 
       WHERE id = ?`,
      [puntajeObtenido, tiempoCompletado, sesionId]
    );

    // Actualizar contador de quizzes completados del usuario
    await pool.query(
      `UPDATE usuarios u
       INNER JOIN sesiones_quiz sq ON u.id = sq.usuario_id
       SET u.total_quizzes_completados = u.total_quizzes_completados + 1
       WHERE sq.id = ?`,
      [sesionId]
    );

    // Obtener la sesión actualizada con datos del usuario
    const [sesion] = await pool.query(
      `SELECT 
        sq.*,
        u.nickname,
        q.titulo as quiz_titulo
       FROM sesiones_quiz sq
       INNER JOIN usuarios u ON sq.usuario_id = u.id
       INNER JOIN quizzes q ON sq.quiz_id = q.id
       WHERE sq.id = ?`,
      [sesionId]
    );

    res.json({
      message: 'Sesión finalizada exitosamente',
      sesion: sesion[0]
    });

  } catch (error) {
    console.error('Error al finalizar sesión:', error);
    res.status(500).json({ error: 'Error al finalizar sesión' });
  }
});

// Obtener historial de sesiones de un usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const [sesiones] = await pool.query(
      `SELECT 
        sq.id,
        sq.puntaje_obtenido,
        sq.puntaje_maximo,
        sq.tiempo_completado,
        sq.fecha_hora_inicio,
        sq.fecha_hora_fin,
        sq.completado,
        q.titulo as quiz_titulo
       FROM sesiones_quiz sq
       INNER JOIN quizzes q ON sq.quiz_id = q.id
       WHERE sq.usuario_id = ?
       ORDER BY sq.fecha_hora_inicio DESC`,
      [usuarioId]
    );

    res.json(sesiones);

  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    res.status(500).json({ error: 'Error al obtener sesiones' });
  }
});

// Obtener una sesión específica
router.get('/:sesionId', async (req, res) => {
  try {
    const { sesionId } = req.params;

    const [sesiones] = await pool.query(
      `SELECT 
        sq.*,
        u.nickname,
        q.titulo as quiz_titulo,
        q.descripcion as quiz_descripcion
       FROM sesiones_quiz sq
       INNER JOIN usuarios u ON sq.usuario_id = u.id
       INNER JOIN quizzes q ON sq.quiz_id = q.id
       WHERE sq.id = ?`,
      [sesionId]
    );

    if (sesiones.length === 0) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    res.json(sesiones[0]);

  } catch (error) {
    console.error('Error al obtener sesión:', error);
    res.status(500).json({ error: 'Error al obtener sesión' });
  }
});

export default router;