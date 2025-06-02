import './SearchBar.scss';

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <label htmlFor="entries">Show</label>
        <select id="entries" name="entries">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <span>entries</span>
      </div>
      <div className="top-bar-right">
        <input
          type="text"
          placeholder="Search name, email, or etc."
          className="search-input"
        />
        <button className="export-button">
          <img src="/icons/download-icon.svg" alt="Export" />
          Exportar listado<span className="extension">.csv</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;