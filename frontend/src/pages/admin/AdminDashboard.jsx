import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalUsuarios: 0,
    totalSesiones: 0
  });

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    if (!token || !adminData) {
      navigate('/admin/login');
      return;
    }

    setAdmin(JSON.parse(adminData));
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Cargar estadísticas básicas
      const [quizzes, usuarios, sesiones] = await Promise.all([
        axios.get('/api/quizzes', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/usuarios', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/ranking', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setStats({
        totalQuizzes: quizzes.data.length,
        totalUsuarios: usuarios.data.length,
        totalSesiones: sesiones.data.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  if (!admin) return null;

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
              <p className="text-sm text-gray-600">Bienvenido, {admin.nombre}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-angostura-turquesa hover:text-angostura-verde"
              >
                🏠 Ver sitio
              </button>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
              >
                🚪 Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Quizzes</p>
                <p className="text-3xl font-bold text-angostura-turquesa">{stats.totalQuizzes}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-3xl font-bold text-angostura-turquesa">{stats.totalUsuarios}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sesiones Completadas</p>
                <p className="text-3xl font-bold text-angostura-turquesa">{stats.totalSesiones}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-angostura-gris mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/quizzes')}
              className="btn-primary"
            >
              📝 Gestionar Quizzes
            </button>
            <button
              onClick={() => navigate('/admin/quizzes/nuevo')}
              className="btn-secondary"
            >
              ➕ Crear Nuevo Quiz
            </button>
            <button
              onClick={() => navigate('/admin/codigos-qr')}
              className="bg-angostura-amarillo hover:bg-yellow-600 text-angostura-gris font-semibold py-3 px-6 rounded-lg"
            >
              🔲 Códigos QR
            </button>
            <button
              onClick={() => navigate('/ranking')}
              className="bg-angostura-verde hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              🏆 Ver Ranking
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;