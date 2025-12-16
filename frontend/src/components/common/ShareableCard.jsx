import React from 'react';

const ShareableCard = ({ porcentaje, puntaje, puntajeMaximo, nombreQuiz, nickname }) => {
  return (
    <div
      id="shareable-card"
      style={{
        width: '1080px',
        height: '1080px',
        background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '30px',
        boxSizing: 'border-box'
      }}
    >
      {/* Decoraciones de fondo */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '320px',
        height: '320px',
        background: 'radial-gradient(circle, rgba(250,204,21,0.3) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-120px',
        left: '-120px',
        width: '420px',
        height: '420px',
        background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      {/* Patrón de puntos decorativos */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '80px',
        fontSize: '60px',
        opacity: '0.4'
      }}>🌿</div>
      <div style={{
        position: 'absolute',
        top: '120px',
        right: '100px',
        fontSize: '50px',
        opacity: '0.4'
      }}>🦋</div>
      <div style={{
        position: 'absolute',
        bottom: '220px',
        left: '120px',
        fontSize: '55px',
        opacity: '0.4'
      }}>🌸</div>
      <div style={{
        position: 'absolute',
        bottom: '260px',
        right: '150px',
        fontSize: '50px',
        opacity: '0.4'
      }}>🍃</div>

      {/* Contenedor principal */}
      <div style={{
        width: '900px',
        textAlign: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: '10'
      }}>
        {/* Logo del Museo */}
        <div style={{
          fontSize: '60px',
          marginBottom: '20px'
        }}>🏛️</div>

        <h1 style={{
          color: '#0891B2',
          fontSize: '44px',
          fontWeight: '900',
          margin: '0 0 16px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          lineHeight: '1.2'
        }}>
          Museo Angostura del Biobío
        </h1>

        <p style={{
          color: '#06B6D4',
          fontSize: '26px',
          fontWeight: '700',
          margin: '0 0 28px 0'
        }}>
          Patrimonio Natural y Cultural
        </p>

        {/* Quibar - Mascota con imagen */}
        <div style={{
          margin: '20px 0 24px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src="/QUIBAR.png"
            alt="Quibar"
            style={{
              width: '220px',
              height: '220px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))'
            }}
          />
        </div>

        {/* Mensaje de Felicitación CON DATOS REALES */}
        <div style={{
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          padding: '28px 32px',
          borderRadius: '24px',
          margin: '16px 0 20px 0',
          border: '4px solid #FBBF24',
          boxShadow: '0 8px 20px rgba(251,191,36,0.3)'
        }}>
          <div style={{
            fontSize: '40px',
            marginBottom: '10px'
          }}>
            {porcentaje >= 80 ? '🏆' : porcentaje >= 60 ? '🎉' : '💪'}
          </div>

          <h2 style={{
            color: '#0891B2',
            fontSize: '36px',
            fontWeight: '900',
            margin: '0 0 12px 0',
            lineHeight: '1.25'
          }}>
            ¡Felicitaciones {nickname}!
          </h2>

          <p style={{
            color: '#374151',
            fontSize: '26px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            lineHeight: '1.35'
          }}>
            Obtuviste {porcentaje}% en el quiz
          </p>

          <div style={{
            fontSize: '60px',
            fontWeight: '900',
            color: porcentaje >= 80 ? '#059669' : porcentaje >= 60 ? '#0891B2' : '#F59E0B',
            margin: '16px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            {puntaje}/{puntajeMaximo}
          </div>

          <p style={{
            color: '#6B7280',
            fontSize: '20px',
            fontWeight: '600',
            margin: '0'
          }}>
            puntos
          </p>
        </div>

        {/* Invitación al Museo */}
        <div style={{
          background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
          padding: '26px 32px',
          borderRadius: '24px',
          boxShadow: '0 8px 20px rgba(251,191,36,0.3)'
        }}>
          <p style={{
            color: 'white',
            fontSize: '30px',
            fontWeight: '800',
            margin: '0 0 10px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            lineHeight: '1.25'
          }}>
            ¡Te invitamos a visitarnos! 🦊✨
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: '24px',
            margin: '0',
            fontWeight: '600',
            lineHeight: '1.35'
          }}>
            Descubre más sobre nuestra flora y fauna del Biobío
          </p>
        </div>
      </div>

      {/* Marca de agua */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(0,0,0,0.4)',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        www.museoangostura.cl
      </div>
    </div>
  );
};

export default ShareableCard;