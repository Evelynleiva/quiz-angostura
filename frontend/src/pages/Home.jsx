import React from 'react';
import { useNavigate } from 'react-router-dom';
import Quibar from '../components/common/Quibar';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-4">
      <div className="card max-w-2xl w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-angostura-turquesa">
            Museo Angostura del Biobío
          </h1>
          <p className="text-xl text-gray-600">
            Sistema Interactivo de Quizzes
          </p>
        </div>

        {/* Quibar */}
        <Quibar 
          size="xl" 
          animation="float" 
          message="¡Bienvenido! Soy Quibar, tu guía en el museo 🌲"
        />

        {/* Opciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Para visitantes */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 space-y-4 border-2 border-angostura-turquesa hover:shadow-xl transition-shadow">
            <div className="text-center">
              <span className="text-5xl mb-3 block">🎮</span>
              <h2 className="text-2xl font-bold text-angostura-turquesa mb-2">
                Visitantes
              </h2>
              <p className="text-gray-600 mb-4">
                Escanea el código QR o explora los quizzes disponibles
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/quiz/lista')}
                className="btn-primary w-full"
              >
                📚 Ver Quizzes Disponibles
              </button>
              <button
                onClick={() => navigate('/ranking')}
                className="btn-secondary w-full"
              >
                🏆 Ver Ranking
              </button>
            </div>
          </div>

          {/* Para administradores */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 space-y-4 border-2 border-angostura-amarillo hover:shadow-xl transition-shadow">
            <div className="text-center">
              <span className="text-5xl mb-3 block">👨‍💼</span>
              <h2 className="text-2xl font-bold text-angostura-amarillo mb-2">
                Administración
              </h2>
              <p className="text-gray-600 mb-4">
                Gestiona quizzes, códigos QR y resultados
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold rounded-lg transition-all transform hover:scale-105"
            >
              🔐 Acceso Administradores
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-angostura-cielo/30 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Si tienes un código QR, escanéalo con tu celular para acceder directamente al quiz
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;