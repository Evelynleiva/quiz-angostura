import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Quibar from '../components/common/Quibar';
import { quizzesAPI } from '../services/api';

const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarQuizzes();
  }, []);

  const cargarQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizzesAPI.obtenerTodos();
      setQuizzes(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar quizzes:', err);
      setError('No se pudieron cargar los quizzes. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const iniciarQuiz = (quizId) => {
    // Redirigir a la página de registro antes del quiz
    navigate(`/quiz/${quizId}/registro`);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-sky flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-angostura-turquesa mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Cargando quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-sky flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center space-y-4">
          <p className="text-red-600 font-semibold">{error}</p>
          <button onClick={cargarQuizzes} className="btn-primary">
            Reintentar
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-4 py-8">
      <div className="card max-w-3xl w-full space-y-6">
        <button
          onClick={() => navigate('/')}
          className="text-angostura-turquesa hover:text-angostura-verde"
        >
          ← Volver al inicio
        </button>

        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-angostura-turquesa">
            📚 Quizzes Disponibles
          </h1>
          
          <Quibar 
            size="md" 
            animation="pulse"
            message="¡Elige un quiz y pon a prueba tus conocimientos! 🧠"
          />
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay quizzes disponibles en este momento.</p>
            <p className="text-sm text-gray-500 mt-2">Vuelve pronto para nuevos desafíos.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white border-2 border-angostura-cielo rounded-xl p-6 hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-angostura-turquesa mb-2">
                      {quiz.titulo}
                    </h2>
                    <p className="text-gray-700 mb-4">{quiz.descripcion}</p>
                    
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-2 bg-angostura-cielo/20 px-3 py-1 rounded-lg">
                        <span>⏱️</span>
                        <span className="font-semibold">{quiz.tiempo_limite} segundos</span>
                      </div>
                      <div className="flex items-center gap-2 bg-angostura-verde/20 px-3 py-1 rounded-lg">
                        <span>🌍</span>
                        <span className="font-semibold">
                          {quiz.idioma === 'es' ? 'Español' : quiz.idioma}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => iniciarQuiz(quiz.id)}
                    className="btn-primary whitespace-nowrap"
                  >
                    🚀 Comenzar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-angostura-amarillo/20 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            💡 Tip: Lee bien cada pregunta y responde con calma. ¡El tiempo es importante!
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizList;