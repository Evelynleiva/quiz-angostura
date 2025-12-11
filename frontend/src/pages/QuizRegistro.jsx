import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Quibar from '../components/common/Quibar';
import { usuariosAPI } from '../services/api';

const QuizRegistro = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (nickname.length < 3) {
      setError('Tu nombre debe tener al menos 3 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Intentar buscar el usuario primero
      let usuario;
      try {
        usuario = await usuariosAPI.buscar(nickname);
      } catch (err) {
        // Si no existe, crear nuevo usuario
        usuario = await usuariosAPI.registrar(nickname);
        usuario = { id: usuario.usuario.id, nickname: usuario.usuario.nickname };
      }

      // Guardar usuario en sessionStorage
      sessionStorage.setItem('usuario', JSON.stringify(usuario));

      // Redirigir al quiz
      navigate(`/quiz/${quizId}/jugar`);

    } catch (err) {
      console.error('Error al registrar usuario:', err);
      setError(err.response?.data?.error || 'Error al procesar tu registro. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-4">
      <div className="card max-w-md w-full space-y-6">
        <button
          onClick={() => navigate('/quiz/lista')}
          className="text-angostura-turquesa hover:text-angostura-verde transition-colors"
        >
          ← Volver a quizzes
        </button>

        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-angostura-turquesa">
            ¡Antes de empezar!
          </h1>
          
          <Quibar 
            size="lg" 
            animation="bounce"
            message="¿Cómo quieres que te llamen? 🦊"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-semibold text-angostura-gris mb-2">
              Tu Nombre
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ej: Matías, Sofía, El Explorador..."
              maxLength={20}
              className="w-full px-4 py-3 border-2 border-angostura-cielo rounded-lg focus:outline-none focus:border-angostura-turquesa text-lg"
              disabled={loading}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Entre 3 y 20 caracteres. Aparecerá en el ranking 🏆
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !nickname.trim() || nickname.length < 3}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg py-3"
          >
            {loading ? '⏳ Cargando...' : '🎯 ¡Empezar a Jugar!'}
          </button>
        </form>

        <div className="bg-angostura-cielo/30 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>Consejo:</strong> Si ya jugaste antes, usa el mismo nombre para ver tu progreso
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizRegistro;