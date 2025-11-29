import React from 'react';
import { useNavigate } from 'react-router-dom';
import Quibar from '../components/common/Quibar';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-4">
      <div className="card max-w-2xl w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-angostura-turquesa">
            Museo Angostura
          </h1>
          <p className="text-xl text-angostura-verde font-semibold">
            del Biobío
          </p>
        </div>

        <Quibar 
          size="xl" 
          animation="wave"
          message="¡Bienvenido! Escanea un código QR para comenzar tu aventura educativa 🌲"
        />

        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            ¡Es tiempo de explorar! Ven a disfrutar la naturaleza y aprende sobre
            la historia, biodiversidad y cultura del río Biobío.
          </p>

          <div className="bg-angostura-cielo/30 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              📱 Escanea un código QR en el museo para acceder a un quiz interactivo
              <br />
              🏆 Compite con otros visitantes por el mejor puntaje
              <br />
              🦊 Quibar te acompañará en tu aventura
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => navigate('/quiz/escanear')}
            className="btn-primary"
          >
            🎯 Escanear Código QR
          </button>

          <button
            onClick={() => navigate('/ranking')}
            className="btn-secondary"
          >
            🏆 Ver Ranking
          </button>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Síguenos en redes sociales: Instagram • Facebook • Twitter • YouTube
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;