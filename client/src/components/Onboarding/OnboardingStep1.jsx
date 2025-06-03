import React, { useState } from 'react';
import "./OnboardingStep1.scss";

function OnboardingStep1({ onNext }) {
  const [url, setUrl] = useState('');
  const [sales, setSales] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!url) {
      alert("Por favor ingresa una URL");
      return;
    }

    onNext({ url, sales });
  };

  return (
    <div className="onboarding-form-container">
      <h2>Rellena los siguientes campos</h2>

      <form onSubmit={handleSubmit}>
        <div className='url-container'>  
          <label htmlFor="url">Introduce la URL de tu web</label>
          <input
            type="text"
            id="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        
        <div className='attach-section-container'>  
          <label htmlFor="sales">Introduce % ventas por país</label>
          <input
            type="text"
            id="sales"
            name="sales"
            placeholder=''
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setSales(parsed);
              } catch {
                setSales({});
              }
            }}
          />
        </div>
        <button type="submit">Siguiente</button>
      </form>
    </div>
  );
}

export default OnboardingStep1;