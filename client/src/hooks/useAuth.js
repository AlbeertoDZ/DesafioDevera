import { useState, useEffect } from 'react';
import axios from 'axios';

// Configurar axios con base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configurar interceptor para incluir token automáticamente
axios.defaults.baseURL = API_BASE_URL;

// Interceptor para agregar token a las requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay token guardado al cargar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  // Función de login
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/users/login', credentials);
      const { token, user: userData } = response.data;

      // Guardar token y datos del usuario
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      setLoading(false);
      
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error en el inicio de sesión';
      setError(errorMessage);
      setLoading(false);
      
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      // Opcional: llamar al endpoint de logout en el server
      await axios.post('/users/logout');
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      // Limpiar storage local
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      setError(null);
    }
  };

  // Función de registro
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/users/register', userData);
      const { token, user: newUser } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(newUser));
      
      setUser(newUser);
      setLoading(false);
      
      return { success: true, user: newUser };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error en el registro';
      setError(errorMessage);
      setLoading(false);
      
      return { success: false, error: errorMessage };
    }
  };

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('authToken');
  };

  // Función para actualizar datos del usuario
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated,
    updateUser,
    setError
  };
}; 