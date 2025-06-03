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

  // Mock data - en producción esto vendría de una API
  const products = {
    1: {
      id: 1,
      name: 'Elabaute',
      image: 'https://dominandoelecommerce.com/wp-content/uploads/2019/06/fotografia-de-producto-para-tiendas-online.jpg',
      model: 'Elabaute Premium',
      category: 'Cosmético',
      brand: 'Elabaute',
      link: 'www.devera.ai',
      impactScore: 85,
      scoreGrade: 'A',
      carbonFootprint: {
        total: 5.78,
        rawMaterials: 1.50,
        manufacturing: 0.80,
        transport: 1.20,
        packaging: 2.10,
        use: 0.00,
        endOfLife: 0.18
      },
      sustainabilityScore: 85,
      brandFootprint: 8.5,
      brandSustainability: 8.2,
      averageFootprint: 9.63,
      footprintDifference: -40
    },
    2: {
      id: 2,
      name: 'Natura Face',
      image: 'https://comunicacionmarketing.es/wp-content/uploads/2019/11/Amazon-lucha-por-mantener-la-marca-de-Nike-en-su-marketplace.jpg',
      model: 'Face Care Line',
      category: 'Cosmético',
      brand: 'Natura',
      link: 'www.devera.ai',
      impactScore: 78,
      scoreGrade: 'B',
      carbonFootprint: {
        total: 4.21,
        rawMaterials: 1.10,
        manufacturing: 0.65,
        transport: 0.95,
        packaging: 1.30,
        use: 0.00,
        endOfLife: 0.21
      },
      sustainabilityScore: 78,
      brandFootprint: 7.8,
      brandSustainability: 7.5,
      averageFootprint: 5.85,
      footprintDifference: -28
    },
    3: {
      id: 3,
      name: 'EcoLotion',
      image: 'https://www.revistaeyn.com/binrepository/1280x900/40c0/1200d900/none/26086/CMVW/nike-air-vapormax-2020-0_EN1406339_MG223324389.jpg',
      model: 'EcoLine Premium',
      category: 'Cosmético',
      brand: 'EcoLux',
      link: 'www.devera.ai',
      impactScore: 72,
      scoreGrade: 'C',
      carbonFootprint: {
        total: 6.02,
        rawMaterials: 1.80,
        manufacturing: 0.95,
        transport: 1.40,
        packaging: 1.65,
        use: 0.00,
        endOfLife: 0.22
      },
      sustainabilityScore: 72,
      brandFootprint: 7.2,
      brandSustainability: 6.8,
      averageFootprint: 9.26,
      footprintDifference: -35
    }
  };

  const product = products[id];

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
    if (score >= 80) return '#22c55e'; // Verde
    if (score >= 60) return '#eab308'; // Amarillo
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
        // Actualizar lista de archivos del producto
        fetchProductFiles();
      } else {
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      alert('❌ Error al subir el archivo');
    } finally {
      setUploading(false);
      // Limpiar input
      event.target.value = '';
    }
  };

  const fetchProductFiles = async () => {
    try {
      const response = await fetch('/api/files/');
      const result = await response.json();
      
      if (response.ok) {
        // Filtrar archivos del producto actual
        const filesForProduct = result.data.filter(file => 
          file.product_id === parseInt(id)
        );
        setProductFiles(filesForProduct);
      }
    } catch (error) {
      console.error('Error obteniendo archivos:', error);
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

  // Cargar archivos del producto al montar el componente  
  useEffect(() => {
    fetchProductFiles();
  }, [id]);

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
              <img src={product.image} alt={product.name} />
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
            <button className="tab active">Resumen</button>
            <button className="tab">Conclusiones</button>
            <button className="tab">Detalle categorías</button>
            <button className="tab">Comparativa</button>
            <button className="tab">Sostenibilidad de la marca</button>
            <button className="tab">Información marketing</button>
          </nav>

          {/* Content sections */}
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
                      <span className="breakdown-value">{product.carbonFootprint.rawMaterials}</span>
                      <span className="breakdown-unit">kg CO₂ eq</span>
                    </div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-icon">⚙️</div>
                    <div className="breakdown-info">
                      <span className="breakdown-label">Fabricación</span>
                      <span className="breakdown-value">{product.carbonFootprint.manufacturing}</span>
                      <span className="breakdown-unit">kg CO₂ eq</span>
                    </div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-icon">🚚</div>
                    <div className="breakdown-info">
                      <span className="breakdown-label">Transporte</span>
                      <span className="breakdown-value">{product.carbonFootprint.transport}</span>
                      <span className="breakdown-unit">kg CO₂ eq</span>
                    </div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-icon">📦</div>
                    <div className="breakdown-info">
                      <span className="breakdown-label">Embalaje</span>
                      <span className="breakdown-value">{product.carbonFootprint.packaging}</span>
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
                      <span className="breakdown-value">{product.carbonFootprint.endOfLife}</span>
                      <span className="breakdown-unit">kg CO₂ eq</span>
                    </div>
                  </div>
                </section>

                {/* Carbon footprint chart */}
                <figure className="carbon-chart">
                  <div className="chart-bar">
                    <div style={{backgroundColor: '#4a5568', height: '28%'}}></div>
                    <div style={{backgroundColor: '#718096', height: '8%'}}></div>
                    <div style={{backgroundColor: '#a0aec0', height: '12%'}}></div>
                    <div style={{backgroundColor: '#cbd5e0', height: '52%'}}></div>
                    <div style={{backgroundColor: '#e2e8f0', height: '1%'}}></div>
                  </div>
                  <figcaption className="chart-labels">
                    <span>28%</span>
                    <span>8%</span>
                    <span>12%</span>
                    <span>52%</span>
                    <span>1%</span>
                  </figcaption>
                </figure>
              </article>
            </section>

            {/* Comparison section */}
            <section className="section">
              <div className="comparison-section">
                <article className="comparison-item">
                  <h3>Diferencia huella con respecto a la media</h3>
                  <div className="comparison-value positive">
                    <span className="percentage">{product.footprintDifference}%</span>
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
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProductDetail; 