const rateLimit = require('express-rate-limit');

// Rate limiter general para todas las APIs públicas
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter estricto para login (protección contra fuerza bruta)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  skipSuccessfulRequests: true,
  message: {
    error: 'Demasiados intentos de login, intente en 15 minutos'
  }
});

// Rate limiter para registro de usuarios
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // 10 registros por IP por hora
  message: {
    error: 'Demasiados registros desde esta IP, intente más tarde'
  }
});

// Rate limiter para APIs administrativas
const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 50,
  message: {
    error: 'Demasiadas solicitudes administrativas, intente más tarde'
  }
});

// Rate limiter para generación de QR (operación costosa)
const qrGenerateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20,
  message: {
    error: 'Límite de generación de códigos QR alcanzado, intente más tarde'
  }
});

module.exports = {
  generalLimiter,
  loginLimiter,
  registerLimiter,
  adminLimiter,
  qrGenerateLimiter
};