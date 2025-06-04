import { useContext } from 'react';
import { SearchContext } from '../../context/SearchContext';
import './SearchBar.scss';

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useContext(SearchContext);

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
        <button className="export-button">
          <img src="/icons/download-icon.svg" alt="Export" />
          Exportar listado<span className="extension">.csv</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;