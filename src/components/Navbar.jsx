import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const location = useLocation();
  const data = JSON.parse(sessionStorage.getItem("savedData"));
  const navigate = useNavigate();

  const handleClick = () => {
    sessionStorage.removeItem("savedData");
    sessionStorage.removeItem('summaryChart');
    sessionStorage.removeItem('chartChart');
    sessionStorage.removeItem("marketStatus");
    navigate("/");
  };


  //reference https://getbootstrap.com/docs/5.0/components/navbar/
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#2923af" }}
    >
      <div className="container-fluid">
        <span
          className="navbar-brand text-white"
          style={{ marginLeft: "30px" }}
          onClick={() => handleClick()}
          onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
          onMouseLeave={(e) => (e.target.style.cursor = "default")}
        >
          Stock Search
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ marginLeft: "0px", marginBottom: "5px", marginRight: "5px" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              {data ? (
                <Link
                  className={`nav-link ${
                    location.pathname.startsWith("/search") ? "selected" : ""
                  }`}
                  to={`/search/${data[0].data.ticker}`}
                >
                  Search
                </Link>
              ) : (
                <Link
                  className={`nav-link ${
                    location.pathname.startsWith("/search") ? "selected" : ""
                  }`}
                  to="/search/home"
                >
                  Search
                </Link>
              )}
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/watchlist" ? "selected" : ""
                }`}
                to="/watchlist"
              >
                Watchlist
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/portfolio" ? "selected" : ""
                }`}
                to="/portfolio"
              >
                Porfolio
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
