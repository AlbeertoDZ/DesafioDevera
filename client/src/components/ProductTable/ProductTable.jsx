import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { SearchContext } from '../../context/SearchContext';
import { Download, Eye, Files } from 'lucide-react';
import './ProductTable.scss';

const ProductTable = () => {
  const navigate = useNavigate();
  const { searchTerm } = useContext(SearchContext);

  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const result = await response.json();
        
        if (response.ok && Array.isArray(result)) {
          // Transform API data to match component expectations
          const transformedProducts = result.map(product => ({
            id: product.id,
            name: product.name,
            company: product.company_name || 'N/A',
            image: product.image || 'https://via.placeholder.com/150x150/cccccc/666666?text=Producto',
            footprint: parseFloat(product.carbon_footprint || 0).toFixed(1),
            difference: product.footprint_difference || '-20%',
            score: getScoreGrade(product.impact_score),
            status: 'Finalizado'
          }));
          setProducts(transformedProducts);
        } else {
          console.error('Error fetching products: Invalid response format');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to convert impact score to letter grade
  const getScoreGrade = (score) => {
    if (!score) return 'F';
    const numScore = parseInt(score);
    if (numScore >= 90) return 'A';
    if (numScore >= 80) return 'B';
    if (numScore >= 70) return 'C';
    if (numScore >= 60) return 'D';
    return 'F';
  };

  const handleSort = (columnKey) => {
    if (sortKey === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(columnKey);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ label, columnKey }) => (
    <div className="cell header-sortable" onClick={() => handleSort(columnKey)}>
      <span className="header-text">{label}</span>
      <span className="header-arrows">
        <span
          className={
            'arrow arrow-up ' +
            (sortKey === columnKey && sortDirection === 'asc' ? 'active' : '')
          }
        >
          ↑
        </span>
        <span
          className={
            'arrow arrow-down ' +
            (sortKey === columnKey && sortDirection === 'desc' ? 'active' : '')
          }
        >
          ↓
        </span>
      </span>
    </div>
  );

  const normalizedTerm = searchTerm.trim().toLowerCase();
  const filteredProducts =
    normalizedTerm === ''
      ? products
      : products.filter((product) =>
          product.name.toLowerCase().trim().startsWith(normalizedTerm)
        );

  const sortedProducts = (() => {
    if (!sortKey) return filteredProducts;
    const copia = [...filteredProducts];

    copia.sort((a, b) => {
      let aval, bval;
      switch (sortKey) {
        case 'name':
          aval = a.name.toLowerCase();
          bval = b.name.toLowerCase();
          return aval.localeCompare(bval) * (sortDirection === 'asc' ? 1 : -1);

        case 'footprint':
          aval = parseFloat(a.footprint.replace(',', '.'));
          bval = parseFloat(b.footprint.replace(',', '.'));
          return (aval - bval) * (sortDirection === 'asc' ? 1 : -1);

        case 'difference':
          aval = parseFloat(a.difference.replace('%', ''));
          bval = parseFloat(b.difference.replace('%', ''));
          return (aval - bval) * (sortDirection === 'asc' ? 1 : -1);

        case 'score':
          aval = a.score.toLowerCase();
          bval = b.score.toLowerCase();
          return aval.localeCompare(bval) * (sortDirection === 'asc' ? 1 : -1);

        default:
          return 0;
      }
    });

    return copia;
  })();

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="table-wrapper">
        <div className="loading-state">
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="table-head table-row">
        <div className="cell">
          <input type="checkbox" />
        </div>

        <SortableHeader label="Producto" columnKey="name" />
        <SortableHeader label="Huella de carbono" columnKey="footprint" />
        <SortableHeader label="Diferencia huella" columnKey="difference" />
        <SortableHeader label="Score" columnKey="score" />

        <div className="cell">
          <span className="header-text">Status</span>
        </div>

        <div className="cell">Ver producto</div>
        <div className="cell">Descargar</div>
        <div className="cell">Archivos</div>
      </div>

      <div className="table-body">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div className="table-row" key={product.id}>
              <div className="cell">
                <span className="label-mobile">Seleccionar</span>
                <input type="checkbox" />
              </div>
              <div className="cell">
                <span className="label-mobile">Producto</span>
                <div className="product-info">
                  <img src={product.image} alt={product.name} />
                  <span>{product.name}</span>
                </div>
              </div>
              <div className="cell">
                <span className="label-mobile">Huella de carbono</span>
                <div>
                  <strong>{product.footprint}</strong>
                  <span> Kg Co2 Eq</span>
                </div>
              </div>
              <div className="cell">
                <span className="label-mobile">Diferencia huella</span>
                <strong>{product.difference}</strong>
              </div>
              <div className="cell">
                <span className="label-mobile">Score</span>
                <div className="score-bar">
                  <span className="label">{product.score}</span>
                  <div className="bar">
                    <div className="green"></div>
                    <div className="yellow"></div>
                    <div className="red"></div>
                  </div>
                </div>
              </div>
              <div className="cell">
                <span className="label-mobile">Status</span>
                <span
                  className={`status ${
                    product.status === 'Pendiente'
                      ? 'pending'
                      : product.status === 'En análisis'
                      ? 'approved'
                      : 'rejected'
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="cell">
                <span className="label-mobile">Ver producto</span>
                <button
                  className="icon-button"
                  onClick={() => handleViewProduct(product.id)}
                >
                  <Eye size={20} />
                </button>
              </div>
              <div className="cell">
                <span className="label-mobile">Descargar</span>
                <button
                  className="icon-button2"
                  onClick={() => alert(`Descargar ${product.name}`)}
                >
                  <Download size={20} />
                </button>
              </div>
              <div className="cell">
                <span className="label-mobile">Archivos</span>
                <div className="cell">
                <span className="label-mobile">Archivos</span>
                <button
                  className="icon-button3"
                  onClick={() => {
                    navigate('/files');
                  }}
                >
                  <Files size={20} />
                </button>
              </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No se encontraron productos.</div>
        )}
      </div>
    </div>
  );
};

export default ProductTable;