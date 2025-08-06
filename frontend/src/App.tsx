import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import TodoPage from './pages/TodoPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route 
              path="/todos" 
              element={
                <ProtectedRoute>
                  <TodoPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/todos" replace />} />
            <Route path="*" element={<Navigate to="/todos" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
