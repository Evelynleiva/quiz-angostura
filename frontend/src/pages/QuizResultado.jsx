import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Quibar from '../components/common/Quibar';
import ShareableCard from '../components/common/ShareableCard';
import html2canvas from 'html2canvas';

const QuizResultado = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resultado, tiempoCompletado, usuario } = location.state || {};
  const resultadoRef = useRef(null);
  const shareableRef = useRef(null);

  if (!resultado) {
    navigate('/');
    return null;
  }

  const porcentaje = Math.round(
    (resultado.puntajeObtenido / resultado.puntajeMaximo) * 100
  );

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

  const textoBase = `¡Obtuve ${porcentaje}% en el quiz "${
    location.state?.quiz?.titulo || 'Flora del Biobío'
  }" del Museo Angostura! 🏛️`;
  const url = window.location.origin;

  const quibarAnimation =
    porcentaje >= 80 ? 'celebra' : porcentaje >= 40 ? 'idle' : 'float';

  // Compartir o descargar imagen
  const capturarYDescargar = async () => {
    try {
      const shareableElement = shareableRef.current;
      if (!shareableElement) return;

      // Mostrar off-screen
      shareableElement.style.position = 'fixed';
      shareableElement.style.left = '-9999px';
      shareableElement.style.top = '0';
      shareableElement.style.zIndex = '-1';

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(shareableElement, {
        backgroundColor: '#E0F2FE',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 1080,
        height: 1920
      });

      // Ocultar de nuevo
      shareableElement.style.position = 'absolute';
      shareableElement.style.left = '-9999px';

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          'museo-angostura-resultado.png',
          { type: 'image/png' }
        );

        // Primero intentamos compartir nativo (móviles compatibles)
        const shareData = {
          files: [file],
          title: 'Mi resultado - Museo Angostura',
          text: `${textoBase} ${url}`
        };

        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share(shareData);
            return; // el usuario ya compartió o canceló
          } catch (err) {
            if (err.name === 'AbortError') {
              return; // canceló; no forzamos descarga
            }
            // si falla por otra razón, seguimos con descarga
          }
        }

        // Respaldo: descargar la imagen
        const link = document.createElement('a');
        link.download = 'museo-angostura-resultado.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();

        alert(
          '📸 Imagen descargada.\n\n' +
          'Si tu navegador no permite compartir directo, ' +
          'sube la imagen a tus redes manualmente.'
        );
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error al capturar imagen:', error);
      alert('Error al generar la imagen. Intenta nuevamente.');
    }
  };

  return (
    <>
      {/* Contenedor oculto 1080x1920 para la tarjeta compartible */}
      <div
        ref={shareableRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '1080px',
          height: '1920px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#E0F2FE'
        }}
      >
        <ShareableCard
          porcentaje={porcentaje}
          puntaje={resultado.puntajeObtenido}
          puntajeMaximo={resultado.puntajeMaximo}
          nombreQuiz={location.state?.quiz?.titulo || 'Flora del Biobío'}
          nickname={usuario?.nickname || 'Visitante'}
        />
      </div>

      {/* Vista normal de resultados */}
      <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-4">
        {/* decoraciones de fondo */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-10 left-10 text-4xl opacity-60 animate-bounce-soft">
            ✨
          </div>
          <div className="absolute top-20 right-12 text-4xl opacity-60 animate-float-soft">
            ⭐
          </div>
          <div className="absolute bottom-16 left-1/4 text-4xl opacity-60 animate-float-soft">
            🌿
          </div>
        </div>

        <div
          ref={resultadoRef}
          className="card max-w-2xl w-full space-y-6 relative motion-safe:animate-quibar-entrada"
        >
          {/* encabezado */}
          <div className="text-center space-y-4">
            <div className= "text-6xl mb-1 drop-shadow-sm">
              {porcentaje === 100
                ? '🏆'
                : porcentaje >= 80
                ? '🎉'
                : porcentaje >= 60
                ? '😊'
                : '💪'}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-angostura-turquesa drop-shadow-sm">
              ¡Quiz Completado!
            </h1>

            <div className="mt-2">
              <Quibar
                size="lg"
                animationVariant={quibarAnimation}
                message={getMensaje()}
              />
            </div>

            <div className="mt-3 bg-white/50 rounded-lg py-2 px-4 inline-block">
              <p className="text-sm font-bold text-angostura-turquesa">
                🏛️ Museo Angostura del Biobío
              </p>
              <p className="text-xs text-gray-600">
                Patrimonio Natural y Cultural
              </p>
            </div>
          </div>

          {/* tarjeta de puntaje */}
          <div className="bg-gradient-to-br from-angostura-amarillo/40 via-white/80 to-angostura-cielo/50 rounded-2xl p-6 text-center border-2 border-angostura-amarillo shadow-xl relative overflow-hidden">
            <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 bg-white/40 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 left-0 w-40 h-40 bg-angostura-cielo/40 rounded-full blur-3xl" />

            <p className="text-gray-700 mb-1 text-sm font-semibold tracking-wide">
              Tu puntuación
            </p>
            <p
              className={`text-6xl font-extrabold ${getColor()} mb-1 drop-shadow-sm`}
            >
              {resultado.puntajeObtenido}
            </p>
            <p className="text-gray-700 text-sm">
              de {resultado.puntajeMaximo} puntos
            </p>

            <div className="mt-5 space-y-2">
              <div className="w-full h-4 bg-gray-200/80 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${
                    porcentaje >= 80
                      ? 'from-green-400 via-emerald-400 to-lime-300'
                      : porcentaje >= 60
                      ? 'from-angostura-turquesa via-sky-400 to-cyan-300'
                      : porcentaje >= 40
                      ? 'from-yellow-400 via-amber-300 to-orange-300'
                      : 'from-red-500 via-rose-500 to-orange-400'
                  }`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
              <p className="text-2xl font-bold text-angostura-gris mt-1">
                {porcentaje}%
              </p>
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm">
              <p className="text-3xl font-extrabold text-angostura-turquesa drop-shadow-sm">
                {resultado.respuestasCorrectas}
              </p>
              <p className="text-xs uppercase tracking-wide text-gray-500 mt-1">
                Respuestas correctas
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm">
              <p className="text-3xl font-extrabold text-angostura-turquesa drop-shadow-sm">
                {formatearTiempo(tiempoCompletado)}
              </p>
              <p className="text-xs uppercase tracking-wide text-gray-500 mt-1">
                Tiempo usado
              </p>
            </div>
          </div>

          {/* info jugador */}
          <div className="bg-angostura-cielo/25 rounded-xl p-4 text-center border border-angostura-cielo/60">
            <p className="text-sm text-gray-700">
              Jugador:{' '}
              <span className="font-bold text-angostura-turquesa">
                {usuario?.nickname}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tu puntuación ha sido guardada en el ranking
            </p>
          </div>

          {/* botón compartir/descargar */}
          <div className="botones-compartir bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-md">
            <p className="text-sm font-semibold text-gray-700 text-center mb-3">
              📱 ¡Comparte tu resultado!
            </p>

            <button
              onClick={capturarYDescargar}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 text-base font-bold hover:scale-105 shadow-lg mb-3"
            >
              📥 Compartir / Descargar Imagen
            </button>

            <div className="mt-3 bg-angostura-amarillo/20 rounded-lg p-3 border border-angostura-amarillo/40">
              <p className="text-xs text-gray-700 text-center leading-relaxed">
                💡 <strong>Se generará una imagen hermosa</strong> con Quibar y
                el logo del museo.
                <br />
                📱 En móviles compatibles se abrirá el panel para compartirla
                directo en tus apps.
              </p>
            </div>
          </div>

          {/* acciones principales */}
          <div className="acciones-principales space-y-3">
            <button
              onClick={() => navigate('/ranking')}
              className="btn-primary w-full hover:scale-[1.02] transition-transform"
            >
              🏆 Ver Ranking
            </button>

            <button
              onClick={() => navigate('/quiz/lista')}
              className="btn-secondary w-full hover:scale-[1.02] transition-transform"
            >
              📚 Intentar otro Quiz
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-6 rounded-lg text-angostura-turquesa hover:bg-gray-100 transition-all hover:scale-[1.01]"
            >
              🏠 Volver al Inicio
            </button>
          </div>

          {porcentaje < 100 && (
            <div className="bg-angostura-amarillo/20 rounded-lg p-4 border border-angostura-amarillo/60">
              <p className="text-sm text-gray-700 text-center">
                💡 ¡Intenta de nuevo para mejorar tu puntuación!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizResultado;

