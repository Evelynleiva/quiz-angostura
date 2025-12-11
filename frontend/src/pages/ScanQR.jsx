import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Quibar from '../components/common/Quibar';

const ScanQR = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      navigate('/quiz/lista');
    }, 2000);
  };

  return (
    <div className="page-layout">
      <div className="page-card space-y-6">
        <button
          onClick={() => navigate('/')}
          className="text-angostura-turquesa hover:underline text-sm"
        >
          ← Volver al inicio
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-angostura-turquesa">
            Escanear Código QR
          </h1>
          <p className="text-gray-600">
            Acerca tu dispositivo al código QR del museo.
          </p>
        </div>

        <Quibar
          size="lg"
          animation="float"
          message="Función en desarrollo. Por ahora puedes simular el escaneo 🙂"
        />

        <div className="bg-white/80 rounded-xl p-6 border border-dashed border-angostura-turquesa/40 text-center space-y-3">
          <p className="font-semibold text-gray-700">
            Cámara QR (En desarrollo)
          </p>
          <p className="text-sm text-gray-500">
            Por ahora usa el botón para simular un escaneo y ver la lista
            de quizzes.
          </p>
          <button
            onClick={handleSimulateScan}
            disabled={scanning}
            className="btn-primary w-full disabled:opacity-60"
          >
            {scanning ? 'Escaneando...' : '🔍 Simular escaneo'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          💡 Tip: En el museo, escanea los códigos QR junto a cada
          exhibición para acceder a quizzes temáticos.
        </p>
      </div>
    </div>
  );
};

export default ScanQR;
