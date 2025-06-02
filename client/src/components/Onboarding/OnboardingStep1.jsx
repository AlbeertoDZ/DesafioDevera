import React from 'react'
import "./OnboardingStep1.scss"

function OnboardingStep1({ onNext }) {
    const handleSubmit = (e) => {
      e.preventDefault(); 
      onNext();
    };
  
    return (
        <div className="onboarding-form-container">
        <h2>Rellena los siguientes campos</h2>
  
        <form onSubmit={handleSubmit}>
          <div className='url-section-container'>  
            <label htmlFor="url">Introduce la URL de tu web</label>
            <input type="text" id="url" name="url" />
          </div>
          
          <div className='attach-section-container'>  
            <label htmlFor="productos">Adjunta la información de tus productos</label>
            <input type="file" id="productos" name="productos" />
          </div>
          <button type="submit">Siguiente</button>
        </form>
      </div>
    );
  }
  
  export default OnboardingStep1;
