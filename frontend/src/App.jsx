import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ScanQR from './pages/ScanQR';
import Ranking from './pages/Ranking';
import QuizList from './pages/QuizList';
import QuizRegistro from './pages/QuizRegistro';
import QuizPlay from './pages/QuizPlay';
import QuizResultado from './pages/QuizResultado';
import QRScanner from './pages/QRScanner';


// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQR from './pages/admin/AdminQR';
import AdminQuizzes from './pages/admin/AdminQuizzes';
import AdminQuizForm from './pages/admin/AdminQuizForm';


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
        <Route path="/quiz/escanear" element={<QRScanner />} />

        {/* Rutas de administración */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/codigos-qr" element={<AdminQR />} />
        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
        <Route path="/admin/quizzes/nuevo" element={<AdminQuizForm />} />
        <Route path="/admin/quizzes/editar/:id" element={<AdminQuizForm />} />
      </Routes>
    </Router>
  );
}

export default App;