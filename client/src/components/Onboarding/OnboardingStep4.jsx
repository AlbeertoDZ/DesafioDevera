import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingStep4.scss';

function OnboardingStep4({ products = [], onBack, companyInfo }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [fileMap, setFileMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Debug: Log de productos recibidos
  React.useEffect(() => {
    console.log('🔍 OnboardingStep4 - Productos recibidos:', products);
    console.log('🔍 OnboardingStep4 - Total productos:', products?.length || 0);
    if (products && products.length > 0) {
      console.log('🔍 Primer producto:', products[0]);
    }
  }, [products]);

  const handleToggle = (productName) => {
    setSelectedProducts((prev) =>
      prev.includes(productName)
        ? prev.filter((name) => name !== productName)
        : [...prev, productName]
    );
  };

  const handleFileChange = (productName, file) => {
    setFileMap((prev) => ({
      ...prev,
      [productName]: file,
    }));
  };

  const handleRemoveFile = (productName) => {
    setFileMap((prev) => {
      const updated = { ...prev };
      delete updated[productName];
      return updated;
    });
  };

  const handleFinish = async () => {
    if (selectedProducts.length === 0) {
      alert('Por favor selecciona al menos un producto para continuar.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    // Agregar productos seleccionados
    selectedProducts.forEach((productName, i) => {
      const product = products.find((p) => p.nombre === productName);
      if (product) {
        formData.append(`productos[${i}][nombre]`, product.nombre);
        formData.append(`productos[${i}][url]`, product.url);
        formData.append(`productos[${i}][industria]`, product.industria);
        
        // Agregar datos específicos de Tesla si están disponibles
        if (product.imagen) {
          formData.append(`productos[${i}][imagen]`, product.imagen);
        }
        if (product.carbon_footprint) {
          formData.append(`productos[${i}][carbon_footprint]`, product.carbon_footprint);
        }
        if (product.impact_score) {
          formData.append(`productos[${i}][impact_score]`, product.impact_score);
        }
        if (product.sustainability) {
          formData.append(`productos[${i}][sustainability]`, product.sustainability);
        }
      }
    });

    // Agregar archivos en el orden correspondiente a los productos seleccionados
    selectedProducts.forEach((productName) => {
      const file = fileMap[productName];
      if (file) {
        formData.append('archivos', file);
      }
    });

    // Log para debugging
    console.log('📦 Enviando productos:', selectedProducts);
    console.log('📁 Enviando archivos:', selectedProducts.filter(name => fileMap[name]).map(name => fileMap[name].name));

    try {
      const res = await fetch('/api/files/subir-productos', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      
      if (res.ok) {
        alert(`¡Onboarding completado exitosamente!\n${result.data?.totalProductos || selectedProducts.length} productos y ${result.data?.totalArchivos || Object.keys(fileMap).length} archivos procesados.`);
        console.log('✅ Respuesta del servidor:', result);
        
        // Redirigir al dashboard después de completar el onboarding
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        alert(`Error al procesar productos: ${result.message || 'Error desconocido'}`);
        console.error('❌ Error del servidor:', result);
      }
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      alert("Error en la conexión con el servidor. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="onboarding-step4">
        <button className='atras-btn' onClick={onBack}>← Atrás</button>
        <div className="no-products">
          <h2>🤖 No se encontraron productos</h2>
          <p>El agente IA no pudo encontrar productos en el sitio web proporcionado.</p>
          <button onClick={onBack} className="retry-btn">
            ← Intentar con otra URL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-step4">
      <button className='atras-btn' onClick={onBack} disabled={isSubmitting}>← Atrás</button>
      
      <div className="content-container">
        <div className="company-info">
          <h2>Productos encontrados para {companyInfo?.name || 'tu empresa'} 🎉</h2>
          {companyInfo?.totalProducts && (
            <p className="ai-summary">
              🤖 El agente IA encontró <strong>{companyInfo.totalProducts} productos</strong> en tu sitio web
            </p>
          )}
        </div>

        <h3>Selecciona los productos que quieres mostrar en tu dashboard</h3>
        <p className="step-description">
          Puedes subir archivos PDF con información adicional de cada producto (opcional).
        </p>

        <div className="product-list">
          {products.map((product, index) => {
            const isSelected = selectedProducts.includes(product.nombre);
            const file = fileMap[product.nombre];

            return (
              <div key={`${product.nombre}-${index}`} className={`product-card ${isSelected ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(product.nombre)}
                  disabled={isSubmitting}
                />
                
                {/* Tesla Product Image */}
                {product.imagen && (
                  <div className="product-image">
                    <img 
                      src={product.imagen} 
                      alt={product.nombre}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="info">
                  <strong>{product.nombre}</strong>
                  <span className="industry">{product.industria}</span>
                  
                  {/* Tesla Product Extra Info */}
                  {product.carbon_footprint && (
                    <div className="tesla-info">
                      <span className="carbon-footprint">🌱 {product.carbon_footprint} kg CO₂</span>
                      {product.sustainability && (
                        <span className="sustainability">♻️ {product.sustainability}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="upload">
                  <label
                    htmlFor={`file-${index}`}
                    className={`upload-label ${!isSelected ? 'disabled' : ''}`}
                  >
                    📎 Subir archivo
                    <input
                      type="file"
                      id={`file-${index}`}
                      name={`file-${index}`}
                      hidden
                      disabled={!isSelected || isSubmitting}
                      accept="application/pdf,.pdf"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleFileChange(product.nombre, e.target.files[0]);
                        }
                        e.target.value = null; 
                      }}
                    />
                  </label>

                  {file && (
                    <div className="archivo-subido">
                      📄 {file.name}
                      <button
                        type="button"
                        className="remove-file"
                        onClick={() => handleRemoveFile(product.nombre)}
                        disabled={isSubmitting}
                      >
                        ✖
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="summary">
          <p>
            <strong>{selectedProducts.length}</strong> productos seleccionados | 
            <strong> {Object.keys(fileMap).length}</strong> archivos subidos
          </p>
        </div>

        <div className="actions">
          <button 
            className='finalizar-btn' 
            onClick={handleFinish}
            disabled={selectedProducts.length === 0 || isSubmitting}
          >
            {isSubmitting ? '⏳ Procesando...' : '✅ Finalizar Onboarding'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingStep4; 