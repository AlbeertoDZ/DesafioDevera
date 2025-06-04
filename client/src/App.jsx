// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import './App.css';
import Home from './components/Home/Home';
import OnboardingContainer from './components/Onboarding/OnboardingContainer';
import ProductDetail from './components/ProductDetail/ProductDetail';
import { useAuth } from './hooks/useAuth';

// Importamos el provider que contiene el estado de búsqueda
import { SearchProvider } from './context/SearchContext';

function App() {
  const { user, loading } = useAuth();

  // ① Mientras carga la autenticación, mostramos spinner
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

  const isLoggedIn = !!user && !!localStorage.getItem('authToken');

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Ruta de login */}
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <div className="route-transition">
                  <Login />
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Ruta “/” envuelta con SearchProvider */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <SearchProvider>
                  <div className="route-transition">
                    <Home />
                  </div>
                </SearchProvider>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Ruta “/dashboard” también usa Home, la envolvemos igual */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <SearchProvider>
                  <div className="route-transition">
                    <Home />
                  </div>
                </SearchProvider>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* ProductDetail (no necesita el SearchProvider) */}
          <Route
            path="/product/:id"
            element={
              isLoggedIn ? (
                <div className="route-transition">
                  <ProductDetail />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Onboarding (tampoco necesita SearchProvider) */}
          <Route
            path="/onboarding"
            element={
              isLoggedIn ? (
                <div className="route-transition">
                  <OnboardingContainer />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Ruta comodín */}
          <Route
            path="*"
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;