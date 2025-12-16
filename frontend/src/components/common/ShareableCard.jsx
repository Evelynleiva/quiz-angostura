import React from 'react';

const ShareableCard = ({ porcentaje, puntaje, puntajeMaximo, nombreQuiz, nickname }) => {
  return (
    <div
      id="shareable-card"
      style={{
        width: '1080px',
        height: '1350px', // antes 1920px
        background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '60px 60px' // menos padding vertical
      }}
    >
      {/* Decoraciones de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(250,204,21,0.3) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '-120px',
          left: '-120px',
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />

      {/* Emojis decorativos */}
      <div
        style={{
          position: 'absolute',
          top: '70px',
          left: '80px',
          fontSize: '70px',
          opacity: '0.4'
        }}
      >
        🌿
      </div>
      <div
        style={{
          position: 'absolute',
          top: '150px',
          right: '100px',
          fontSize: '60px',
          opacity: '0.4'
        }}
      >
        🦋
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '320px',
          left: '120px',
          fontSize: '65px',
          opacity: '0.4'
        }}
      >
        🌸
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '380px',
          right: '150px',
          fontSize: '60px',
          opacity: '0.4'
        }}
      >
        🍃
      </div>

      {/* Contenedor principal */}
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: '10',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Logo del Museo */}
        <div
          style={{
            fontSize: '80px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))'
          }}
        >
          🏛️
        </div>

        <h1
          style={{
            color: '#0891B2',
            fontSize: '48px',
            fontWeight: '900',
            margin: '0 0 15px 0',
            textShadow: '3px 3px 6px rgba(0,0,0,0.1)',
            lineHeight: '1.2'
          }}
        >
          Museo Angostura
          <br />
          del Biobío
        </h1>

        <p
          style={{
            color: '#06B6D4',
            fontSize: '30px',
            fontWeight: '700',
            margin: '0 0 35px 0'
          }}
        >
          Patrimonio Natural y Cultural
        </p>

        {/* Quibar - Mascota */}
        <div
          style={{
            margin: '25px 0 35px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src="/QUIBAR.png"
            alt="Quibar"
            style={{
              width: '260px',
              height: '260px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.2))'
            }}
          />
        </div>

        {/* Tarjeta de Felicitación */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            padding: '35px 40px',
            borderRadius: '28px',
            margin: '0 0 30px 0',
            border: '4px solid #FBBF24',
            boxShadow: '0 12px 32px rgba(251,191,36,0.4)',
            width: '100%',
            maxWidth: '860px',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              fontSize: '60px',
              marginBottom: '15px'
            }}
          >
            {porcentaje >= 80 ? '🏆' : porcentaje >= 60 ? '🎉' : '💪'}
          </div>

          <h2
            style={{
              color: '#0891B2',
              fontSize: '44px',
              fontWeight: '900',
              margin: '0 0 18px 0',
              lineHeight: '1.2'
            }}
          >
            ¡Felicitaciones
            <br />
            {nickname}!
          </h2>

          <p
            style={{
              color: '#374151',
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 22px 0',
              lineHeight: '1.3'
            }}
          >
            Obtuviste {porcentaje}%<br />
            en el quiz
          </p>

          <div
            style={{
              fontSize: '72px',
              fontWeight: '900',
              color:
                porcentaje >= 80 ? '#059669' : porcentaje >= 60 ? '#0891B2' : '#F59E0B',
              margin: '18px 0',
              textShadow: '4px 4px 8px rgba(0,0,0,0.15)'
            }}
          >
            {puntaje}/{puntajeMaximo}
          </div>

          <p
            style={{
              color: '#6B7280',
              fontSize: '26px',
              fontWeight: '600',
              margin: '0'
            }}
          >
            puntos
          </p>
        </div>

        {/* Invitación al Museo */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
            padding: '30px 40px',
            borderRadius: '28px',
            boxShadow: '0 12px 32px rgba(251,191,36,0.4)',
            width: '100%',
            maxWidth: '860px',
            boxSizing: 'border-box'
          }}
        >
          <p
            style={{
              color: 'white',
              fontSize: '36px',
              fontWeight: '800',
              margin: '0 0 10px 0',
              textShadow: '3px 3px 6px rgba(0,0,0,0.25)',
              lineHeight: '1.25'
            }}
          >
            ¡Te invitamos a
            <br />
            visitarnos! 🦊✨
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: '28px',
              margin: '0',
              fontWeight: '600',
              lineHeight: '1.4'
            }}
          >
            Descubre más sobre
            <br />
            la historia de la región
          </p>
        </div>

        {/* Marca de agua */}
        <div
          style={{
            marginTop: '35px',
            color: 'rgba(0,0,0,0.5)',
            fontSize: '22px',
            fontWeight: '700'
          }}
        >
          www.museoangostura.cl
        </div>
      </div>
    </div>
  );
};

export default ShareableCard;
