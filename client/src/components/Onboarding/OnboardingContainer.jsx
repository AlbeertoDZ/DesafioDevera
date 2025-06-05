import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import Header from '../Header/Header';
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
  const [aiError, setAiError] = useState(null);
  const [aiCompleted, setAiCompleted] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleURLSubmit = async (data) => {
    setFormData(prev => ({
      ...prev,
      url: data.url,
      companyName: data.companyName,
      sales: data.sales,
    }));
  
    setStep(2);
    setLoadingProducts(true);
    setAiError(null);
    setAiCompleted(false);
  
    try {
      console.log('🤖 Conectando con agente IA para análisis de productos...');
      
      // Usar el nombre de empresa proporcionado por el usuario
      const companyName = data.companyName;
      
      console.log(`🏢 Empresa: ${companyName}`);
      console.log(`🔗 URL a analizar: ${data.url}`);

      // Simular productos del agente IA sin guardarlos en BD
      // TODO: Aquí irá la llamada real al agente IA Python
      const mockProducts = generateMockProducts(companyName, data.url);
      
      console.log(`📊 Productos generados por IA: ${mockProducts.length}`);

      setFormData(prev => ({ 
        ...prev, 
        products: mockProducts,
        companyInfo: {
          name: companyName,
          totalProducts: mockProducts.length
        }
      }));

      console.log('🎯 Productos listos para selección:', mockProducts);
      setAiCompleted(true);
      
    } catch (error) {
      console.error('❌ Error conectando con agente IA:', error);
      setAiError(error.message);
      
      // Fallback a datos de ejemplo si falla el agente IA
      console.log('🔄 Usando productos de ejemplo como fallback...');
      try {
        const fallbackResponse = await fetch('./productosMuestra.json');
        const fallbackProducts = await fallbackResponse.json();
        setFormData(prev => ({ ...prev, products: fallbackProducts }));
        setAiCompleted(true);
      } catch (fallbackError) {
        console.error('❌ Error cargando fallback:', fallbackError);
        // Productos mínimos de emergencia
        setFormData(prev => ({ 
          ...prev, 
          products: [
            {
              nombre: "Producto Demo",
              url: data.url,
              industria: "Demo"
            }
          ]
        }));
        setAiCompleted(true);
      }
    } finally {
      setLoadingProducts(false);
    }
  };

  // Función para generar productos mock sin guardar en BD
  const generateMockProducts = (companyName, url) => {
    const lowerCompany = companyName.toLowerCase();
    
    let products = [];
    
    if (lowerCompany.includes('apple')) {
      products = [
        { nombre: 'iPhone 15 Pro Eco', industria: 'Electrónicos Sostenibles' },
        { nombre: 'MacBook Air Reciclado', industria: 'Computadoras Verdes' },
        { nombre: 'iPad Carbon Neutral', industria: 'Tablets Ecológicas' },
        { nombre: 'Apple Watch Green', industria: 'Wearables Sostenibles' },
        { nombre: 'AirPods Recyclable', industria: 'Audio Ecológico' },
        { nombre: 'Mac Studio Renewable', industria: 'Computadoras Pro Verdes' }
      ];
    } else if (lowerCompany.includes('tesla')) {
      products = [
        { nombre: 'Model Y Renewable', industria: 'Vehículos Eléctricos' },
        { nombre: 'Solar Roof V4', industria: 'Energía Solar' },
        { nombre: 'Model S Plaid Green', industria: 'Vehículos Premium Eléctricos' },
        { nombre: 'Powerwall Eco', industria: 'Almacenamiento Energético' },
        { nombre: 'Cybertruck Carbon Zero', industria: 'Vehículos Comerciales Eléctricos' },
        { nombre: 'Tesla Bot Sustainable', industria: 'Robótica Sostenible' }
      ];
    } else if (lowerCompany.includes('ferrari')) {
      products = [
        { nombre: `EcoSmart ${companyName}`, industria: 'Productos Inteligentes' },
        { nombre: `${companyName} Carbon Zero`, industria: 'Productos Carbono Neutral' },
        { nombre: `${companyName} Hybrid Performance`, industria: 'Vehículos Híbridos Premium' },
        { nombre: `${companyName} Solar Edition`, industria: 'Vehículos Energía Solar' },
        { nombre: `${companyName} Electric GT`, industria: 'Deportivos Eléctricos' },
        { nombre: `${companyName} Sustainable Materials`, industria: 'Componentes Ecológicos' }
      ];
    } else {
      products = [
        { nombre: `EcoSmart ${companyName}`, industria: 'Productos Inteligentes' },
        { nombre: `${companyName} Carbon Zero`, industria: 'Productos Carbono Neutral' },
        { nombre: `${companyName} Green Innovation`, industria: 'Innovación Verde' },
        { nombre: `${companyName} Sustainable Pro`, industria: 'Productos Profesionales Sostenibles' },
        { nombre: `${companyName} Eco Series`, industria: 'Serie Ecológica' },
        { nombre: `${companyName} Planet Friendly`, industria: 'Productos Amigables con el Planeta' }
      ];
    }

    return products.map(product => ({
      ...product,
      url: url
    }));
  };

  return (
  
    <div>
         <Header />
    
          <div className="skip-button-wrapper">
            <button 
              className="skip-onboarding-btn"
              onClick={() => navigate('/')}
            >
              Ir al Dashboard →
            </button>
          </div>
    
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
            aiError={aiError}
            aiCompleted={aiCompleted}
            url={formData.url}
        />
      )}

      {step === 3 && (
        <OnboardingStep3
            onBack={handleBack}
            onNext={handleNext}
        />
      )}

      {step === 4 && (
        <OnboardingStep4
            products={formData.products}
            onBack={handleBack}
            companyInfo={formData.companyInfo}
        />
      )}
    </div>
  </div>
  );
}

export default OnboardingContainer;