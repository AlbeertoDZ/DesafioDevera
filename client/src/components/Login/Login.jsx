import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Login.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { login, loading, error, isAuthenticated, setError } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores de validación cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // NO limpiar el error general de credenciales aquí
    // Solo se limpiará cuando se haga un nuevo intento de login
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar error general SOLO al hacer submit
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    console.log('Intentando login con:', formData.email);
    
    const result = await login(formData);
    
    console.log('Resultado del login:', result);
    
    if (result.success) {
      console.log('Login exitoso:', result.user);
    } else {
      console.log('Login fallido:', result.error);
      // El error se mostrará automáticamente desde el hook
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <h1>devera.</h1>
        </div>
        
        <div className="login-content">
          <h2 className="login-title">Entra con tu cuenta</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                disabled={loading}
                autoComplete="email"
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${formErrors.password ? 'error' : ''}`}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.password && <span className="error-message">{formErrors.password}</span>}
            </div>

            <div className="forgot-password">
              <a href="#" className="forgot-link">¿Has olvidado la contraseña?</a>
            </div>

            {error && (
              <div className="error-message general-error">
                <strong>
                  {error === 'Credenciales inválidas' 
                    ? 'Email o contraseña incorrectos'
                    : error
                  }
                </strong>
              </div>
            )}

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Continuar'}
            </button>
          </form>

          <div className="signup-link">
            <a href="#" className="signup-text">¿No tienes cuenta de empresa?</a>
          </div>

          <div className="legal-text">
            <p>
              Al seleccionar <strong>Continuar</strong> aceptas exclusivamente nuestros{' '}
              <a href="#" className="legal-link">Condiciones de servicio</a>,{' '}
              <a href="#" className="legal-link">Política de Privacidad</a> y{' '}
              <a href="#" className="legal-link">Política de Cookies</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 