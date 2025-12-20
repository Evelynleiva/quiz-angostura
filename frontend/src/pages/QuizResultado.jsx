import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Quibar from '../components/common/Quibar';
import ShareableCard from '../components/common/ShareableCard';
import html2canvas from 'html2canvas';

const QuizResultado = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resultado, tiempoCompletado, usuario } = location.state || {};
  const shareableRef = useRef(null);
  const [generando, setGenerando] = useState(false);

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

  const textoBase = `¡Obtuve ${porcentaje}% en el quiz del Museo Angostura! 🏛️`;

  const quibarAnimation =
    porcentaje >= 80 ? 'celebra' : porcentaje >= 40 ? 'idle' : 'float';

  // CAPTURA DE IMAGEN CORREGIDA
  const capturarYDescargar = async () => {
    if (generando) return;
    
    try {
      setGenerando(true);
      
      const shareableElement = shareableRef.current;
      if (!shareableElement) {
        alert('❌ Error: No se encontró el elemento');
        setGenerando(false);
        return;
      }

      // Hacer visible EXACTAMENTE en el tamaño correcto
      shareableElement.style.position = 'fixed';
      shareableElement.style.left = '0';
      shareableElement.style.top = '0';
      shareableElement.style.zIndex = '9999';
      shareableElement.style.width = '1080px';
      shareableElement.style.height = '1920px';
      shareableElement.style.overflow = 'hidden';

      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(shareableElement, {
        backgroundColor: '#E0F2FE',
        scale: 1,
        logging: false,
        useCORS: false,
        allowTaint: true,
        width: 1080,
        height: 1920,
        windowWidth: 1080,
        windowHeight: 1920,
        x: 0,
        y: 0
      });

      // Ocultar
      shareableElement.style.position = 'fixed';
      shareableElement.style.left = '-9999px';
      shareableElement.style.top = '-9999px';
      shareableElement.style.zIndex = '-1';

      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('❌ Error al generar la imagen');
          setGenerando(false);
          return;
        }

        const file = new File([blob], 'museo-resultado.png', { type: 'image/png' });

        // MÉTODO 1: Compartir nativo
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Mi resultado - Museo Angostura',
              text: textoBase
            });
            setGenerando(false);
            return;
          } catch (err) {
            if (err.name === 'AbortError') {
              setGenerando(false);
              return;
            }
          }
        }

        // MÉTODO 2: Abrir en nueva pestaña
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const newWindow = window.open('', '_blank');
        
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Tu Resultado - Museo Angostura</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                  background: #1e293b;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  width: 100%;
                  text-align: center;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                  border-radius: 12px;
                  margin-bottom: 24px;
                  display: block;
                }
                .card {
                  background: rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(10px);
                  border-radius: 16px;
                  padding: 24px;
                  margin-top: 20px;
                  border: 1px solid rgba(255, 255, 255, 0.2);
                }
                h2 {
                  color: #fbbf24;
                  font-size: 24px;
                  margin-bottom: 16px;
                  font-weight: 800;
                  font-family: system-ui, sans-serif;
                }
                p {
                  color: rgba(255, 255, 255, 0.9);
                  font-size: 16px;
                  line-height: 1.6;
                  margin-bottom: 12px;
                  font-family: system-ui, sans-serif;
                }
                .btn {
                  display: inline-block;
                  margin-top: 16px;
                  padding: 14px 28px;
                  background: linear-gradient(135deg, #fbbf24, #f59e0b);
                  color: white;
                  text-decoration: none;
                  border-radius: 12px;
                  font-weight: bold;
                  font-size: 18px;
                  font-family: system-ui, sans-serif;
                }
                .divider {
                  height: 1px;
                  background: rgba(255, 255, 255, 0.2);
                  margin: 20px 0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <img src="${dataUrl}" alt="Tu resultado">
                
                <div class="card">
                  <h2>📱 Cómo Guardar la Imagen</h2>
                  
                  <p><strong>📲 Android:</strong></p>
                  <p>Mantén presionada la imagen y selecciona "Guardar imagen"</p>
                  
                  <div class="divider"></div>
                  
                  <p><strong>📱 iPhone:</strong></p>
                  <p>Mantén presionada la imagen y selecciona "Añadir a Fotos"</p>
                  
                  <div class="divider"></div>
                  
                  <a href="${dataUrl}" download="museo-angostura-resultado.png" class="btn">
                    💾 Descargar Imagen
                  </a>
                </div>
              </div>
            </body>
            </html>
          `);
          
          alert('✅ ¡Imagen lista! Mantén presionada para guardar.');
        } else {
          // MÉTODO 3: Descarga directa
          const link = document.createElement('a');
          link.download = 'museo-resultado-' + Date.now() + '.png';
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          alert('✅ Descarga iniciada.');
        }

        setGenerando(false);
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
      setGenerando(false);
    }
  };

  return (
    <>
      {/* Contenedor oculto con ShareableCard */}
      <div
        ref={shareableRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: '1080px',
          height: '1920px',
          zIndex: '-1'
        }}
      >
        <ShareableCard
          porcentaje={porcentaje}
          puntaje={resultado.puntajeObtenido}
          puntajeMaximo={resultado.puntajeMaximo}
          nombreQuiz={location.state?.quiz?.titulo || 'Quiz del Museo'}
          nickname={usuario?.nickname || 'Visitante'}
        />
      </div>

      {/* Vista normal de resultados */}
      <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-4">
        <div className="card max-w-2xl w-full space-y-6 relative">
          {/* Encabezado */}
          <div className="text-center space-y-4">
            <div className="text-6xl mb-1">
              {porcentaje === 100 ? '🏆' : porcentaje >= 80 ? '🎉' : porcentaje >= 60 ? '😊' : '💪'}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-angostura-turquesa">
              ¡Quiz Completado!
            </h1>

            <Quibar
              size="lg"
              animationVariant={quibarAnimation}
              message={getMensaje()}
            />

            <div className="mt-3 bg-white/50 rounded-lg py-2 px-4 inline-block">
              <p className="text-sm font-bold text-angostura-turquesa">
                🏛️ Museo Angostura del Biobío
              </p>
            </div>
          </div>

          {/* Tarjeta de puntaje */}
          <div className="bg-gradient-to-br from-angostura-amarillo/40 via-white/80 to-angostura-cielo/50 rounded-2xl p-6 text-center border-2 border-angostura-amarillo shadow-xl">
            <p className="text-gray-700 mb-1 text-sm font-semibold">Tu puntuación</p>
            <p className={`text-6xl font-extrabold ${getColor()} mb-1`}>
              {resultado.puntajeObtenido}
            </p>
            <p className="text-gray-700 text-sm">de {resultado.puntajeMaximo} puntos</p>

            <div className="mt-5 space-y-2">
              <div className="w-full h-4 bg-gray-200/80 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    porcentaje >= 80 ? 'bg-green-500' : porcentaje >= 60 ? 'bg-angostura-turquesa' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
              <p className="text-2xl font-bold text-angostura-gris">{porcentaje}%</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center border shadow-sm">
              <p className="text-3xl font-extrabold text-angostura-turquesa">
                {resultado.respuestasCorrectas}
              </p>
              <p className="text-xs uppercase text-gray-500 mt-1">Respuestas correctas</p>
            </div>

            <div className="bg-white rounded-xl p-4 text-center border shadow-sm">
              <p className="text-3xl font-extrabold text-angostura-turquesa">
                {formatearTiempo(tiempoCompletado)}
              </p>
              <p className="text-xs uppercase text-gray-500 mt-1">Tiempo usado</p>
            </div>
          </div>

          {/* Info jugador */}
          <div className="bg-angostura-cielo/25 rounded-xl p-4 text-center border border-angostura-cielo/60">
            <p className="text-sm text-gray-700">
              Jugador: <span className="font-bold text-angostura-turquesa">{usuario?.nickname}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Tu puntuación ha sido guardada</p>
          </div>

          {/* Botón compartir/descargar */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-md">
            <p className="text-sm font-semibold text-gray-700 text-center mb-3">
              📱 ¡Comparte tu resultado!
            </p>

            <button
              onClick={capturarYDescargar}
              disabled={generando}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-bold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {generando ? '⏳ Generando imagen...' : '📸 Compartir / Descargar'}
            </button>

            <p className="text-xs text-gray-600 text-center mt-3">
              Se abrirá en una nueva pestaña donde podrás guardarla
            </p>
          </div>

          {/* Acciones */}
          <div className="space-y-3">
            <button onClick={() => navigate('/ranking')} className="btn-primary w-full">
              🏆 Ver Ranking
            </button>

            <button onClick={() => navigate('/quiz/lista')} className="btn-secondary w-full">
              📚 Intentar otro Quiz
            </button>

            <button onClick={() => navigate('/')} className="w-full py-3 px-6 rounded-lg text-angostura-turquesa hover:bg-gray-100 transition-all">
              🏠 Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizResultado;