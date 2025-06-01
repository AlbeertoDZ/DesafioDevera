import './ProductTable.scss';

const ProductTable = () => {
  const products = [
    {
      name: 'Elabaute',
      image: '/images/elabaute.png',
      footprint: '5,78',
      difference: '-40%',
      score: 'A',
      status: 'Pendiente',
    },
    {
      name: 'Natura Face',
      image: '/images/naturaface.png',
      footprint: '4,21',
      difference: '-28%',
      score: 'B',
      status: 'En análisis',
    },
    {
      name: 'EcoLotion',
      image: '/images/ecolotion.png',
      footprint: '6,02',
      difference: '-35%',
      score: 'C',
      status: 'Finalizado',
    },
  ];

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
        {products.map((product, index) => (
          <div className="table-row" key={index}>
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
              <span className={`status ${
                product.status === 'Pendiente'
                  ? 'pending'
                  : product.status === 'En análisis'
                  ? 'approved'
                  : 'rejected'
              }`}>
                {product.status}
              </span>
            </div>
            <div className="cell">
              <span className="label-mobile">Ver</span> 👁
            </div>
            <div className="cell">
              <span className="label-mobile">Descargar</span> 📥
            </div>
            <div className="cell">
              <span className="label-mobile">Archivos</span> 📎
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;