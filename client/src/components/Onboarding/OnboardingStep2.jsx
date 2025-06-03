import React, { useEffect, useState } from 'react';
import './OnboardingStep2.scss';

function OnboardingStep2({ onNext, loading }) {
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const scriptId = 'tally-embed-script';

    const loadTally = () => {
      if (typeof Tally !== 'undefined') {
        Tally.loadEmbeds();

        setTimeout(() => {
          setFormSent(true);
        }, 15000); 
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
    <div className="onboarding-step2">
      {loading && <p>Cargando productos...</p>}

      <iframe
        data-tally-src="https://tally.so/embed/wL592l?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy"
        title="Formulario Tally"
        style={{ minHeight: '500px', width: '100%' }}
      ></iframe>

        {formSent && (
        <div className="next-button-wrapper">
            <button onClick={onNext}>Ir al ultimo paso</button>
        </div>
        )}
    </div>
  );
}

export default OnboardingStep2;