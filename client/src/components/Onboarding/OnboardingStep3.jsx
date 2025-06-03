import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingStep3.scss';

function OnboardingStep3({ products, onBack }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [fileMap, setFileMap] = useState({});
  const navigate = useNavigate();

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
    const formData = new FormData();

    selectedProducts.forEach((productName, i) => {
      const product = products.find((p) => p.nombre === productName);
      formData.append(`productos[${i}][nombre]`, product.nombre);
      formData.append(`productos[${i}][url]`, product.url);
      formData.append(`productos[${i}][industria]`, product.industria);
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
        alert(`¡Onboarding completado!\n${result.data.totalProductos} productos y ${result.data.totalArchivos} archivos procesados.`);
        console.log('✅ Respuesta del servidor:', result);
        
        // Redirigir al dashboard después de completar el onboarding
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        alert(`Error al subir productos: ${result.message}`);
        console.error('❌ Error del servidor:', result);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Error en la conexión con el servidor.");
    }
  };

  return (
    <div className="onboarding-step3">
        <button className='atras-btn' onClick={onBack}>← Atrás</button>
      <h2>Selecciona los productos que quieres mostrar</h2>

      <div className="product-list">
        {products.map((product, index) => {
          const isSelected = selectedProducts.includes(product.nombre);
          const file = fileMap[product.nombre];

          return (
            <div key={index} className="product-card">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(product.nombre)}
              />
              <img src={product.imagen} alt={product.nombre} />
              <div className="info">
                <strong>{product.nombre}</strong>
                <span>{product.industria}</span>
              </div>
              <div className="upload">
                <label
                  htmlFor={`file-${index}`}
                  className={`upload-label ${!isSelected ? 'disabled' : ''}`}
                >
                  Sube tu producto
                  <input
                    type="file"
                    id={`file-${index}`}
                    name={`file-${index}`}
                    hidden
                    disabled={!isSelected}
                    accept="application/pdf"
                    onChange={(e) => {
                        handleFileChange(product.nombre, e.target.files[0]);
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

      <div className="actions">
        <button className='finalizar-btn' onClick={handleFinish}>Enviar</button>
      </div>
    </div>
  );
}

export default OnboardingStep3;