import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Summary from "../components/Summary/Summary";
import moment from "moment";
import News from "../components/News/News";
import Charts from "../components/Charts/Charts";
import Insights from "../components/Insights/Insights";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
import BuyModal from "../components/Modals/BuyModal";
import SellModal from "../components/Modals/SellModal";
import { createTheme, ThemeProvider } from '@mui/material/styles'

import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

function SearchResult({ updateResult }) {

  //reference: https://mui.com/material-ui/customization/theming/#createtheme-options-args-theme
  const theme = createTheme({
    components: {
      MuiTab: {
        styleOverrides: {
          root:{
            "&.Mui-selected": {
              color:  '#2923af' 
            }
          }
        }
      }
    }
  })
  const { symbol } = useParams();
  const [loading, setLoading] = useState(true);
  const [marketStatus, setMarketStatus] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [summaryData, setSummaryData] = useState({});
  const [peersData, setPeersData] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [invalidTicker, setInvalidTicker] = useState(false);
  var currentDate = new Date();
  //hadnling the error for now on sunday. remove before pushing prod
  // currentDate.setDate(currentDate.getDate() - 1);
  var oneWeekAgoDate = new Date(currentDate);
  var twoYearsAgoDate = new Date(currentDate);
  var oneDayAgoDate = new Date(currentDate);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  currentDate = moment(currentDate).format("YYYY-MM-DD");

  oneWeekAgoDate.setDate(oneWeekAgoDate.getDate() - 7);
  oneWeekAgoDate = moment(oneWeekAgoDate).format("YYYY-MM-DD");

  twoYearsAgoDate.setFullYear(twoYearsAgoDate.getFullYear() - 2);
  twoYearsAgoDate = moment(twoYearsAgoDate).format("YYYY-MM-DD");

  oneDayAgoDate.setDate(oneDayAgoDate.getDate() - 1);
  oneDayAgoDate = moment(oneDayAgoDate).format("YYYY-MM-DD");

  const [newsData, setNewsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [insightsData, setInsightsData] = useState([]);
  const [recommendationData, setRecommendationData] = useState([]);
  const [epsData, setEpsData] = useState([]);
  const [summaryChartData, setSummaryChartData] = useState([]);
  const [watchlistedStock, setWatchlistedStock] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [buyAlert, setBuyAlert] = useState(false);
  const [sellAlert, setSellAlert] = useState(false);
  const [addToWatchlistAlert, setAddToWatchlistAlert] = useState(false);
  const [removeFromWatchlistAlert, setRemoveFromWatchlistAlert] =
    useState(false);
  const [enableSellButton, setEnableSellButton] = useState(false);

  const openBuyModal = () => {
    setShowBuyModal(true);
  };

  const closeBuyModal = () => {
    setShowBuyModal(false);
  };

  const openSellModal = () => {
    setShowSellModal(true);
  };

  const closeSellModal = () => {
    setShowSellModal(false);
  };

  async function findInPortfolio() {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_ADDRESS +
          `/api/v1/find-symbol-portfolio?symbol=${symbol}`
      );
      if (response.data) {
        setEnableSellButton(true);
        var savedData = JSON.parse(sessionStorage.getItem("savedData"));
        savedData[9].data = true;
        sessionStorage.setItem("savedData", JSON.stringify(savedData));
      } else {
        setEnableSellButton(false);
        var savedData = JSON.parse(sessionStorage.getItem("savedData"));
        savedData[9].data = false;
        sessionStorage.setItem("savedData", JSON.stringify(savedData));
      }
    } catch (e) {
      console.error("error checking in portfolio");
    }
  }

  async function findInWatchlist() {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_ADDRESS +
          `/api/v1/find-symbol-watchlist?symbol=${symbol}`
      );
      // console.log("checking in wacthlist", response.data)
      if (response.data) {
        setWatchlistedStock(true);
        var savedData = JSON.parse(sessionStorage.getItem("savedData"));
        savedData[7].data = true;
        sessionStorage.setItem("savedData", JSON.stringify(savedData));
      } else {
        setWatchlistedStock(false);
        var savedData = JSON.parse(sessionStorage.getItem("savedData"));
        savedData[7].data = false;
        sessionStorage.setItem("savedData", JSON.stringify(savedData));
      }
    } catch (e) {
      console.error("error checking in portfolio", e);
    }
  }

  

  const urls = [
    process.env.REACT_APP_API_ADDRESS +
      `/api/v1/stock/profile2?symbol=${symbol}`,
    process.env.REACT_APP_API_ADDRESS + `/api/v1/quote?symbol=${symbol}`,
    process.env.REACT_APP_API_ADDRESS + `/api/v1/stock/peers?symbol=${symbol}`,
    process.env.REACT_APP_API_ADDRESS +
      `/api/v1/company-news?symbol=${symbol}&from=${oneWeekAgoDate}&to=${currentDate}`,
    // process.env.REACT_APP_API_ADDRESS + `/api/v1/stock/chart?symbol=${symbol}&from=${twoYearsAgoDate}&to=${currentDate}`,
    process.env.REACT_APP_API_ADDRESS +
      `/api/v1/stock/insider-sentiment?symbol=${symbol}`,
    process.env.REACT_APP_API_ADDRESS +
      `/api/v1/stock/recommendation?symbol=${symbol}`,
    process.env.REACT_APP_API_ADDRESS +
      `/api/v1/stock/earnings?symbol=${symbol}`,
    // process.env.REACT_APP_API_ADDRESS + `/api/v1/stock/summary-chart?symbol=${symbol}&from=${oneDayAgoDate}&to=${currentDate}`,
    // process.env.REACT_APP_API_ADDRESS + `/api/v1/stock/summary-chart?symbol=${symbol}&from=2024-03-22&to=2023-03-21`,
    // process.env.REACT_APP_API_ADDRESS + `/api/v1/stock/summary-chart?symbol=X&from=2024-03-06&to=2024-03-07`,
    process.env.REACT_APP_API_ADDRESS +
      `/api/v1/find-symbol-watchlist?symbol=${symbol}`,
    process.env.REACT_APP_API_ADDRESS + "/api/v1/fetch-wallet",
    process.env.REACT_APP_API_ADDRESS +
      `/api/v1/find-symbol-portfolio?symbol=${symbol}`,
    // process.env.REACT_APP_API_ADDRESS +
    //   `/api/v1/stock/summary-chart?symbol=${symbol}&from=${oneDayAgoDate}&to=${currentDate}`,
    // process.env.REACT_APP_API_ADDRESS +
    //   `/api/v1/stock/chart?symbol=${symbol}&from=${twoYearsAgoDate}&to=${currentDate}`,
  ];

  function getDate(epoch) {
    var date;

    if (epoch !== undefined) {
      date = new Date(epoch * 1000);
    } else {
      date = new Date();
    }
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }

  async function getMarketStatus() {
    try {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const response = await axios.get(
        process.env.REACT_APP_API_ADDRESS + `/api/v1/quote?symbol=${symbol}`
      );
      const data = response.data;
      if (Object.keys(data).length === 0) {
        return false;
      }
      const marketTime = data.t;
      setMarketStatus(currentTime - marketTime <= 300);
      sessionStorage.setItem('marketStatus', currentTime - marketTime <= 300);
      return currentTime - marketTime <= 300;
    } catch (error) {
      console.error("Error fetching data:", error);
      return false; // Return false in case of error
    }
  }

  async function addToWatchList(symbol, name) {
    setWatchlistedStock(true);
    var savedData = JSON.parse(sessionStorage.getItem("savedData"));
    savedData[7].data = true;
    sessionStorage.setItem("savedData", JSON.stringify(savedData));
    addtoWatchlistAlertFunction();
    const obj = {
      symbol: symbol,
      name: name,
    };
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_ADDRESS + "/api/v1/save-watchlist",
        obj
      );
      // console.log(response.data);
    } catch (e) {
      console.error("error saving watchlist", e);
    }
  }

  async function removeFromWatchList(symbol) {
    setWatchlistedStock(false);
    var savedData = JSON.parse(sessionStorage.getItem("savedData"));
    savedData[7].data = false;
    sessionStorage.setItem("savedData", JSON.stringify(savedData));
    removeFromWatchlistAlertFunction();
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_ADDRESS +
          `/api/v1/delete-symbol-watchlist?symbol=${symbol}`
      );
    } catch (e) {
      console.error("error removing watchlist", e);
    }
  }

  function convertFixedDecimals(data) {
    for (let key in data) {
      if (typeof data[key] === "number" && key !== "t") {
        data[key] = parseFloat(data[key].toFixed(2));
      }
    }

    return data;
  }

  const handleBuySuccess = () => {
    findInPortfolio();
    setBuyAlert(true);
    setTimeout(() => {
      setBuyAlert(false);
    }, 5000);
  };

  const handleSellSuccess = () => {
    findInPortfolio();
    setSellAlert(true);
    setTimeout(() => {
      setSellAlert(false);
    }, 5000);
  };

  const addtoWatchlistAlertFunction = () => {
    setAddToWatchlistAlert(true);
    setTimeout(() => {
      setAddToWatchlistAlert(false);
    }, 5000);
  };

  const removeFromWatchlistAlertFunction = () => {
    setRemoveFromWatchlistAlert(true);
    setTimeout(() => {
      setRemoveFromWatchlistAlert(false);
    }, 5000);
  };

  async function fetchData() {
    const requests = urls.map((url) => axios.get(url));

    // try {
    //   const response = await axios.get(
    //     process.env.REACT_APP_API_ADDRESS + `/api/v1/find-symbol-portfolio?symbol=${symbol}`
    //   );
    //   if (response.data) {
    //     setEnableSellButton(true);
    //   } else {
    //     setEnableSellButton(false);
    //   }
    // } catch (e) {
    //   console.error("error checking in portfolio");
    // }
    
    

    Promise.all(requests)
      .then((responses) => {
        setInvalidTicker(false);
        setProfileData(responses[0].data);
        //converting to length 2 decimal
        setSummaryData(convertFixedDecimals(responses[1].data));
        setPeersData(responses[2].data);
        setNewsData(responses[3].data);

        setInsightsData(responses[4].data.data);
        setRecommendationData(responses[5].data);
        setEpsData(responses[6].data);
        setWatchlistedStock(responses[7].data);
        setWallet(responses[8].data.wallet);
        setEnableSellButton(responses[9].data);
        // setChartData(responses[10].data.results);
        setLoading(false);
        sessionStorage.setItem("savedData", JSON.stringify(responses));
      })
      .catch((error) => {
        console.error("error", error);
        setLoading(false);
      });

      getMarketStatus().then((reply) => {
        if(reply) {
          //setSummaryChartData as yesterday date to today date
          // console.log("market is open");
          axios.get(process.env.REACT_APP_API_ADDRESS +
            `/api/v1/stock/summary-chart?symbol=${symbol}&from=${oneDayAgoDate}&to=${currentDate}`)
            .then((response) => {
              setSummaryChartData(response.data.results);
              if(response.data.results) {
                sessionStorage.setItem("summaryChart", JSON.stringify(response.data.results));
              }
            })
            .catch((e) => {
              setSummaryChartData([]);
            })

            axios.get(process.env.REACT_APP_API_ADDRESS +
              `/api/v1/stock/chart?symbol=${symbol}&from=${twoYearsAgoDate}&to=${currentDate}`)
              .then((response) => {
                setChartData(response.data.results);
                if(response.data.results) {
                  sessionStorage.setItem("chartChart", JSON.stringify(response.data.results));
                }
              })
              .catch((e) => {
                setChartData([]);
              })
        } else {
          //setSummaryChartData as day before closing date to closing date
          axios.get(process.env.REACT_APP_API_ADDRESS + `/api/v1/quote?symbol=${symbol}`)
          .then((response) => {
            const time = response.data.t * 1000;
            var closingDate = new Date(time);
            var beforeClosingDate = new Date(time);
            beforeClosingDate.setDate(closingDate.getDate() - 1);
            closingDate = moment(closingDate).format("YYYY-MM-DD");
            beforeClosingDate = moment(beforeClosingDate).format("YYYY-MM-DD");
            // console.log("market is closed", beforeClosingDate, closingDate);
            axios.get(process.env.REACT_APP_API_ADDRESS +
              `/api/v1/stock/summary-chart?symbol=${symbol}&from=${beforeClosingDate}&to=${closingDate}`)
              .then((response) => {
                setSummaryChartData(response.data.results);
                if(response.data.results) {
                  sessionStorage.setItem("summaryChart", JSON.stringify(response.data.results));
                }
              })
              .catch((e) => {
                setSummaryChartData([]);
              })
            
              axios.get(process.env.REACT_APP_API_ADDRESS +
                `/api/v1/stock/chart?symbol=${symbol}&from=${twoYearsAgoDate}&to=${currentDate}`)
                .then((response) => {
                  setChartData(response.data.results);
                  if(response.data.results) {
                    sessionStorage.setItem("chartChart", JSON.stringify(response.data.results));
                  }
                })
                .catch((e) => {
                  setChartData([]);
                })
          })
        }
      })
  }

  async function fetchTickerData() {
    // console.log("this is called");
    const response = await axios.get(
      process.env.REACT_APP_API_ADDRESS + `/api/v1/quote?symbol=${symbol}`
    );
    setSummaryData(convertFixedDecimals(response.data));
  }

  const components = [
    <Summary
      summaryData={summaryData}
      profileData={profileData}
      peersData={peersData}
      chartData={summaryChartData}
      updateResult={updateResult}
    />,
    <News newsData={newsData} name={profileData.name} />,
    <Charts data={chartData} />,
    <Insights
      insightsData={insightsData}
      name={profileData.name}
      recommendationData={recommendationData}
      epsData={epsData}
    />
  ];


  useEffect(() => {
    setLoading(true);
    const savedData = JSON.parse(sessionStorage.getItem("savedData"));
    if (savedData && savedData[0].data.ticker === symbol) {
      // console.log(savedData);
      setProfileData(savedData[0].data);
      //converting to length 2 decimal
      setSummaryData(convertFixedDecimals(savedData[1].data));
      setPeersData(savedData[2].data);
      setNewsData(savedData[3].data);
      // setChartData(responses[4].data.results);
      setInsightsData(savedData[4].data.data);
      setRecommendationData(savedData[5].data);
      setEpsData(savedData[6].data);
      // setSummaryChartData(savedData[10].data.results);
      const summaryChartCached = JSON.parse(sessionStorage.getItem("summaryChart"));
      summaryChartCached ? setSummaryChartData(summaryChartCached) : setSummaryChartData([]);
      // setSummaryChartData(JSON.parse(sessionStorage.getItem("summaryChart")))
      setWatchlistedStock(savedData[7].data);
      setWallet(savedData[8].data.wallet);
      setEnableSellButton(savedData[9].data);
      const chartsChartCached = JSON.parse(sessionStorage.getItem("chartChart"));
      chartsChartCached ? setChartData(chartsChartCached) : setChartData([]);
      setMarketStatus(JSON.parse(sessionStorage.getItem("marketStatus")))
      // setChartData(JSON.parse(sessionStorage.getItem("chartChart")));
      findInPortfolio();
      findInWatchlist();
      getMarketStatus();
      setLoading(false);
    } else {
      try {
        axios
          .get(
            process.env.REACT_APP_API_ADDRESS +
              `/api/v1/stock/profile2?symbol=${symbol}`
          )
          .then((response) => {
            if (Object.keys(response.data).length === 0) {
              setLoading(false);
              setInvalidTicker(true);
            } else {
              fetchData();
            }
          });
      } catch (e) {
        console.error("error");
      }
    }

    const interval = setInterval(async function () {
      if (!(await getMarketStatus())) {
        console.log("clearing the interval here");
        // setMarketStatus(false);
        // clearInterval(interval);
      } else {
        // console.log("performing ticker data fetching");
        // setMarketStatus(true);
        fetchTickerData();
      }
    }, 15000);

    return () => {
      // console.log("clearing the interval");
      clearInterval(interval);
    };
  }, [symbol]);

  return (
    <>
      <div className="container text-center mt-3 col-lg-12">
        {addToWatchlistAlert && (
          <div
            className="alert alert-success d-flex justify-content-between align-items-center"
            role="alert"
          >
            <span></span>
            <span>{`${profileData.ticker} added to watchlist`}</span>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setAddToWatchlistAlert(false)}
            ></button>
          </div>
        )}

        {removeFromWatchlistAlert && (
          <div
            className="alert alert-danger d-flex justify-content-between align-items-center"
            role="alert"
          >
            <span></span>
            <span>{`${profileData.ticker} removed from watchlist`}</span>

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setRemoveFromWatchlistAlert(false)}
            ></button>
          </div>
        )}

        {buyAlert && (
          <div
            className="alert alert-success d-flex justify-content-between align-items-center"
            role="alert"
          >
            <span></span>
            <span>{`${profileData.ticker} bought successfully`}</span>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setBuyAlert(false)}
            ></button>
          </div>
        )}

        {sellAlert && (
          <div
            className="alert alert-danger d-flex justify-content-between align-items-center"
            role="alert"
          >
            <span></span>
            <span>{`${profileData.ticker} sold successfully`}</span>

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setSellAlert(false)}
            ></button>
          </div>
        )}
        {loading ? (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : invalidTicker ? (
          <div className="alert alert-danger" role="alert">
            This ticker is invalid. Please enter a valid ticker.
          </div>
        ) : (
          <>
            <div className="row">
              {/* {console.log('this is called', newsData)} */}
              <div className="col-4">
                <div className="d-flex align-items-center justify-content-center fs-2">
                  <span>{profileData.ticker}</span>
                  {watchlistedStock ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-star-fill"
                      viewBox="0 0 16 16"
                      onClick={() => removeFromWatchList(profileData.ticker)}
                      style={{
                        color: "#f9df39",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-star"
                      viewBox="0 0 16 16"
                      onClick={() =>
                        addToWatchList(profileData.ticker, profileData.name)
                      }
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                    >
                      <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                    </svg>
                  )}
                </div>
                <h4 style={{ color: "#738196" }}>{profileData.name}</h4>
                <p style={{ fontSize: "13px" }}>{profileData.exchange}</p>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={openBuyModal}
                    style={{ marginRight: "10px" }}
                  >
                    Buy
                  </button>
                  {showBuyModal && (
                    <BuyModal
                      symbol={profileData.ticker}
                      name={profileData.name}
                      currentPrice={summaryData.c}
                      closeBuyModal={closeBuyModal}
                      wallet={wallet}
                      onBuySuccess={handleBuySuccess}
                    />
                  )}
                  {enableSellButton && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={openSellModal}
                    >
                      Sell
                    </button>
                  )}
                  {showSellModal && (
                    <SellModal
                      symbol={profileData.ticker}
                      name={profileData.name}
                      currentPrice={summaryData.c}
                      closeSellModal={closeSellModal}
                      onSellSuccess={handleSellSuccess}
                    />
                  )}
                </div>
              </div>
              <div className="col-4">
                <img
                  src={profileData.logo}
                  className="img-fluid"
                  alt="Company Logo"
                  style={{ maxHeight: "90px", maxWidth: "90px" }}
                />
              </div>
              <div
                className="col-4"
                style={{ color: summaryData.d >= 0 ? "green" : "red" }}
              >
                <div className="fs-3">{summaryData.c}</div>
                <div style={{ fontSize: "18px" }}>
                  {summaryData.d >= 0 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-caret-up-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-caret-down-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg>
                  )}
                  {summaryData.d} {`(${summaryData.dp}%)`}
                </div>
                <div
                  style={{
                    color: "black",
                    fontSize: "11px",
                    fontWeight: "lighter",
                  }}
                >
                  {getDate()}
                </div>
              </div>
            </div>
            {marketStatus ? (
              <div style={{ color: "green", marginTop: "10px", marginBottom: '20px' }}>
                Market is open
              </div>
            ) : (
              <div style={{ color: "red", marginTop: "10px", marginBottom: '20px' }}>
                Market Closed on {getDate(summaryData.t)}
              </div>
            )}


            {/* reference https://mui.com/material-ui/react-tabs/ */}
             
<ThemeProvider theme={theme}>
<Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable auto tabs example"
            sx={{ '& .MuiTabs-indicator': { backgroundColor: '#2923af' }}}
          >
              <Tab label="Summary" sx={{ flex: 1 }} />
                <Tab label="Top News" sx={{ flex: 1, whiteSpace: 'nowrap' }} />
                <Tab label="Charts" sx={{ flex: 1}} />
                <Tab label="Insights" sx={{ flex: 1 }} />
          </Tabs>
          </ThemeProvider>

            
            <div style={{marginTop: '20px'}}>
            {components[value]}
          </div>
            
          </>
        )}
      </div>
    </>
  );
}

export default SearchResult;
