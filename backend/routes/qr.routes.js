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

    console.log('5. Verificando si quiz existe...');
    // Verificar que el quiz existe
    const [quizzes] = await pool.query(
      'SELECT id, titulo FROM quizzes WHERE id = ?',
      [quizId]
    );

    console.log('6. Quizzes encontrados:', quizzes);

    if (quizzes.length === 0) {
      console.error('7. ERROR: Quiz no encontrado');
      return res.status(404).json({ error: 'Quiz no encontrado' });
    }

    console.log('8. Generando código único...');
    // Generar código único
    const codigo = `QUIZ-${quizId}-${Date.now()}`;
    
    console.log('9. Código generado:', codigo);
    
    // URL que se guardará en el QR
    const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/quiz/${quizId}/registro`;

    console.log('10. URL del QR:', url);
    console.log('11. Generando imagen QR...');

    // Generar imagen QR en base64 con manejo de errores
    let qrImage;
    try {
      qrImage = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0891B2',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      console.log('12. Imagen QR generada exitosamente');
    } catch (qrError) {
      console.error('13. ERROR al generar imagen QR:', qrError);
      return res.status(500).json({ 
        error: 'Error al generar la imagen del código QR',
        details: qrError.message 
      });
    }

    console.log('14. Guardando en base de datos...');
    // Guardar en base de datos (solo las columnas que existen)
    const [result] = await pool.query(
      `INSERT INTO codigos_qr (quiz_id, codigo, url_qr)
        VALUES (?, ?, ?)`,
      [quizId, codigo, url]
    );

    console.log('15. QR guardado con ID:', result.insertId);
    console.log('16. Enviando respuesta exitosa');

    res.status(201).json({
      id: result.insertId,
      codigo,
      url,
      qrImage,
      message: 'Código QR generado exitosamente'
    });

  } catch (error) {
    console.error('=== ERROR BACKEND ===');
    console.error('Error completo:', error);
    res.status(500).json({ 
      error: 'Error al generar código QR',
      details: error.message 
    });
  }
});

// Registrar escaneo de QR
router.post('/escanear/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;

    // Buscar código QR
    const [codigos] = await pool.query(
      'SELECT * FROM codigos_qr WHERE codigo = ?',
      [codigo]
    );

    if (codigos.length === 0) {
      return res.status(404).json({ error: 'Código QR no encontrado' });
    }

    const codigoQR = codigos[0];

    res.json({
      quizId: codigoQR.quiz_id,
      url: codigoQR.url_qr,
      message: 'QR escaneado exitosamente'
    });

  } catch (error) {
    console.error('Error al registrar escaneo:', error);
    res.status(500).json({ error: 'Error al registrar escaneo' });
  }
});

// Desactivar código QR (esta funcionalidad no funcionará hasta agregar la columna 'activo')
router.patch('/:id/desactivar', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Por ahora solo responde OK, ya que no existe la columna 'activo'
    res.json({ message: 'Funcionalidad desactivar requiere columna activo en BD' });
  } catch (error) {
    console.error('Error al desactivar QR:', error);
    res.status(500).json({ error: 'Error al desactivar código QR' });
  }
});

// Activar código QR (esta funcionalidad no funcionará hasta agregar la columna 'activo')
router.patch('/:id/activar', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Por ahora solo responde OK, ya que no existe la columna 'activo'
    res.json({ message: 'Funcionalidad activar requiere columna activo en BD' });
  } catch (error) {
    console.error('Error al activar QR:', error);
    res.status(500).json({ error: 'Error al activar código QR' });
  }
});

// Eliminar código QR
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM codigos_qr WHERE id = ?', [id]);

    res.json({ message: 'Código QR eliminado' });
  } catch (error) {
    console.error('Error al eliminar QR:', error);
    res.status(500).json({ error: 'Error al eliminar código QR' });
  }
});

export default router;