import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Quibar from '../components/common/Quibar';
import { quizzesAPI, sesionesAPI } from '../services/api';

const QuizPlay = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  
  const [quiz, setQuiz] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [sesionId, setSesionId] = useState(null);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [tiempoTotal, setTiempoTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizFinalizado, setQuizFinalizado] = useState(false);

  // Sonidos con Web Audio API
  const reproducirSonido = (tipo) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (tipo === 'correcto') {
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } else if (tipo === 'click') {
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (e) {
      // Fallback silencioso si el navegador bloquea AudioContext
      console.warn('No se pudo reproducir sonido', e);
    }
  };

  useEffect(() => {
    inicializarQuiz();
  }, []);

  useEffect(() => {
    if (tiempoRestante > 0 && !quizFinalizado) {
      const timer = setTimeout(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (tiempoRestante === 0 && quiz && !quizFinalizado) {
      finalizarQuiz();
    }
  }, [tiempoRestante, quizFinalizado, quiz]);

  const inicializarQuiz = async () => {
    try {
      setLoading(true);
      
      // Obtener usuario del sessionStorage
      const usuarioGuardado = sessionStorage.getItem('usuario');
      if (!usuarioGuardado) {
        navigate(`/quiz/${quizId}/registro`);
        return;
      }
      const usuarioData = JSON.parse(usuarioGuardado);
      setUsuario(usuarioData);

      // Cargar quiz
      const quizData = await quizzesAPI.obtenerPorId(quizId);
      setQuiz(quizData);
      
      // Convertir minutos a segundos (duracion_minutos * 60)
      const tiempoEnSegundos = (quizData.duracion_minutos || 5) * 60;
      setTiempoRestante(tiempoEnSegundos);
      setTiempoTotal(tiempoEnSegundos);

      // Iniciar sesión
      const sesion = await sesionesAPI.iniciar(usuarioData.id, quizId);
      setSesionId(sesion.sesionId);

      setError(null);
    } catch (err) {
      console.error('Error al inicializar quiz:', err);
      setError('Error al cargar el quiz. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarRespuesta = (preguntaId, respuestaId) => {
    reproducirSonido('click');
    setRespuestas({
      ...respuestas,
      [preguntaId]: respuestaId
    });
  };

  const siguientePregunta = () => {
    reproducirSonido('correcto');
    if (preguntaActual < quiz.preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      finalizarQuiz();
    }
  };

  const finalizarQuiz = async () => {
    if (quizFinalizado) return;
    
    setQuizFinalizado(true);

    try {
      // Preparar respuestas para verificar
      const respuestasArray = Object.entries(respuestas).map(([preguntaId, respuestaId]) => ({
        preguntaId: parseInt(preguntaId),
        respuestaId: parseInt(respuestaId)
      }));

      // Verificar respuestas
      const resultado = await quizzesAPI.verificarRespuestas(quizId, respuestasArray);

      // Calcular tiempo completado
      const tiempoCompletado = tiempoTotal - tiempoRestante;

      // Finalizar sesión
      await sesionesAPI.finalizar(sesionId, resultado.puntajeObtenido, tiempoCompletado);

      // Redirigir a resultados
      navigate(`/quiz/${quizId}/resultado`, { 
        state: { 
          resultado,
          tiempoCompletado,
          usuario
        } 
      });

    } catch (err) {
      console.error('Error al finalizar quiz:', err);
      setError('Error al procesar tus respuestas. Intenta de nuevo.');
    }
  };

  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-sky flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Cargando quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen gradient-sky flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center space-y-4">
          <p className="text-red-600 font-semibold">{error || 'Error al cargar el quiz'}</p>
          <button onClick={() => navigate('/quiz/lista')} className="btn-primary">
            Volver a quizzes
          </button>
        </div>
      </div>
    );
  }

  const pregunta = quiz.preguntas[preguntaActual];
  const progreso = ((preguntaActual + 1) / quiz.preguntas.length) * 100;

  return (
    <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-4 py-8">
      <div className="card max-w-3xl w-full space-y-6">
        {/* Header con tiempo y progreso */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Jugador: <span className="font-bold text-angostura-turquesa">{usuario?.nickname}</span>
          </div>
          <div className={`text-2xl font-bold ${tiempoRestante < 30 ? 'text-red-600 animate-pulse' : 'text-angostura-turquesa'}`}>
            ⏱️ {formatearTiempo(tiempoRestante)}
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Pregunta {preguntaActual + 1} de {quiz.preguntas.length}</span>
            <span>{Math.round(progreso)}% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-angostura-turquesa h-3 rounded-full transition-all duration-300"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
        </div>

        {/* Pregunta */}
        <div className="text-center space-y-4">
          <Quibar 
            size="md" 
            animation="pulse"
            message={`Pregunta ${preguntaActual + 1}`}
          />
          
          <h2 className="text-2xl md:text-3xl font-bold text-angostura-gris">
            {pregunta.texto_pregunta}
          </h2>
        </div>

        {/* Respuestas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pregunta.respuestas.map((respuesta) => (
            <button
              key={respuesta.id}
              onClick={() => seleccionarRespuesta(pregunta.id, respuesta.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                respuestas[pregunta.id] === respuesta.id
                  ? 'bg-angostura-turquesa text-white border-angostura-turquesa'
                  : 'bg-white border-gray-300 hover:border-angostura-turquesa'
              }`}
            >
              <span className="font-semibold">{respuesta.texto_respuesta}</span>
            </button>
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={siguientePregunta}
          disabled={!respuestas[pregunta.id]}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {preguntaActual < quiz.preguntas.length - 1 ? '➡️ Siguiente Pregunta' : '🏁 Finalizar Quiz'}
        </button>

        <div className="bg-angostura-amarillo/20 rounded-lg p-3">
          <p className="text-xs text-center text-gray-600">
            💡 Selecciona una respuesta para continuar
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizPlay;
