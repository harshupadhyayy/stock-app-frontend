import Navbar from "./components/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Watchlist from "./pages/Watchlist";
import Portfolio from "./pages/Portfolio";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";

function App() {
  sessionStorage.removeItem("savedData");
  sessionStorage.removeItem("summaryChart");
  sessionStorage.removeItem("chartChart");
  sessionStorage.removeItem("marketStatus");

  return (
    <>
      <div className="main-content">
        <div className="secondary-content">
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route exact path="/" element={<Navigate to="/search/home" />} />
              <Route path="/search/home" element={<SearchBar />} />
              <Route path={`/search/:symbol`} element={<SearchBar />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/portfolio" element={<Portfolio />} />
            </Routes>
          </BrowserRouter>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default App;
