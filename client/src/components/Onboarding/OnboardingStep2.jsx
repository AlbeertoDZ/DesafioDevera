import React, { useEffect } from 'react';
import './OnboardingStep2.scss';

function OnboardingStep2({ onBack, onNext, loading, aiError, aiCompleted, url }) {
  
  // Auto-advance to next step when AI completes successfully
  useEffect(() => {
    if (aiCompleted && !aiError && !loading) {
      const timer = setTimeout(() => {
        onNext();
      }, 2000); // Wait 2 seconds to show success message
      
      return () => clearTimeout(timer);
    }
  }, [aiCompleted, aiError, loading, onNext]);

  return (
    <div className="onboarding-step2">
      <button className='atras-btn' onClick={onBack} disabled={loading}>← Atrás</button>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">🤖</div>
          <h2>Agente IA analizando tu sitio web...</h2>
          <p className="loading-url">📱 Procesando: <strong>{url}</strong></p>
          <div className="loading-steps">
            <div className="step active">🔍 Escaneando productos</div>
            <div className="step active">📊 Analizando sostenibilidad</div>
            <div className="step active">🧮 Calculando huella de carbono</div>
            <div className="step">✅ Generando resultados</div>
          </div>
          <p className="loading-note">Esto puede tomar unos segundos...</p>
        </div>
      ) : aiError ? (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error en el Agente IA</h2>
          <p className="error-message">{aiError}</p>
          <p className="error-note">Se usarán productos de ejemplo para continuar</p>
          <button className="continue-btn" onClick={onNext}>
            Continuar con datos de ejemplo →
          </button>
        </div>
      ) : aiCompleted ? (
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h2>¡Análisis completado exitosamente!</h2>
          <p>El agente IA ha procesado tu sitio web y encontrado productos</p>
          <p className="auto-advance">Avanzando automáticamente al siguiente paso...</p>
          <button className="continue-btn" onClick={onNext}>
            Continuar ahora →
          </button>
        </div>
      ) : (
        <div className="waiting-container">
          <div className="waiting-icon">⏳</div>
          <h2>Preparando análisis...</h2>
          <p>Iniciando el agente IA...</p>
        </div>
      )}
    </div>
  );
}

export default OnboardingStep2;