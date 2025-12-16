import express from 'express';
import QRCode from 'qrcode';
import pool from '../config/database.js';

const router = express.Router();

// Obtener todos los códigos QR
router.get('/', async (req, res) => {
  try {
    const [codigos] = await pool.query(
      `SELECT 
        cq.*,
        q.titulo as quiz_titulo
        FROM codigos_qr cq
        LEFT JOIN quizzes q ON cq.quiz_id = q.id
        ORDER BY cq.id DESC`
    );

    res.json(codigos);
  } catch (error) {
    console.error('Error al obtener códigos QR:', error);
    res.status(500).json({ error: 'Error al obtener códigos QR' });
  }
});

// Generar nuevo código QR
router.post('/generar', async (req, res) => {
  console.log('=== BACKEND: Generando QR ===');
  console.log('1. req.body:', req.body);
  
  try {
    const { quizId, descripcion, ubicacion } = req.body;

    console.log('2. quizId extraído:', quizId);
    console.log('3. tipo de quizId:', typeof quizId);

    // Validación mejorada
    if (!quizId) {
      console.error('4. ERROR: quizId no proporcionado');
      return res.status(400).json({ error: 'Quiz ID es requerido' });
    }

    // Verificar que el quiz existe
    const [quiz] = await pool.query('SELECT id FROM quizzes WHERE id = ?', [quizId]);
    
    if (quiz.length === 0) {
      return res.status(404).json({ error: 'Quiz no encontrado' });
    }

    // Generar código único
    const codigo = `QUIZ-${quizId}-${Date.now()}`;
    
    // URL de destino - CORREGIDA PARA HOTSPOT
    const urlDestino = `http://10.215.93.231:5173/quiz/${quizId}/registro`;

    console.log('5. URL generada:', urlDestino);

    // Generar imagen QR en base64
    const qrImage = await QRCode.toDataURL(urlDestino, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 1,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Insertar en base de datos
    const [result] = await pool.query(
      `INSERT INTO codigos_qr 
        (quiz_id, codigo, url_qr, descripcion, ubicacion, activo, veces_escaneado, fecha_creacion) 
        VALUES (?, ?, ?, ?, ?, 1, 0, NOW())`,
      [quizId, codigo, urlDestino, descripcion || null, ubicacion || null]
    );

    console.log('6. QR guardado en BD con ID:', result.insertId);

    res.status(201).json({
      id: result.insertId,
      codigo,
      url: urlDestino,
      qrImage,
      descripcion,
      ubicacion
    });

  } catch (error) {
    console.error('Error al generar código QR:', error);
    res.status(500).json({ error: 'Error al generar código QR' });
  }
});

// Registrar escaneo de QR
router.post('/escanear/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;

    // Buscar código QR
    const [qr] = await pool.query(
      'SELECT * FROM codigos_qr WHERE codigo = ? AND activo = 1',
      [codigo]
    );

    if (qr.length === 0) {
      return res.status(404).json({ error: 'Código QR no encontrado o inactivo' });
    }

    // Incrementar contador
    await pool.query(
      'UPDATE codigos_qr SET veces_escaneado = veces_escaneado + 1, ultimo_escaneo = NOW() WHERE id = ?',
      [qr[0].id]
    );

    res.json({
      quizId: qr[0].quiz_id,
      url: qr[0].url_qr
    });

  } catch (error) {
    console.error('Error al registrar escaneo:', error);
    res.status(500).json({ error: 'Error al registrar escaneo' });
  }
});

// Activar código QR
router.patch('/:id/activar', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE codigos_qr SET activo = 1 WHERE id = ?',
      [id]
    );

    res.json({ message: 'Código QR activado' });

  } catch (error) {
    console.error('Error al activar código QR:', error);
    res.status(500).json({ error: 'Error al activar código QR' });
  }
});

// Desactivar código QR
router.patch('/:id/desactivar', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE codigos_qr SET activo = 0 WHERE id = ?',
      [id]
    );

    res.json({ message: 'Código QR desactivado' });

  } catch (error) {
    console.error('Error al desactivar código QR:', error);
    res.status(500).json({ error: 'Error al desactivar código QR' });
  }
});

// Eliminar código QR
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM codigos_qr WHERE id = ?', [id]);

    res.json({ message: 'Código QR eliminado' });

  } catch (error) {
    console.error('Error al eliminar código QR:', error);
    res.status(500).json({ error: 'Error al eliminar código QR' });
  }
});

export default router;