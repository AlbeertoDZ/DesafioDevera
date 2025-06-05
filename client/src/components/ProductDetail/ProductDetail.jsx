import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './ProductDetail.scss';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [productFiles, setProductFiles] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resumen');
  const [refreshFiles, setRefreshFiles] = useState(0);

  // Fetch product data from API
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}/detail`);
        const result = await response.json();
        
        if (response.ok) {
          setProduct(result.data);
        } else {
          console.error('Error fetching product:', result.message);
        }
      } catch (error) {
        console.error('Error fetching product detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  // Fetch files for this product
  useEffect(() => {
    const fetchProductFiles = async () => {
      try {
        const response = await fetch('/api/files/');
        const result = await response.json();
        
        if (response.ok) {
          const filesForProduct = result.data.filter(file => 
            file.product_id === parseInt(id)
          );
          setProductFiles(filesForProduct);
        }
      } catch (error) {
        console.error('Error obteniendo archivos:', error);
      }
    };

    if (id) {
      fetchProductFiles();
    }
  }, [id, refreshFiles]);

  if (loading) {
    return (
      <main className="product-detail">
        <Header />
        <section className="product-detail-content">
          <div className="container">
            <div className="loading">Cargando producto...</div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-detail">
        <Header />
        <section className="product-detail-content">
          <div className="error-message">
            <h2>Producto no encontrado</h2>
            <button onClick={() => navigate('/')} className="back-button">
              Volver al inicio
            </button>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const getScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 80) return '#22c55e'; // Verde
    if (numScore >= 60) return '#eab308'; // Amarillo
    return '#ef4444'; // Rojo
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('product_id', id);

    try {
      const response = await fetch('/api/files/upload/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ Archivo "${file.name}" subido correctamente`);
        setRefreshFiles(prev => prev + 1);
      } else {
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      alert('❌ Error al subir el archivo');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await fetch(`/api/files/${fileId}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('❌ Error al descargar el archivo');
      }
    } catch (error) {
      console.error('Error descargando archivo:', error);
      alert('❌ Error al descargar el archivo');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return (
          <main className="content-sections">
            {/* Carbon footprint section */}
            <section className="section">
              <h2>Huella de Carbono</h2>
              <article className="carbon-footprint">
                <header className="carbon-total">
                  <span className="carbon-value">{product.carbonFootprint.total}</span>
                  <span className="carbon-unit">kg CO₂ eq</span>
                  <div className="carbon-icon">🌱</div>
                </header>
                
                <section className="carbon-breakdown">
                  <div className="breakdown-item">
                    <div className="breakdown-icon">🏭</div>
                    <div className="breakdown-info">
                      <span className="breakdown-label">Materia prima</span>
                      <span className="breakdown-value">{product.carbonFootprint.rawMaterials.toFixed(2)}</span>
                      <span className="breakdown-unit">kg CO₂ eq</span>
                    </div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-icon">⚙️</div>
                    <div className="breakdown-info">
                      <span className="breakdown-label">Fabricación</span>
                      <span className="breakdown-value">{product.carbonFootprint.manufacturing.toFixed(2)}</span>
                      <span className="breakdown-unit">kg CO₂ eq</span>
                    </div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-icon">🚚</div>
                    <div className="breakdown-info">
                      <span className="breakdown-label">Transporte</span>
                      <span className="breakdown-value">{product.carbonFootprint.transport.toFixed(2)}</span>
                      <span className="breakdown-unit">kg CO₂ eq</span>
                    </div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-icon">📦</div>
                    <div className="breakdown-info">
                      <span className="breakdown-label">Embalaje</span>
                      <span className="breakdown-value">{product.carbonFootprint.packaging.toFixed(2)}</span>
                      <span className="breakdown-unit">kg CO₂ eq</span>
                    </div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-icon">👤</div>
                    <div className="breakdown-info">
                      <span className="breakdown-label">Uso</span>
                      <span className="breakdown-value">{product.carbonFootprint.use}</span>
                      <span className="breakdown-unit">kg CO₂ eq</span>
                    </div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-icon">♻️</div>
                    <div className="breakdown-info">
                      <span className="breakdown-label">Fin de vida</span>
                      <span className="breakdown-value">{product.carbonFootprint.endOfLife.toFixed(2)}</span>
                      <span className="breakdown-unit">kg CO₂ eq</span>
                    </div>
                  </div>
                </section>
              </article>
            </section>

            {/* Comparison section */}
            <section className="section">
              <div className="comparison-section">
                <article className="comparison-item">
                  <h3>Diferencia huella con respecto a la media</h3>
                  <div className="comparison-value positive">
                    <span className="percentage">{product.footprintDifference}</span>
                    <div className="comparison-icon">🌱</div>
                  </div>
                  <div className="comparison-details">
                    <div className="detail-row">
                      <span className="icon">📊</span>
                      <span className="value">{product.averageFootprint}</span>
                      <span className="unit">kg CO₂ eq</span>
                      <span className="label">Huella media del producto estándar</span>
                    </div>
                  </div>
                </article>

                <article className="comparison-item">
                  <h3>Puntuación de sostenibilidad</h3>
                  <div className="sustainability-score">
                    <span className="score-large">{product.sustainabilityScore}/100</span>
                    <div className="sustainability-icon">🌿</div>
                  </div>
                  <div className="sustainability-details">
                    <div className="detail-row">
                      <span className="icon">⭐</span>
                      <span className="value">{product.brandFootprint}</span>
                      <span className="unit">/10</span>
                      <span className="label">Huella del producto respecto al mercado</span>
                    </div>
                    <div className="detail-row">
                      <span className="icon">🌱</span>
                      <span className="value">{product.brandSustainability}</span>
                      <span className="unit">/10</span>
                      <span className="label">Sostenibilidad de la marca</span>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </main>
        );

      case 'conclusiones':
        return (
          <main className="content-sections">
            <section className="section">
              <h2>Conclusiones del Análisis</h2>
              <div className="conclusions-content">
                <div className="summary-box">
                  <h3>🎯 Resumen General</h3>
                  <p>{product.conclusions.summary}</p>
                </div>

                <div className="conclusions-grid">
                  <div className="strengths-box">
                    <h3>✅ Fortalezas</h3>
                    <ul>
                      {product.conclusions.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="improvements-box">
                    <h3>🔧 Áreas de Mejora</h3>
                    <ul>
                      {product.conclusions.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="certifications-box">
                  <h3>🏆 Certificaciones</h3>
                  <div className="certifications-list">
                    {product.conclusions.certifications.map((cert, index) => (
                      <span key={index} className="certification-badge">{cert}</span>
                    ))}
                  </div>
                </div>

                <div className="impact-box">
                  <h3>🌍 Impacto Ambiental</h3>
                  <p className="impact-assessment">{product.conclusions.environmental_impact}</p>
                </div>
              </div>
            </section>
          </main>
        );

      case 'categorias':
        return (
          <main className="content-sections">
            <section className="section">
              <h2>Detalle por Categorías</h2>
              <div className="categories-grid">
                <div className="category-card">
                  <div className="category-header">
                    <h3>🏭 Materiales</h3>
                    <div className="category-score">{product.categories.materials.score}/100</div>
                  </div>
                  <p>{product.categories.materials.details}</p>
                  <div className="category-metrics">
                    <span>📊 Renovables: {product.categories.materials.percentage_renewable}</span>
                    <div className="certifications">
                      {product.categories.materials.certifications.map((cert, index) => (
                        <span key={index} className="cert-tag">{cert}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="category-card">
                  <div className="category-header">
                    <h3>⚙️ Manufactura</h3>
                    <div className="category-score">{product.categories.manufacturing.score}/100</div>
                  </div>
                  <p>{product.categories.manufacturing.details}</p>
                  <div className="category-metrics">
                    <span>🔋 Energía renovable: {product.categories.manufacturing.energy_renewable}</span>
                    <span>💧 Eficiencia hídrica: {product.categories.manufacturing.water_efficiency}</span>
                  </div>
                </div>

                <div className="category-card">
                  <div className="category-header">
                    <h3>🚚 Transporte</h3>
                    <div className="category-score">{product.categories.transport.score}/100</div>
                  </div>
                  <p>{product.categories.transport.details}</p>
                  <div className="category-metrics">
                    <span>🏪 Proveedores locales: {product.categories.transport.local_suppliers}</span>
                    <span>🌱 Eficiente en carbono: {product.categories.transport.carbon_efficient ? 'Sí' : 'No'}</span>
                  </div>
                </div>

                <div className="category-card">
                  <div className="category-header">
                    <h3>📦 Embalaje</h3>
                    <div className="category-score">{product.categories.packaging.score}/100</div>
                  </div>
                  <p>{product.categories.packaging.details}</p>
                  <div className="category-metrics">
                    <span>♻️ Reciclable: {product.categories.packaging.recyclable}</span>
                    <span>🌿 Biodegradable: {product.categories.packaging.biodegradable}</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
        );

      case 'comparativa':
        return (
          <main className="content-sections">
            <section className="section">
              <h2>Comparativa con el Mercado</h2>
              <div className="comparison-content">
                <div className="market-position">
                  <h3>📈 Posición en el Mercado</h3>
                  <div className="position-badge">{product.comparison.market_position}</div>
                  <p>{product.comparison.ranking}</p>
                </div>

                <div className="competitors-section">
                  <h3>🏢 Comparación con Competidores</h3>
                  <div className="competitors-list">
                    {product.comparison.competitors.map((competitor, index) => (
                      <div key={index} className="competitor-item">
                        <div className="competitor-name">{competitor.name}</div>
                        <div className="competitor-metrics">
                          <span>Huella: {competitor.footprint.toFixed(2)} kg CO₂</span>
                          <span>Score: {competitor.score}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="industry-average">
                  <h3>📊 Promedio de la Industria</h3>
                  <div className="average-metric">
                    <span>Huella promedio: {product.comparison.industry_average} kg CO₂ eq</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
        );

      case 'marca':
        return (
          <main className="content-sections">
            <section className="section">
              <h2>Sostenibilidad de la Marca</h2>
              <div className="brand-content">
                <div className="brand-score">
                  <h3>🌟 Puntuación General</h3>
                  <div className="score-display">{product.brand_sustainability.overall_score}/10</div>
                </div>

                <div className="initiatives-section">
                  <h3>🚀 Iniciativas de Sostenibilidad</h3>
                  <ul className="initiatives-list">
                    {product.brand_sustainability.initiatives.map((initiative, index) => (
                      <li key={index}>{initiative}</li>
                    ))}
                  </ul>
                </div>

                <div className="social-impact">
                  <h3>👥 Impacto Social</h3>
                  <div className="social-metrics">
                    <div className="metric">
                      <span className="label">Comercio Justo:</span>
                      <span className="value">{product.brand_sustainability.social_impact.fair_trade ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Comunidades Locales:</span>
                      <span className="value">{product.brand_sustainability.social_impact.local_communities}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Satisfacción Empleados:</span>
                      <span className="value">{product.brand_sustainability.social_impact.employee_satisfaction}</span>
                    </div>
                  </div>
                </div>

                <div className="transparency">
                  <h3>🔍 Transparencia</h3>
                  <div className="transparency-metrics">
                    <div className="metric">
                      <span className="label">Visibilidad Cadena de Suministro:</span>
                      <span className="value">{product.brand_sustainability.transparency.supply_chain_visibility}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Reporte de Impacto:</span>
                      <span className="value">{product.brand_sustainability.transparency.impact_reporting}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Auditorías Terceros:</span>
                      <span className="value">{product.brand_sustainability.transparency.third_party_audits ? 'Sí' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        );

      case 'marketing':
        return (
          <main className="content-sections">
            <section className="section">
              <h2>Información de Marketing</h2>
              <div className="marketing-content">
                <div className="target-audience">
                  <h3>🎯 Audiencia Objetivo</h3>
                  <p>{product.marketing_info.target_audience}</p>
                </div>

                <div className="benefits-section">
                  <h3>✨ Beneficios Clave</h3>
                  <ul className="benefits-list">
                    {product.marketing_info.key_benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="claims-section">
                  <h3>🌱 Claims de Sostenibilidad</h3>
                  <div className="claims-grid">
                    {product.marketing_info.sustainability_claims.map((claim, index) => (
                      <div key={index} className="claim-badge">{claim}</div>
                    ))}
                  </div>
                </div>

                <div className="messaging-section">
                  <h3>💬 Mensajes Recomendados</h3>
                  <div className="messaging-list">
                    {product.marketing_info.recommended_messaging.map((message, index) => (
                      <div key={index} className="message-item">"{message}"</div>
                    ))}
                  </div>
                </div>

                <div className="channels-pricing">
                  <div className="channels">
                    <h3>📢 Canales de Distribución</h3>
                    <ul>
                      {product.marketing_info.channels.map((channel, index) => (
                        <li key={index}>{channel}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pricing">
                    <h3>💰 Posicionamiento de Precio</h3>
                    <p>{product.marketing_info.price_positioning}</p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        );

      default:
        return null;
    }
  };

  return (
    <main className="product-detail">
      <Header />
      
      <section className="product-detail-content">
        <div className="container">
          {/* Back button */}
          <nav>
            <button onClick={() => navigate('/')} className="back-button">
              <ArrowLeft size={20} />
              Volver
            </button>
          </nav>

          {/* Main product info */}
          <header className="product-header">
            <figure className="product-image">
              <img src="https://via.placeholder.com/200x200/4ade80/ffffff?text=Producto" alt={product.name} />
            </figure>
            
            <section className="product-title-section">
              <h1 className="product-title">{product.name}</h1>
              
              <div className="impact-score">
                <div className="score-circle">
                  <span className="score-letter">{product.scoreGrade}</span>
                </div>
                <div className="score-info">
                  <div className="score-label">IMPACT SCORE</div>
                  <div className="score-value">{product.impactScore}/100</div>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ 
                        width: `${product.impactScore}%`,
                        backgroundColor: getScoreColor(product.impactScore)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            <aside className="actions">
              <div className="action-item">
                <span>Ver reporte</span>
                <FileText size={20} />
              </div>
              <div className="action-item">
                <span>Descargar reporte</span>
                <Download size={20} />
              </div>
              <div className="action-item" onClick={() => document.getElementById('file-upload').click()}>
                <span>{uploading ? 'Subiendo...' : 'Adjuntar archivo'}</span>
                <Upload size={20} />
                <input
                  id="file-upload"
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
              </div>
            </aside>
          </header>

          {/* Mostrar archivos del producto */}
          {productFiles.length > 0 && (
            <section className="product-files">
              <h3>Archivos del producto</h3>
              <div className="files-list">
                {productFiles.map(file => (
                  <div key={file.file_id} className="file-item">
                    <FileText size={16} />
                    <span className="file-name">{file.original_name}</span>
                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                    <button 
                      className="download-btn"
                      onClick={() => downloadFile(file.file_id, file.original_name)}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Product details */}
          <section className="product-details-grid">
            <dl className="detail-item">
              <dt className="label">Modelo</dt>
              <dd className="value">{product.model}</dd>
            </dl>
            <dl className="detail-item">
              <dt className="label">Categoría</dt>
              <dd className="value">{product.category}</dd>
            </dl>
            <dl className="detail-item">
              <dt className="label">Marca</dt>
              <dd className="value">{product.brand}</dd>
            </dl>
            <dl className="detail-item">
              <dt className="label">Enlace</dt>
              <dd className="value link">{product.link}</dd>
            </dl>
          </section>

          {/* Navigation tabs */}
          <nav className="tabs">
            <button 
              className={`tab ${activeTab === 'resumen' ? 'active' : ''}`}
              onClick={() => setActiveTab('resumen')}
            >
              Resumen
            </button>
            <button 
              className={`tab ${activeTab === 'conclusiones' ? 'active' : ''}`}
              onClick={() => setActiveTab('conclusiones')}
            >
              Conclusiones
            </button>
            <button 
              className={`tab ${activeTab === 'categorias' ? 'active' : ''}`}
              onClick={() => setActiveTab('categorias')}
            >
              Detalle categorías
            </button>
            <button 
              className={`tab ${activeTab === 'comparativa' ? 'active' : ''}`}
              onClick={() => setActiveTab('comparativa')}
            >
              Comparativa
            </button>
            <button 
              className={`tab ${activeTab === 'marca' ? 'active' : ''}`}
              onClick={() => setActiveTab('marca')}
            >
              Sostenibilidad de la marca
            </button>
            <button 
              className={`tab ${activeTab === 'marketing' ? 'active' : ''}`}
              onClick={() => setActiveTab('marketing')}
            >
              Información marketing
            </button>
          </nav>

          {/* Dynamic content based on active tab */}
          {renderTabContent()}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProductDetail; 