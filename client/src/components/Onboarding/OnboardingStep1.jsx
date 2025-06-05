import React, { useState } from 'react';
import "./OnboardingStep1.scss";

function OnboardingStep1({ onNext }) {
  const [url, setUrl] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!url) {
      alert("Por favor ingresa una URL");
      return;
    }
    if (!companyName) {
      alert("Por favor ingresa el nombre de la empresa");
      return;
    }

    onNext({ url, companyName, sales: {} });
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
            placeholder="https://ejemplo.com"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        
        <div className='attach-section-container'>  
          <label htmlFor="companyName">Nombre de la empresa</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={companyName}
            placeholder="Mi Empresa S.A."
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <button type="submit">Siguiente</button>
      </form>
    </div>
  );
}

export default OnboardingStep1;