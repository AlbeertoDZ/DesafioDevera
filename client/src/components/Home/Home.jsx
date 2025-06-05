import Header from "../Header/Header";
import Tabs from "../Tabs/Tabs";
import SearchBar from "../SearchBar/SearchBar";
import ProductTable from "../ProductTable/ProductTable";
import Pagination from "../Pagination/Pagination";

const Home = () => (
  <div className="home-container">
    <Header />
    <Tabs />
    <SearchBar />
    <ProductTable />
    <Pagination />
  </div>
);

export default Home;