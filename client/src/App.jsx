import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login'
import './App.css'
import Home from "./components/Home/Home";
import OnboardingContainer from './components/Onboarding/OnboardingContainer';
import ProductDetail from "./components/ProductDetail/ProductDetail";
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div>
            <div className="loading-spinner">🔄</div>
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  // Verificar autenticación directamente con el estado user
  // Esto asegura que React detecte cambios y re-renderice automáticamente
  const isLoggedIn = !!user && !!localStorage.getItem('authToken');

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={!isLoggedIn ? <div className="route-transition"><Login /></div> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/" 
            element={isLoggedIn ? <div className="route-transition"><Home /></div> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/product/:id" 
            element={isLoggedIn ? <div className="route-transition"><ProductDetail /></div> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/onboarding" 
            element={isLoggedIn ? <div className="route-transition"><OnboardingContainer /></div> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="*" 
            element={isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
