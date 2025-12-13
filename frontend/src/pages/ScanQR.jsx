import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Quibar from '../components/common/Quibar';

const ScanQR = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);

  // Simulación de escaneo de QR (redirige a lista de quizzes)
  const handleSimulateScan = () => {
    setScanning(true);
    
    // Simular escaneo después de 2 segundos
    setTimeout(() => {
      setScanning(false);
      navigate('/quiz/lista');
    }, 2000);
  };

  return (
    <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-4">
      <div className="card max-w-2xl w-full text-center space-y-6">
        <button
          onClick={() => navigate('/')}
          className="text-angostura-turquesa hover:text-angostura-verde mb-4"
        >
          ← Volver al inicio
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-angostura-turquesa">
          Escanear Código QR
        </h1>

        <Quibar 
          size="lg" 
          animation="pulse"
          message="Coloca el código QR frente a tu cámara 📱"
        />

        <div className="bg-gray-200 rounded-xl p-8 min-h-[300px] flex items-center justify-center">
          {scanning ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-angostura-turquesa mx-auto mb-4"></div>
              <p className="text-angostura-gris font-semibold">Escaneando...</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl">📷</div>
              <p className="text-angostura-gris">Cámara QR (En desarrollo)</p>
              <p className="text-sm text-gray-500">
                Por ahora usa el botón de simulación
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSimulateScan}
            disabled={scanning}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎯 Simular Escaneo de QR
          </button>
          
          <button
            onClick={() => navigate('/quiz/lista')}
            className="btn-secondary w-full"
          >
            📚 Ver Quizzes Directamente
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-6 rounded-lg text-angostura-turquesa hover:bg-gray-100 transition-all"
          >
            Cancelar
          </button>
        </div>

        <div className="bg-angostura-cielo/30 rounded-lg p-4">
          <p className="text-xs text-gray-600">
            💡 Tip: En el museo, escanea los códigos QR junto a cada exhibición para acceder a quizzes temáticos
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;