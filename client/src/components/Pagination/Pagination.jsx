import './Pagination.scss';

const Pagination = () => {
  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Mostrando 3 a 10 de 20 productos
      </div>
      <div className="pagination-controls">
        <button className="pagination-btn disabled">‹</button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn">3</button>
        <span className="pagination-dots">...</span>
        <button className="pagination-btn">5</button>
        <button className="pagination-btn">›</button>
      </div>
    </div>
  );
};

export default Pagination;