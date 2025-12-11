import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizzesAPI } from '../../services/api';

const AdminQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarQuizzes = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await quizzesAPI.obtenerTodos();
      // Asegura que siempre sea un array
      const lista = Array.isArray(data) ? data : data.quizzes || [];
      setQuizzes(lista);
    } catch (err) {
      console.error('Error al cargar quizzes:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Error al cargar quizzes'
      );
    } finally {
      setLoading(false);
    }
  };

  const eliminarQuiz = async (id) => {
    if (
      !confirm(
        '¿Estás seguro de eliminar este quiz? Se eliminarán todas sus preguntas y respuestas.'
      )
    )
      return;

    try {
      await quizzesAPI.eliminar(id);
      alert('Quiz eliminado exitosamente');
      cargarQuizzes();
    } catch (err) {
      console.error('Error al eliminar quiz:', err);
      alert(
        err.response?.data?.error ||
          err.message ||
          'Error al eliminar quiz'
      );
    }
  };

  useEffect(() => {
    cargarQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-angostura-turquesa"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-angostura-turquesa">
              📚 Gestión de Quizzes
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
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/quizzes/nuevo')}
            className="btn-primary"
          >
            ➕ Crear Nuevo Quiz
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duración</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jugado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{quiz.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{quiz.titulo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{quiz.categoria}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{quiz.nivel_dificultad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {quiz.duracion_minutos} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {quiz.veces_jugado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        quiz.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {quiz.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/quizzes/editar/${quiz.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarQuiz(quiz.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {quizzes.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No hay quizzes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminQuizzes;
