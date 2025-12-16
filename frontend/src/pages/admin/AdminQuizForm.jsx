import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminQuizForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  const [quiz, setQuiz] = useState({
    titulo: '',
    descripcion: '',
    duracion_minutos: 5,
    nivel_dificultad: 'medio',
    categoria: 'General'
  });

  const [preguntas, setPreguntas] = useState([
    {
      texto_pregunta: '',
      puntos: 10,
      orden: 1,
      respuestas: [
        { texto_respuesta: '', es_correcta: true, orden: 1 },
        { texto_respuesta: '', es_correcta: false, orden: 2 },
        { texto_respuesta: '', es_correcta: false, orden: 3 },
        { texto_respuesta: '', es_correcta: false, orden: 4 }
      ]
    }
  ]);

  const agregarPregunta = () => {
    setPreguntas([...preguntas, {
      texto_pregunta: '',
      puntos: 10,
      orden: preguntas.length + 1,
      respuestas: [
        { texto_respuesta: '', es_correcta: true, orden: 1 },
        { texto_respuesta: '', es_correcta: false, orden: 2 },
        { texto_respuesta: '', es_correcta: false, orden: 3 },
        { texto_respuesta: '', es_correcta: false, orden: 4 }
      ]
    }]);
  };

  const actualizarPregunta = (index, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  const actualizarRespuesta = (preguntaIndex, respuestaIndex, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaIndex].respuestas[respuestaIndex][campo] = valor;
    
    // Si marca como correcta, desmarcar las demás
    if (campo === 'es_correcta' && valor) {
      nuevasPreguntas[preguntaIndex].respuestas.forEach((r, i) => {
        if (i !== respuestaIndex) r.es_correcta = false;
      });
    }
    
    setPreguntas(nuevasPreguntas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // 1. Crear quiz
      console.log('Creando quiz...', quiz);
      const quizRes = await axios.post(`${API_URL}/quizzes`, quiz, config);
      const quizId = quizRes.data.id;
      console.log('Quiz creado con ID:', quizId);

      // 2. Crear preguntas y respuestas
      for (const pregunta of preguntas) {
        console.log('Creando pregunta...', pregunta.texto_pregunta);
        
        const preguntaRes = await axios.post(
          `${API_URL}/quizzes/${quizId}/preguntas`,
          {
            texto_pregunta: pregunta.texto_pregunta,
            puntos: pregunta.puntos,
            orden: pregunta.orden
          },
          config
        );

        const preguntaId = preguntaRes.data.id;
        console.log('Pregunta creada con ID:', preguntaId);

        // 3. Crear respuestas
        for (const respuesta of pregunta.respuestas) {
          console.log('Creando respuesta...', respuesta.texto_respuesta);
          
          await axios.post(
            `${API_URL}/quizzes/preguntas/${preguntaId}/respuestas`,
            respuesta,
            config
          );
        }
      }

      alert('✅ Quiz creado exitosamente con todas sus preguntas y respuestas');
      navigate('/admin/quizzes');

    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      const errorMsg = error.response?.data?.error || error.message;
      alert('❌ Error al crear quiz: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-angostura-turquesa">
              ➕ Crear Nuevo Quiz
            </h1>
            <button onClick={() => navigate('/admin/quizzes')} className="text-angostura-turquesa">
              ← Cancelar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Información del Quiz */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">📋 Información del Quiz</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Título *</label>
                <input
                  type="text"
                  value={quiz.titulo}
                  onChange={(e) => setQuiz({...quiz, titulo: e.target.value})}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:border-angostura-turquesa"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Descripción</label>
                <textarea
                  value={quiz.descripcion}
                  onChange={(e) => setQuiz({...quiz, descripcion: e.target.value})}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:border-angostura-turquesa"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Duración (minutos)</label>
                <input
                  type="number"
                  value={quiz.duracion_minutos}
                  onChange={(e) => setQuiz({...quiz, duracion_minutos: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Nivel</label>
                <select
                  value={quiz.nivel_dificultad}
                  onChange={(e) => setQuiz({...quiz, nivel_dificultad: e.target.value})}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                >
                  <option value="facil">Fácil</option>
                  <option value="medio">Medio</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Categoría</label>
                <input
                  type="text"
                  value={quiz.categoria}
                  onChange={(e) => setQuiz({...quiz, categoria: e.target.value})}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Preguntas */}
          {preguntas.map((pregunta, pIndex) => (
            <div key={pIndex} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">❓ Pregunta {pIndex + 1}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Texto de la pregunta *</label>
                  <input
                    type="text"
                    value={pregunta.texto_pregunta}
                    onChange={(e) => actualizarPregunta(pIndex, 'texto_pregunta', e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {pregunta.respuestas.map((respuesta, rIndex) => (
                    <div key={rIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={respuesta.es_correcta}
                        onChange={() => actualizarRespuesta(pIndex, rIndex, 'es_correcta', true)}
                        className="w-5 h-5"
                      />
                      <input
                        type="text"
                        value={respuesta.texto_respuesta}
                        onChange={(e) => actualizarRespuesta(pIndex, rIndex, 'texto_respuesta', e.target.value)}
                        placeholder={`Respuesta ${rIndex + 1}`}
                        className="flex-1 px-4 py-2 border-2 rounded-lg"
                        required
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">✓ Marca la respuesta correcta</p>
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={agregarPregunta}
              className="btn-secondary"
            >
              ➕ Agregar Pregunta
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Creando...' : '💾 Guardar Quiz Completo'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminQuizForm;