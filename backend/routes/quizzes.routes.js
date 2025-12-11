import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Obtener todos los quizzes activos
router.get('/', async (req, res) => {
  try {
    const [quizzes] = await pool.query(
      `SELECT
        id,
        titulo,
        descripcion,
        duracion_minutos,
        nivel_dificultad,
        categoria,
        imagen_url,
        veces_jugado,
        fecha_creacion
      FROM quizzes
      WHERE activo = 1
      ORDER BY fecha_creacion DESC`
    );

    res.json(quizzes);

  } catch (error) {
    console.error('Error al obtener quizzes:', error);
    res.status(500).json({ error: 'Error al obtener quizzes' });
  }
});

// Obtener un quiz específico con sus preguntas y respuestas
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener información del quiz
    const [quizzes] = await pool.query(
      'SELECT * FROM quizzes WHERE id = ? AND activo = 1',
      [id]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'Quiz no encontrado' });
    }

    const quiz = quizzes[0];

    // Obtener preguntas del quiz
    const [preguntas] = await pool.query(
      'SELECT id, texto_pregunta, puntos, orden, tiempo_limite_segundos FROM preguntas WHERE quiz_id = ? AND activo = 1 ORDER BY orden',
      [id]
    );

    // Obtener respuestas para cada pregunta
    for (let pregunta of preguntas) {
      const [respuestas] = await pool.query(
        'SELECT id, texto_respuesta, orden FROM respuestas WHERE pregunta_id = ? AND activo = 1 ORDER BY orden',
        [pregunta.id]
      );
      pregunta.respuestas = respuestas;
    }

    quiz.preguntas = preguntas;

    res.json(quiz);

  } catch (error) {
    console.error('Error al obtener quiz:', error);
    res.status(500).json({ error: 'Error al obtener quiz' });
  }
});

// Verificar respuestas de un quiz
router.post('/:id/verificar', async (req, res) => {
  try {
    const { id } = req.params;
    const { respuestas } = req.body; // Array de { preguntaId, respuestaId }

    let puntajeTotal = 0;
    let respuestasCorrectas = 0;

    for (let respuesta of respuestas) {
      // Verificar si la respuesta es correcta
      const [resultado] = await pool.query(
        `SELECT r.es_correcta, p.puntos
         FROM respuestas r
         INNER JOIN preguntas p ON r.pregunta_id = p.id
         WHERE r.id = ? AND p.id = ?`,
        [respuesta.respuestaId, respuesta.preguntaId]
      );

      if (resultado.length > 0 && resultado[0].es_correcta) {
        puntajeTotal += resultado[0].puntos;
        respuestasCorrectas++;
      }
    }

    // Calcular puntaje máximo posible
    const [puntajeMaximo] = await pool.query(
      'SELECT SUM(puntos) as total FROM preguntas WHERE quiz_id = ?',
      [id]
    );

    res.json({
      puntajeObtenido: puntajeTotal,
      puntajeMaximo: puntajeMaximo[0].total,
      respuestasCorrectas: respuestasCorrectas,
      totalPreguntas: respuestas.length
    });

  } catch (error) {
    console.error('Error al verificar respuestas:', error);
    res.status(500).json({ error: 'Error al verificar respuestas' });
  }
});

// Crear nuevo quiz
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, duracion_minutos, nivel_dificultad, categoria } = req.body;

    const [result] = await pool.query(
      `INSERT INTO quizzes (titulo, descripcion, duracion_minutos, nivel_dificultad, categoria, activo, fecha_creacion)
        VALUES (?, ?, ?, ?, ?, 1, NOW())`,
      [titulo, descripcion, duracion_minutos || 5, nivel_dificultad || 'medio', categoria || 'General']
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Quiz creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear quiz:', error);
    res.status(500).json({ error: 'Error al crear quiz' });
  }
});

// Actualizar quiz
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, duracion_minutos, nivel_dificultad, categoria, activo } = req.body;

    await pool.query(
      `UPDATE quizzes 
        SET titulo = ?, descripcion = ?, duracion_minutos = ?, nivel_dificultad = ?, categoria = ?, activo = ?
        WHERE id = ?`,
      [titulo, descripcion, duracion_minutos, nivel_dificultad, categoria, activo, id]
    );

    res.json({ message: 'Quiz actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar quiz:', error);
    res.status(500).json({ error: 'Error al actualizar quiz' });
  }
});

// Eliminar quiz
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM quizzes WHERE id = ?', [id]);
    res.json({ message: 'Quiz eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar quiz:', error);
    res.status(500).json({ error: 'Error al eliminar quiz' });
  }
});

// Crear pregunta
router.post('/:id/preguntas', async (req, res) => {
  try {
    const { id } = req.params;
    const { texto_pregunta, puntos, orden, tiempo_limite_segundos } = req.body;

    const [result] = await pool.query(
      `INSERT INTO preguntas (quiz_id, texto_pregunta, puntos, orden, tiempo_limite_segundos, activo)
        VALUES (?, ?, ?, ?, ?, 1)`,
      [id, texto_pregunta, puntos || 10, orden, tiempo_limite_segundos || 30]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Pregunta creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear pregunta:', error);
    res.status(500).json({ error: 'Error al crear pregunta' });
  }
});

// Crear respuesta
router.post('/preguntas/:preguntaId/respuestas', async (req, res) => {
  try {
    const { preguntaId } = req.params;
    const { texto_respuesta, es_correcta, orden } = req.body;

    const [result] = await pool.query(
      `INSERT INTO respuestas (pregunta_id, texto_respuesta, es_correcta, orden, activo)
        VALUES (?, ?, ?, ?, 1)`,
      [preguntaId, texto_respuesta, es_correcta ? 1 : 0, orden]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Respuesta creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear respuesta:', error);
    res.status(500).json({ error: 'Error al crear respuesta' });
  }
});

export default router;