import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./searchbar.css";
import SearchResult from "../pages/SearchResult";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


function SearchBar() {
  const { symbol } = useParams() || "";
  const [query, setQuery] = useState(symbol || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [abortController, setAbortController] = useState(new AbortController());
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }
  //abort reference taken from chatgpt
  
  useEffect(() => {
    // console.log("this is called", query);
    // setQuery(symbol);
  }, [symbol]);

  const handleResults = (selectedSymbol) => {
    setQuery(selectedSymbol);
    setResults([]);
    navigate(`/search/${selectedSymbol}`);
  };

  const clearData = (e) => {
    // sessionStorage.removeItem("savedData");
    // navigate("/search/home");
    // setQuery("");
    // setResults([]);

    // console.log("query is", query);
    sessionStorage.removeItem('savedData');
    sessionStorage.removeItem('summaryChart');
    sessionStorage.removeItem('chartChart');
    sessionStorage.removeItem("marketStatus");
    setResults([]);
    setQuery("");
    e.preventDefault();
    abortController.abort();
    setLoading(false);
    const newAbort = new AbortController();
    setAbortController(newAbort);
    navigate('/search/home')
  };

  function handleInput(value) {
    setQuery(value);
    if(value === "") {
      setResults([]);
      setLoading(false);
    } else {
      getData(value);
    }
  }

  function getData(value) {
      setLoading(true);
      fetch(process.env.REACT_APP_API_ADDRESS + `/api/v1/search?q=${value}`, { signal: abortController.signal })
        .then((response) => response.json())
        .then((data) => {
          const filteredData = data.result.filter(
            (item) => !item.displaySymbol.includes(".")
          );
          setResults(filteredData);
          setLoading(false);
        })
        .catch((error) => {
          // console.error("Error fetching data:", error);
          setLoading(false);
        });
  }

  function submitClicked(e) {
    if(query === "" || query.trim() === "") {
      navigate('/search/home')
      clearData(e);
    } else {
      // console.log("query is", query);
    sessionStorage.removeItem('savedData');
    sessionStorage.removeItem('summaryChart');
    sessionStorage.removeItem('chartChart');
    setResults([]);
    e.preventDefault();
    abortController.abort();
    setLoading(false);
    const newAbort = new AbortController();
    setAbortController(newAbort);
    navigate(`/search/${query.trim()}`)
    }
  }


  // useEffect(() => {

  // }, [query, symbol]);

  return (
    <>
    <div className="container text-center" style={{ marginTop: "40px" }}>
      {/* <Box sx={{ width: '100%', typography: 'body1' }}>
  <TabContext value={value}>
    <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
      <TabList
        onChange={handleChange}
        aria-label="lab API tabs example"
        sx={{ flex: 1, display: 'flex' }}
      >
        <Tab label="Item One" value="1" sx={{ flex: 1 }} />
        <Tab label="Item Two" value="2" sx={{ flex: 1 }} />
        <Tab label="Item Three" value="3" sx={{ flex: 1 }} />
        <Tab label="Item Three" value="3" sx={{ flex: 1 }} />
      </TabList>
    </Box>
    <TabPanel value="1">Item One</TabPanel>
    <TabPanel value="2">Item Two</TabPanel>
    <TabPanel value="3">Item Three</TabPanel>
  </TabContext>
</Box> */}

      <div className="h2">STOCK SEARCH</div>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div
            className="input-group mb-3 mt-3 d-flex align-items-center"
            style={{
              border: "3px solid #2728b3",
              borderRadius: "25px",
              height: "50px"
            }}
          >
            <input
              type="search"
              className="form-control border-0 rounded-start"
              aria-label="Search"
              aria-describedby="search-addon"
              placeholder="Enter stock ticker symbol"
              value={query}
              onChange={(e) => handleInput(e.target.value.toUpperCase())}
              style={{
                flex: "1",
                border: "none",
                outline: "none",
                boxShadow: "none",
                height: "30px",
                marginLeft: "5px",
              }}
            />
            <span 
              className="input-group-text bg-transparent border-0"
              onClick={(e) => submitClicked(e)}
            >
              <FontAwesomeIcon
                icon={faSearch}
                onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
                onMouseLeave={(e) => (e.target.style.cursor = "default")}
              />
            </span>
            <button
              className="btn btn-close"
              type="button"
              aria-label="Close"
              style={{ marginRight: "10px", border: 'none', boxShadow: 'none' }}
              onClick={clearData}
            ></button>
          </div>

            <div className="position-relative">
              <div className="result-container d-flex flex-column align-items-start"
              style={{top: '-30px', zIndex: '100'}}>
                <ul
                  className={`list-group ${results.length && "myclass"} ${
                    results.length > 5 ? "scrollable" : ""
                  }`
                }

                style={{width: '60%', marginLeft: '10%'}}
                >
                  {loading ? (
                    <li className="list-group-item d-flex align-items-start">
                      <div className="spinner-container">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </li>
                  ) : (
                    results.length > 0 &&
                    results.map((result, idx) => (
                      <li
                        className="list-group-item special"
                        key={idx}
                        onClick={() => handleResults(result.symbol)}
                        style={{textAlign: 'start'}}
                      >
                        {result.symbol} | {result.description}
                      </li>
                    ))
                  )}
                  {query !== "" &&
                    results.length === 0 &&
                    !loading &&
                    query !== symbol && (
                      <li className="list-group-item">Result not found</li>
                    )}
                </ul>
              </div>
            </div>
        </div>
      </div>
      {symbol && <SearchResult updateResult={handleResults} />}
      <style jsx="true">{`
    input[type="search"]::-webkit-search-cancel-button {
        display: none;
    }
`}</style>
    </div>
  </>
  );
}

export default SearchBar;
