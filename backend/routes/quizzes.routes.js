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
        tiempo_limite, 
        idioma, 
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
      'SELECT id, texto_pregunta, tipo, puntaje, orden FROM preguntas WHERE quiz_id = ? ORDER BY orden',
      [id]
    );

    // Obtener respuestas para cada pregunta
    for (let pregunta of preguntas) {
      const [respuestas] = await pool.query(
        'SELECT id, texto_respuesta, orden FROM respuestas WHERE pregunta_id = ? ORDER BY orden',
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
        `SELECT r.es_correcta, p.puntaje 
         FROM respuestas r
         INNER JOIN preguntas p ON r.pregunta_id = p.id
         WHERE r.id = ? AND p.id = ?`,
        [respuesta.respuestaId, respuesta.preguntaId]
      );

      if (resultado.length > 0 && resultado[0].es_correcta) {
        puntajeTotal += resultado[0].puntaje;
        respuestasCorrectas++;
      }
    }

    // Calcular puntaje máximo posible
    const [puntajeMaximo] = await pool.query(
      'SELECT SUM(puntaje) as total FROM preguntas WHERE quiz_id = ?',
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

export default router;