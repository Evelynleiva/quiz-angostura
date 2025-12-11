import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para agregar token automáticamente si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============ USUARIOS ============
export const usuariosAPI = {
  registrar: async (nickname) => {
    const response = await api.post('/usuarios/registro', { nickname });
    return response.data;
  },
  buscar: async (nickname) => {
    const response = await api.get(`/usuarios/buscar/${nickname}`);
    return response.data;
  },
  obtenerTodos: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },
};

// ============ RANKING ============
export const rankingAPI = {
  obtenerRanking: async (limit = 10) => {
    const response = await api.get(`/ranking?limit=${limit}`);
    return response.data;
  },
  obtenerRankingPorQuiz: async (quizId, limit = 10) => {
    const response = await api.get(`/ranking/quiz/${quizId}?limit=${limit}`);
    return response.data;
  },
  obtenerPosicionUsuario: async (usuarioId) => {
    const response = await api.get(`/ranking/usuario/${usuarioId}`);
    return response.data;
  },
};

// ============ QUIZZES ============
export const quizzesAPI = {
  obtenerTodos: async () => {
    const response = await api.get('/quizzes');
    return response.data;
  },
  obtenerPorId: async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },
  verificarRespuestas: async (quizId, respuestas) => {
    const response = await api.post(`/quizzes/${quizId}/verificar`, { respuestas });
    return response.data;
  },
  crear: async (quizData) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },
  actualizar: async (id, quizData) => {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },
  eliminar: async (id) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },
};

// ============ SESIONES ============
export const sesionesAPI = {
  iniciar: async (usuarioId, quizId, codigoQrId = null) => {
    const response = await api.post('/sesiones/iniciar', {
      usuarioId,
      quizId,
      codigoQrId,
    });
    return response.data;
  },
  finalizar: async (sesionId, puntajeObtenido, tiempoCompletado) => {
    const response = await api.post(`/sesiones/finalizar/${sesionId}`, {
      puntajeObtenido,
      tiempoCompletado,
    });
    return response.data;
  },
  obtenerPorUsuario: async (usuarioId) => {
    const response = await api.get(`/sesiones/usuario/${usuarioId}`);
    return response.data;
  },
  obtenerPorId: async (sesionId) => {
    const response = await api.get(`/sesiones/${sesionId}`);
    return response.data;
  },
};

// ============ CÓDIGOS QR ============
export const qrAPI = {
  obtenerTodos: async () => {
    const response = await api.get('/qr');
    return response.data;
  },
  generar: async (quizId, descripcion, ubicacion) => {
    const response = await api.post('/qr/generar', {
      quizId: parseInt(quizId),
      descripcion,
      ubicacion
    });
    return response.data;
  },
  escanear: async (codigo) => {
    const response = await api.post(`/qr/escanear/${codigo}`);
    return response.data;
  },
  activar: async (id) => {
    const response = await api.patch(`/qr/${id}/activar`);
    return response.data;
  },
  desactivar: async (id) => {
    const response = await api.patch(`/qr/${id}/desactivar`);
    return response.data;
  },
  eliminar: async (id) => {
    const response = await api.delete(`/qr/${id}`);
    return response.data;
  },
};

// ============ AUTENTICACIÓN ============
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  verificarToken: async () => {
    const response = await api.get('/auth/verificar');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('adminToken');
  },
};

// ============ ADMINISTRADORES ============
export const adminAPI = {
  obtenerEstadisticas: async () => {
    const response = await api.get('/admin/estadisticas');
    return response.data;
  },
};

// Exportar funciones individuales para retrocompatibilidad
export const generarCodigoQR = qrAPI.generar;
export const obtenerCodigosQR = qrAPI.obtenerTodos;
export const desactivarCodigoQR = qrAPI.desactivar;
export const eliminarCodigoQR = qrAPI.eliminar;

export default api;