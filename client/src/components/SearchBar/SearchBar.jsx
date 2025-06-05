import { useContext } from 'react';
import { SearchContext } from '../../context/SearchContext';
import './SearchBar.scss';

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useContext(SearchContext);

  return (
    <div className="top-bar">
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