import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, obtenerCodigosQR } from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState({
    totalQuizzes: 0,
    totalUsuarios: 0,
    sesionesCompletadas: 0
  });
  const [codigosQR, setCodigosQR] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
    // Actualizar cada 30 segundos
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      const [stats, qrs] = await Promise.all([
        adminAPI.obtenerEstadisticas(),
        obtenerCodigosQR()
      ]);

      setEstadisticas(stats);

      // Ordenar QRs por escaneos
      const qrsOrdenados = qrs
        .sort((a, b) => b.veces_escaneado - a.veces_escaneado)
        .slice(0, 2);
      setCodigosQR(qrsOrdenados);

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setLoading(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-angostura-turquesa mx-auto mb-4"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-angostura-turquesa">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600">Bienvenido, Administrador Museo</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-angostura-turquesa hover:bg-gray-50 rounded-lg transition-colors"
              >
                🏠 Ver sitio
              </button>
              <button
                onClick={cerrarSesion}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                🚪 Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total Quizzes</p>
                <p className="text-4xl font-bold text-angostura-turquesa mt-2">
                  {estadisticas.totalQuizzes}
                </p>
              </div>
              <div className="text-5xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total Usuarios</p>
                <p className="text-4xl font-bold text-angostura-turquesa mt-2">
                  {estadisticas.totalUsuarios}
                </p>
              </div>
              <div className="text-5xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Sesiones Completadas</p>
                <p className="text-4xl font-bold text-angostura-turquesa mt-2">
                  {estadisticas.sesionesCompletadas}
                </p>
              </div>
              <div className="text-5xl">✅</div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-angostura-gris mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/quizzes')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              📋 Gestionar Quizzes
            </button>
            <button
              onClick={() => navigate('/admin/quiz/nuevo')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              ➕ Crear Nuevo Quiz
            </button>
            <button
              onClick={() => navigate('/admin/codigos-qr')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              📲 Códigos QR
            </button>
            <button
              onClick={() => navigate('/ranking')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              🏆 Ver Ranking
            </button>
          </div>
        </div>

        {/* Panel de Monitoreo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Visitantes Activos */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                🟢 Sistema Activo
              </h3>
              <div className="animate-pulse">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-4xl font-black text-green-600 mb-2">
              {estadisticas.totalQuizzes}
            </p>
            <p className="text-sm text-gray-600 mb-4">Quizzes disponibles</p>
            
            <div className="mt-4 p-3 bg-white/70 rounded-lg">
              <p className="text-xs text-gray-700">
                <strong>Estado:</strong> Todos los sistemas operando correctamente
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {estadisticas.totalUsuarios} usuarios registrados
              </p>
            </div>
          </div>

          {/* Rendimiento General */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-angostura-gris mb-4">
              📊 Métricas Generales
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Participación</span>
                  <span className="text-sm font-bold text-angostura-turquesa">
                    {estadisticas.sesionesCompletadas} sesiones
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-angostura-turquesa h-2 rounded-full"
                    style={{width: `${Math.min((estadisticas.sesionesCompletadas / 100) * 100, 100)}%`}}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Usuarios Registrados</span>
                  <span className="text-sm font-bold text-angostura-turquesa">
                    {estadisticas.totalUsuarios}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{width: `${Math.min((estadisticas.totalUsuarios / 50) * 100, 100)}%`}}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 <strong>Rendimiento:</strong> {
                  estadisticas.sesionesCompletadas > 50 
                    ? '¡Excelente participación del público!'
                    : estadisticas.sesionesCompletadas > 20
                    ? 'Buena actividad en el sistema'
                    : 'Sistema iniciando, esperando más participación'
                }
              </p>
            </div>
          </div>

          {/* Códigos QR Más Escaneados */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-angostura-gris mb-4">
              📱 QR Más Escaneados
            </h3>
            {codigosQR.length > 0 ? (
              <div className="space-y-3">
                {codigosQR.map((qr, index) => (
                  <div 
                    key={qr.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      index === 0 
                        ? 'bg-gradient-to-r from-purple-50 to-transparent border-purple-200' 
                        : 'bg-gradient-to-r from-blue-50 to-transparent border-blue-200'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-sm">{qr.ubicacion || qr.codigo}</p>
                      <p className="text-xs text-gray-500">{qr.quiz_titulo || 'Quiz'}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${index === 0 ? 'text-purple-600' : 'text-blue-600'}`}>
                        {qr.veces_escaneado || 0}
                      </p>
                      <p className="text-xs text-gray-500">escaneos</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">📲</div>
                <p className="text-sm text-gray-500">No hay códigos QR generados aún</p>
                <button
                  onClick={() => navigate('/admin/codigos-qr')}
                  className="mt-3 text-xs text-angostura-turquesa underline"
                >
                  Generar códigos QR →
                </button>
              </div>
            )}
            
            {codigosQR.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-800">
                  🔥 <strong>Hotspot:</strong> {codigosQR[0]?.ubicacion || 'Ubicación principal'} es el punto de mayor actividad.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Centro de Alertas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-angostura-gris mb-4">
            🔔 Centro de Notificaciones
          </h3>
          <div className="space-y-3">
            {estadisticas.sesionesCompletadas > 50 && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <div className="text-2xl">✅</div>
                <div className="flex-1">
                  <p className="font-semibold text-green-800">¡Excelente participación!</p>
                  <p className="text-sm text-green-700">
                    Se han completado {estadisticas.sesionesCompletadas} quizzes. El sistema tiene gran aceptación.
                  </p>
                </div>
              </div>
            )}
            
            {codigosQR.length === 0 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <p className="font-semibold text-yellow-800">Sin códigos QR activos</p>
                  <p className="text-sm text-yellow-700">
                    No hay códigos QR generados. Genera códigos QR para que los visitantes accedan fácilmente a los quizzes.
                  </p>
                  <button 
                    onClick={() => navigate('/admin/codigos-qr')}
                    className="mt-2 text-xs text-yellow-800 underline"
                  >
                    Generar códigos QR →
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div className="text-2xl">📊</div>
              <div className="flex-1">
                <p className="font-semibold text-blue-800">Sistema funcionando correctamente</p>
                <p className="text-sm text-blue-700">
                  Todos los sistemas operativos. {estadisticas.totalUsuarios} usuarios registrados y {estadisticas.totalQuizzes} quizzes activos.
                </p>
              </div>
            </div>

            {estadisticas.sesionesCompletadas === 0 && (
              <div className="flex items-start gap-3 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                <div className="text-2xl">🚀</div>
                <div className="flex-1">
                  <p className="font-semibold text-purple-800">Sistema listo para usar</p>
                  <p className="text-sm text-purple-700">
                    El sistema está configurado correctamente. Esperando las primeras participaciones de visitantes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;