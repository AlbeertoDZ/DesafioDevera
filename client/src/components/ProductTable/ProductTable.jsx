import './ProductTable.scss';

const ProductTable = () => {
  return (
    <div className="table-wrapper">
      <table className="products-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Producto</th>
            <th>Huella de carbono</th>
            <th>Diferencia huella</th>
            <th>Score</th>
            <th>Status</th>
            <th>Ver</th>
            <th>Descargar</th>
            <th>Archivos</th>
          </tr>
        </thead>
        <tbody>
          {/* Aca irán las filas individuales */}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;