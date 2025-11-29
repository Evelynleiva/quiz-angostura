import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Quibar from '../components/common/Quibar';

const QuizResultado = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resultado, tiempoCompletado, usuario } = location.state || {};

  if (!resultado) {
    navigate('/');
    return null;
  }

  const porcentaje = Math.round((resultado.puntajeObtenido / resultado.puntajeMaximo) * 100);
  
  const getMensaje = () => {
    if (porcentaje === 100) return '¡Perfecto! Eres un experto 🌟';
    if (porcentaje >= 80) return '¡Excelente trabajo! 🎉';
    if (porcentaje >= 60) return '¡Bien hecho! 👏';
    if (porcentaje >= 40) return 'Puedes mejorar 💪';
    return 'Sigue practicando 📚';
  };

  const getColor = () => {
    if (porcentaje >= 80) return 'text-green-600';
    if (porcentaje >= 60) return 'text-angostura-turquesa';
    if (porcentaje >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-4">
      <div className="card max-w-2xl w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">
            {porcentaje === 100 ? '🏆' : porcentaje >= 80 ? '🎉' : porcentaje >= 60 ? '😊' : '💪'}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-angostura-turquesa">
            ¡Quiz Completado!
          </h1>

          <Quibar 
            size="lg" 
            animation="bounce"
            message={getMensaje()}
          />
        </div>

        {/* Puntuación principal */}
        <div className="bg-gradient-to-br from-angostura-amarillo/30 to-angostura-cielo/30 rounded-xl p-8 text-center border-2 border-angostura-amarillo">
          <p className="text-gray-600 mb-2">Tu puntuación</p>
          <p className={`text-6xl font-bold ${getColor()} mb-2`}>
            {resultado.puntajeObtenido}
          </p>
          <p className="text-gray-600">de {resultado.puntajeMaximo} puntos</p>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  porcentaje >= 80 ? 'bg-green-500' : 
                  porcentaje >= 60 ? 'bg-angostura-turquesa' : 
                  porcentaje >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${porcentaje}%` }}
              ></div>
            </div>
            <p className="text-2xl font-bold text-angostura-gris mt-2">{porcentaje}%</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <p className="text-3xl font-bold text-angostura-turquesa">
              {resultado.respuestasCorrectas}
            </p>
            <p className="text-sm text-gray-600">Respuestas correctas</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <p className="text-3xl font-bold text-angostura-turquesa">
              {formatearTiempo(tiempoCompletado)}
            </p>
            <p className="text-sm text-gray-600">Tiempo usado</p>
          </div>
        </div>

        {/* Información del jugador */}
        <div className="bg-angostura-cielo/20 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            Jugador: <span className="font-bold text-angostura-turquesa">{usuario?.nickname}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Tu puntuación ha sido guardada en el ranking
          </p>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/ranking')}
            className="btn-primary w-full"
          >
            🏆 Ver Ranking
          </button>
          
          <button
            onClick={() => navigate('/quiz/lista')}
            className="btn-secondary w-full"
          >
            📚 Intentar otro Quiz
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-6 rounded-lg text-angostura-turquesa hover:bg-gray-100 transition-all"
          >
            🏠 Volver al Inicio
          </button>
        </div>

        {porcentaje < 100 && (
          <div className="bg-angostura-amarillo/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              💡 ¡Intenta de nuevo para mejorar tu puntuación!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResultado;