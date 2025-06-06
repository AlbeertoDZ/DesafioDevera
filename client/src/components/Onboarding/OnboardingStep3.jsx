import React, { useEffect, useState } from 'react';
import './OnboardingStep3.scss';

function OnboardingStep3({ onNext, onBack }) {
  const [tallyLoaded, setTallyLoaded] = useState(false);

  useEffect(() => {
    const scriptId = 'tally-embed-script';

    const loadTally = () => {
      if (typeof Tally !== 'undefined') {
        Tally.loadEmbeds();
        setTallyLoaded(true);
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://tally.so/widgets/embed.js';
      script.onload = loadTally;
      document.body.appendChild(script);
    } else {
      loadTally();
    }
  }, []);

  return (
    <div className="onboarding-step3">
      <button className='atras-btn' onClick={onBack}>← Atrás</button>
      
      <div className="content-container">
        <h2>Completa este formulario para personalizar tu experiencia</h2>
        
        <div className="tally-container">
          <iframe
            data-tally-src="https://tally.so/embed/wL592l?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            title="Formulario Tally"
            style={{ minHeight: '500px', width: '100%' }}
          ></iframe>
        </div>

        <div className="actions">
          <button className="continue-btn" onClick={onNext}>
            Continuar al último paso →
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingStep3;