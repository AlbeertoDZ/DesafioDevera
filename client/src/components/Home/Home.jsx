import Header from "../Header/Header";
import Tabs from "../Tabs/Tabs";
import SearchBar from "../SearchBar/SearchBar";
import ProductTable from "../ProductTable/ProductTable";

// import Filters from './Filters';
// import JobList from './JobList';

const Home = () => (
  <div className="home-container">
    <Header />
    <Tabs />
    <SearchBar />
    <ProductTable />
  </div>
);

export default Home;