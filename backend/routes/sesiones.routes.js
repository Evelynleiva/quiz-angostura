import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Crear una nueva sesión de quiz
router.post('/iniciar', async (req, res) => {
  try {
    const { usuarioId, quizId, codigoQrId } = req.body;

    if (!usuarioId || !quizId) {
      return res.status(400).json({ error: 'Usuario y Quiz son requeridos' });
    }

    const [result] = await pool.query(
      `INSERT INTO sesiones_quiz 
       (usuario_id, quiz_id, puntaje_total, respuestas_correctas, respuestas_incorrectas, fecha_inicio, completado) 
       VALUES (?, ?, 0, 0, 0, NOW(), 0)`,
      [usuarioId, quizId]
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

    // Obtener información de la sesión
    const [sesionInfo] = await pool.query(
      'SELECT quiz_id FROM sesiones_quiz WHERE id = ?',
      [sesionId]
    );

    if (sesionInfo.length === 0) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    const quizId = sesionInfo[0].quiz_id;

    // Obtener total de preguntas
    const [totalPreguntas] = await pool.query(
      'SELECT COUNT(*) as total FROM preguntas WHERE quiz_id = ?',
      [quizId]
    );

    // Calcular respuestas correctas e incorrectas
    const [puntajePorPregunta] = await pool.query(
      'SELECT puntos FROM preguntas WHERE quiz_id = ? LIMIT 1',
      [quizId]
    );

    const puntosPorPregunta = puntajePorPregunta[0]?.puntos || 10;
    const respuestasCorrectas = Math.floor(puntajeObtenido / puntosPorPregunta);
    const respuestasIncorrectas = totalPreguntas[0].total - respuestasCorrectas;

    // Actualizar la sesión
    await pool.query(
      `UPDATE sesiones_quiz 
      SET puntaje_total = ?, 
          respuestas_correctas = ?,
          respuestas_incorrectas = ?,
          tiempo_total_segundos = ?, 
          fecha_fin = NOW(), 
          completado = 1 
      WHERE id = ?`,
      [puntajeObtenido, respuestasCorrectas, respuestasIncorrectas, tiempoCompletado, sesionId]
    );

    // ✅ NUEVO: Incrementar contador veces_jugado
    await pool.query(
      'UPDATE quizzes SET veces_jugado = veces_jugado + 1 WHERE id = ?',
      [quizId]
    );

    // Obtener información del usuario y quiz
    const [sesion] = await pool.query(
      `SELECT 
        sq.*,
        u.nombre as nickname,
        q.titulo as quiz_titulo
        FROM sesiones_quiz sq
        INNER JOIN usuarios u ON sq.usuario_id = u.id
        INNER JOIN quizzes q ON sq.quiz_id = q.id
        WHERE sq.id = ?`,
      [sesionId]
    );

    // Insertar en ranking
    await pool.query(
      `INSERT INTO ranking (sesion_id, usuario_id, quiz_id, puntaje, tiempo_segundos, fecha_registro)
        VALUES (?, ?, ?, ?, ?, NOW())`,
      [sesionId, sesion[0].usuario_id, sesion[0].quiz_id, puntajeObtenido, tiempoCompletado]
    );

    // Actualizar posiciones del ranking
    await pool.query('CALL sp_actualizar_posiciones_ranking(?)', [sesion[0].quiz_id]);

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
        sq.puntaje_total,
        sq.tiempo_total_segundos,
        sq.respuestas_correctas,
        sq.respuestas_incorrectas,
        sq.fecha_inicio,
        sq.fecha_fin,
        sq.completado,
        q.titulo as quiz_titulo
       FROM sesiones_quiz sq
       INNER JOIN quizzes q ON sq.quiz_id = q.id
       WHERE sq.usuario_id = ?
       ORDER BY sq.fecha_inicio DESC`,
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
        u.nombre as nickname,
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