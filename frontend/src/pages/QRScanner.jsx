import React from 'react';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-sky flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold text-angostura-turquesa">
          📲 Escáner QR
        </h1>
        <p className="text-gray-600">Función en desarrollo</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
