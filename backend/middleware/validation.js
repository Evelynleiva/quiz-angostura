const { body, param, query, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Datos inválidos', 
      details: errors.array() 
    });
  }
  next();
};

// Sanitizar strings básico (sin dependencias externas)
const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  
  // Eliminar tags HTML
  let sanitized = value.replace(/<[^>]*>/g, '');
  
  // Eliminar caracteres especiales peligrosos
  sanitized = sanitized.replace(/[<>'"]/g, '');
  
  return sanitized.trim();
};

// Validaciones por módulo
const userValidation = {
  register: [
    body('nombre')
      .trim()
      .notEmpty().withMessage('Nombre es requerido')
      .isLength({ min: 3, max: 20 })
      .withMessage('Nombre debe tener entre 3 y 20 caracteres')
      .customSanitizer(sanitizeString),
    handleValidationErrors
  ]
};

const quizValidation = {
  create: [
    body('titulo')
      .trim()
      .notEmpty().withMessage('Título es requerido')
      .isLength({ min: 3, max: 100 })
      .withMessage('Título debe tener entre 3 y 100 caracteres')
      .customSanitizer(sanitizeString),
    body('descripcion')
      .trim()
      .isLength({ max: 500 })
      .withMessage('Descripción máximo 500 caracteres')
      .customSanitizer(sanitizeString),
    body('duracion_minutos')
      .isInt({ min: 1, max: 60 })
      .withMessage('Duración debe estar entre 1 y 60 minutos'),
    body('nivel_dificultad')
      .isIn(['facil', 'medio', 'dificil'])
      .withMessage('Nivel de dificultad inválido'),
    body('categoria')
      .trim()
      .notEmpty()
      .withMessage('Categoría es requerida')
      .customSanitizer(sanitizeString),
    handleValidationErrors
  ],
  
  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('titulo')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .customSanitizer(sanitizeString),
    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .customSanitizer(sanitizeString),
    body('duracion_minutos')
      .optional()
      .isInt({ min: 1, max: 60 }),
    body('nivel_dificultad')
      .optional()
      .isIn(['facil', 'medio', 'dificil']),
    handleValidationErrors
  ]
};

const adminValidation = {
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email es requerido')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Contraseña es requerida')
      .isLength({ min: 6 })
      .withMessage('Contraseña debe tener al menos 6 caracteres'),
    handleValidationErrors
  ]
};

const qrValidation = {
  generate: [
    body('quiz_id')
      .isInt({ min: 1 })
      .withMessage('ID de quiz inválido'),
    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .customSanitizer(sanitizeString),
    body('ubicacion')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .customSanitizer(sanitizeString),
    handleValidationErrors
  ]
};

const sessionValidation = {
  start: [
    body('usuario_id')
      .isInt({ min: 1 })
      .withMessage('ID de usuario inválido'),
    body('quiz_id')
      .isInt({ min: 1 })
      .withMessage('ID de quiz inválido'),
    handleValidationErrors
  ],
  
  finish: [
    param('sesionId')
      .isInt({ min: 1 })
      .withMessage('ID de sesión inválido'),
    body('puntaje_obtenido')
      .isInt({ min: 0 })
      .withMessage('Puntaje debe ser un número positivo'),
    body('tiempo_completado')
      .isInt({ min: 0 })
      .withMessage('Tiempo debe ser un número positivo en segundos'),
    handleValidationErrors
  ]
};

module.exports = {
  userValidation,
  quizValidation,
  adminValidation,
  qrValidation,
  sessionValidation,
  handleValidationErrors
};