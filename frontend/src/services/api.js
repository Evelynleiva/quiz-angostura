import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

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

export default api;
