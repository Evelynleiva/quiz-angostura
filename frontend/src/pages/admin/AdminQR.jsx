import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { qrAPI, quizzesAPI } from '../../services/api';

const AdminQR = () => {
  const navigate = useNavigate();
  const [codigos, setCodigos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [qrGenerado, setQrGenerado] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    quizId: '',
    descripcion: '',
    ubicacion: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [codigos, quizzes] = await Promise.all([
        qrAPI.obtenerTodos(),
        quizzesAPI.obtenerTodos()
      ]);

      setCodigos(codigos);
      setQuizzes(quizzes);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const generarQR = async (e) => {
    e.preventDefault();
    
    if (!formData.quizId) {
      alert('Debes seleccionar un quiz');
      return;
    }

    try {
      setError('');
      
      console.log('Enviando datos:', formData);
      
      const data = await qrAPI.generar(
        formData.quizId,
        formData.descripcion,
        formData.ubicacion
      );

      console.log('Respuesta recibida:', data);

      setQrGenerado(data);
      setShowModal(true);
      
      setFormData({ quizId: '', descripcion: '', ubicacion: '' });
      
      await cargarDatos();
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      const mensajeError = error.response?.data?.error || 
                          error.response?.data?.details || 
                          'Error al generar código QR';
      
      setError(mensajeError);
      alert(mensajeError);
    }
  };

  const descargarQR = () => {
    if (!qrGenerado) return;
    
    const link = document.createElement('a');
    link.download = `QR-${qrGenerado.codigo}.png`;
    link.href = qrGenerado.qrImage;
    link.click();
  };

  const toggleActivo = async (id, activo) => {
    try {
      if (activo) {
        await qrAPI.desactivar(id);
      } else {
        await qrAPI.activar(id);
      }
      
      await cargarDatos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar estado del código QR');
    }
  };

  const eliminarQR = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este código QR?')) return;
    
    try {
      await qrAPI.eliminar(id);
      await cargarDatos();
    } catch (error) {
      console.error('Error al eliminar QR:', error);
      alert('Error al eliminar código QR');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-angostura-turquesa mx-auto mb-4"></div>
          <p>Cargando códigos QR...</p>
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
            <h1 className="text-2xl font-bold text-angostura-turquesa">
              📲 Gestión de Códigos QR
            </h1>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-angostura-turquesa hover:text-angostura-verde"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Formulario de generación */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-angostura-gris mb-4">
            ➕ Generar Nuevo Código QR
          </h2>
          
          <form onSubmit={generarQR} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quiz *
                </label>
                <select
                  value={formData.quizId}
                  onChange={(e) => setFormData({ ...formData, quizId: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-angostura-turquesa"
                  required
                >
                  <option value="">Selecciona un quiz</option>
                  {quizzes.map(quiz => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  placeholder="Ej: entrada"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-angostura-turquesa"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción del código QR"
                rows="3"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-angostura-turquesa"
              />
            </div>

            <button type="submit" className="btn-primary">
              🎯 Generar Código QR
            </button>
          </form>
        </div>

        {/* Lista de códigos QR */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-angostura-gris mb-4">
            📋 Códigos QR Existentes
          </h2>

          {codigos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay códigos QR generados aún
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quiz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Escaneos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {codigos.map(codigo => (
                    <tr key={codigo.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        {codigo.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {codigo.quiz_titulo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {codigo.ubicacion || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {codigo.veces_escaneado}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          codigo.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {codigo.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => toggleActivo(codigo.id, codigo.activo)}
                          className={`px-3 py-1 rounded ${
                            codigo.activo
                              ? 'bg-yellow-500 hover:bg-yellow-600'
                              : 'bg-green-500 hover:bg-green-600'
                          } text-white`}
                        >
                          {codigo.activo ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => eliminarQR(codigo.id)}
                          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal QR Generado */}
      {showModal && qrGenerado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-angostura-turquesa mb-4 text-center">
              ✅ ¡Código QR Generado!
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <img 
                src={qrGenerado.qrImage} 
                alt="Código QR" 
                className="w-full max-w-xs mx-auto"
              />
            </div>

            <div className="space-y-2 mb-6 text-sm">
              <p><strong>Código:</strong> {qrGenerado.codigo}</p>
              <p className="text-xs text-gray-600 break-all">
                <strong>URL:</strong> {qrGenerado.url}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={descargarQR}
                className="flex-1 btn-primary"
              >
                📥 Descargar QR
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setQrGenerado(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQR;