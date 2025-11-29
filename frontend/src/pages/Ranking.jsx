import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Quibar from '../components/common/Quibar';
import { rankingAPI } from '../services/api';

const Ranking = () => {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarRanking();
  }, []);

  const cargarRanking = async () => {
    try {
      setLoading(true);
      const data = await rankingAPI.obtenerRanking(10);
      setRanking(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar ranking:', err);
      setError('No se pudo cargar el ranking. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `${position}°`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-sky flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-angostura-turquesa mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Cargando ranking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-sky flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center space-y-4">
          <p className="text-red-600 font-semibold">{error}</p>
          <button onClick={cargarRanking} className="btn-primary">
            Reintentar
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-4 py-8">
      <div className="card max-w-3xl w-full space-y-6">
        <button
          onClick={() => navigate('/')}
          className="text-angostura-turquesa hover:text-angostura-verde"
        >
          ← Volver al inicio
        </button>

        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-angostura-turquesa">
            🏆 Ranking de Visitantes
          </h1>
          
          <Quibar 
            size="md" 
            animation="bounce"
            message="¡Estos son los mejores exploradores del museo! 🌟"
          />
        </div>

        <div className="bg-angostura-amarillo/20 rounded-lg p-4 text-center">
          <p className="text-sm text-angostura-gris font-semibold">
            📊 Puntuaciones más altas de todos los tiempos
          </p>
        </div>

        {ranking.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay registros en el ranking aún.</p>
            <p className="text-sm text-gray-500 mt-2">¡Sé el primero en completar un quiz!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ranking.map((usuario, index) => (
              <div
                key={usuario.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-all hover:scale-105 ${
                  index < 3
                    ? 'bg-gradient-to-r from-angostura-amarillo/30 to-angostura-cielo/30 border-2 border-angostura-amarillo'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold w-12 text-center">
                    {getMedalEmoji(index + 1)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-angostura-gris">{usuario.nickname}</p>
                    <p className="text-xs text-gray-500">{formatearFecha(usuario.fecha)}</p>
                    <p className="text-xs text-angostura-verde font-semibold">{usuario.quiz_titulo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-angostura-turquesa">
                    {usuario.puntaje_obtenido}
                  </p>
                  <p className="text-xs text-gray-500">puntos</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/quiz/escanear')}
            className="btn-primary w-full"
          >
            🎯 ¡Intenta superar el ranking!
          </button>
        </div>

        <div className="bg-angostura-cielo/30 rounded-lg p-4">
          <p className="text-xs text-gray-600 text-center">
            💡 Los puntos se otorgan por respuestas correctas y tiempo de respuesta
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ranking;