import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ScanQR from './pages/ScanQR';
import Ranking from './pages/Ranking';
import QuizList from './pages/QuizList';
import QuizRegistro from './pages/QuizRegistro';
import QuizPlay from './pages/QuizPlay';
import QuizResultado from './pages/QuizResultado';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/quiz/escanear" element={<ScanQR />} />
        <Route path="/quiz/lista" element={<QuizList />} />
        <Route path="/quiz/:quizId/registro" element={<QuizRegistro />} />
        <Route path="/quiz/:quizId/jugar" element={<QuizPlay />} />
        <Route path="/quiz/:quizId/resultado" element={<QuizResultado />} />
        <Route path="/ranking" element={<Ranking />} />

        {/* Rutas de administración */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;