import { useContext } from 'react';
import { SearchContext } from '../../context/SearchContext';
import './SearchBar.scss';

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useContext(SearchContext);

  const handleExportCSV = async () => {
    try {
      // Crear enlace temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = '/api/csv/all-products';
      link.download = `todos_los_productos_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      alert('❌ Error al exportar el archivo CSV');
    }
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <label htmlFor="entries">Mostrando</label>
        <select id="entries" name="entries">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <span>productos</span>
      </div>

      <div className="top-bar-right">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="search-input"
          value={searchTerm}                      
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button className="export-button" onClick={handleExportCSV}>
          <img src="/icons/download-icon.svg" alt="Export" />
          Exportar listado<span className="extension">.csv</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;