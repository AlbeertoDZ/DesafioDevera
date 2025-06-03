import React, { useState } from 'react';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import "./OnboardingContainer.scss";


function OnboardingContainer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    url: '',
    sales: {},
    attachment: null,
    products: [],  
  });
  const [loadingProducts, setLoadingProducts] = useState(false);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleURLSubmit = async (data) => {
    setFormData(prev => ({
      ...prev,
      url: data.url,
      sales: data.sales,
    }));
  
    setStep(2);
    setLoadingProducts(true);
  
    try {
      const res = await fetch('./productosMuestra.json');
      const products = await res.json();
  
      await new Promise(res => setTimeout(res, 1000)); // Simula delay
  
      setFormData(prev => ({ ...prev, products }));
    } catch (err) {
      console.error("Error al obtener productos", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="onboarding-container">
      {step === 1 && (
        <OnboardingStep1
          onNext={handleURLSubmit} 
          formData={formData}
        />
      )}

        {step === 2 && (
        <OnboardingStep2
            onBack={handleBack}
            onNext={handleNext}
            loading={loadingProducts}
        />
        )}

    {step === 3 && (
    <OnboardingStep3
        products={formData.products}
        onBack={handleBack}
    />
    )}
    </div>
  );
}

export default OnboardingContainer;