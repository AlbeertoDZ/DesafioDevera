import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { SearchContext } from '../../context/SearchContext';
import './ProductTable.scss';

const ProductTable = () => {
  const navigate = useNavigate();
  const { searchTerm } = useContext(SearchContext); 

  const products = [
    {
      id: 1,
      name: 'Elabaute',
      image:
        'https://dominandoelecommerce.com/wp-content/uploads/2019/06/fotografia-de-producto-para-tiendas-online.jpg',
      footprint: '5,78',
      difference: '-40%',
      score: 'A',
      status: 'Pendiente',
    },
    {
      id: 2,
      name: 'Natura Face',
      image:
        'https://comunicacionmarketing.es/wp-content/uploads/2019/11/Amazon-lucha-por-mantener-la-marca-de-Nike-en-su-marketplace.jpg',
      footprint: '4,21',
      difference: '-28%',
      score: 'B',
      status: 'En análisis',
    },
    {
      id: 3,
      name: 'EcoLotion',
      image:
        'https://www.revistaeyn.com/binrepository/1280x900/40c0/1200d900/none/26086/CMVW/nike-air-vapormax-2020-0_EN1406339_MG223324389.jpg',
      footprint: '6,02',
      difference: '-35%',
      score: 'C',
      status: 'Finalizado',
    },
  
  ];

const normalizedTerm = searchTerm.trim().toLowerCase();


const filteredProducts =
  normalizedTerm === ''
    ? products
    : products.filter((product) =>
        product.name.toLowerCase().trim().startsWith(normalizedTerm)
      );

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="table-wrapper">
      <div className="table-head table-row">
        <div className="cell"><input type="checkbox" /></div>
        <div className="cell">Producto</div>
        <div className="cell">Huella de carbono</div>
        <div className="cell">Diferencia huella</div>
        <div className="cell">Score</div>
        <div className="cell">Status</div>
        <div className="cell">Ver</div>
        <div className="cell">Descargar</div>
        <div className="cell">Archivos</div>
      </div>

      <div className="table-body">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
                <span className="label-mobile">Ver</span>
                <button
                  className="icon-button"
                  onClick={() => handleViewProduct(product.id)}
                >
                  👁
                </button>
              </div>
              <div className="cell">
                <span className="label-mobile">Descargar</span>
                <button
                  className="icon-button"
                  onClick={() => alert(`Descargar ${product.name}`)}
                >
                  📥
                </button>
              </div>
              <div className="cell">
                <span className="label-mobile">Archivos</span>
                <button
                  className="icon-button"
                  onClick={() => alert(`Archivos de ${product.name}`)}
                >
                  📎
                </button>
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