import axios from "axios";
import { useEffect, useState } from "react";
import BuyModal from "../components/Modals/BuyModal";
import SellModal from "../components/Modals/SellModal";
import "./portfolio.css";

function Portfolio() {
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [wallet, setWallet] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [buyAlert, setBuyAlert] = useState(false);
  const [sellAlert, setSellAlert] = useState(false);
  const [dummy, setDummy] = useState(0);

  const openBuyModal = (item) => {
    setSelectedItem(item);
    setShowBuyModal(true);
  };

  const closeBuyModal = () => {
    setShowBuyModal(false);
  };

  const openSellModal = (item) => {
    setSelectedItem(item);
    setShowSellModal(true);
  };

  const closeSellModal = () => {
    setShowSellModal(false);
  };

  function convertFixedDecimals(data) {
    for (let key in data) {
      if (typeof data[key] === "number" && key !== "t") {
        data[key] = parseFloat(data[key].toFixed(2));
      }
    }

    return data;
  }

  const handleBuySuccess = () => {
    setDummy((prevCount) => prevCount + 1);
    setBuyAlert(true);
    setTimeout(() => {
      setBuyAlert(false);
    }, 5000);
  };

  const handleSellSuccess = () => {
    setDummy((prevCount) => prevCount + 1);
    setSellAlert(true);
    setTimeout(() => {
      setSellAlert(false);
    }, 5000);
  };

  useEffect(() => {
    setLoading(true);
    async function getPortfolioData() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_ADDRESS + "/api/v1/fetch-portfolio"
        );

        const fetchedData = response.data;

        const requests = fetchedData.map((item) =>
          axios.get(process.env.REACT_APP_API_ADDRESS + `/api/v1/quote?symbol=${item.symbol}`)
        );

        Promise.all(requests).then((responses) => {
          const updatedData = fetchedData.map((item, index) => {
            
            return {
              ...item,
              details: convertFixedDecimals(responses[index].data), 
            };
          });
          setPortfolioData(updatedData);
          axios
            .get(process.env.REACT_APP_API_ADDRESS + "/api/v1/fetch-wallet")
            .then((walletResponse) => {
              setWallet(walletResponse.data.wallet);
              setLoading(false);
            })
            .catch((e) => {
              console.error("error ffetching");
              setLoading(false);
            });
        });
      } catch (e) {
        console.error("error fetching", e);
        setLoading(false);
      }
    }

    getPortfolioData();
  }, [dummy]);

  return (
    <>
      <div className="portfolio container mt-3 col-md-8">
        {buyAlert && (
          <div
            className="alert alert-success d-flex justify-content-between align-items-center"
            role="alert"
          >
            <span></span>
            <span>{`${selectedItem.symbol} bought successfully`}</span>
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
            <span>{`${selectedItem.symbol} sold successfully`}</span>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setSellAlert(false)}
            ></button>
          </div>
        )}

        <h1>My Portfolio</h1>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div>
            <h3>Money in Wallet: ${wallet.toFixed(2)}</h3>
            {portfolioData.length > 0 ? (
              <div className="row row-cols-1">
                {portfolioData.map((item, idx) => (
                  <div
                    className="card mt-4 mycard"
                    key={idx}
                    onMouseEnter={(e) => (e.target.style.cursor = "default")}
                    onMouseLeave={(e) => (e.target.style.cursor = "default")}
                  >
                    <div className="card-header">
                      <div className="card-title row align-items-center">
                        <div className="col-auto h3" style={{marginRight: '10px', marginBottom: '0px'}}>{item.symbol}</div>
                        <div className="col" style={{color: "grey"}}>{item.name}</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col">
                              <p className="card-text">Quantity:</p>
                              <p className="card-text">Avg. Cost / Share:</p>
                              <p className="card-text">Total Cost:</p>
                            </div>
                            <div className="col">
                              <p className="card-text">{item.quantity}</p>
                              <p className="card-text">
                                {(item.totalPrice / item.quantity).toFixed(2)}
                              </p>
                              <p className="card-text">{item.totalPrice}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col">
                              <p className="card-text">Change:</p>
                              <p className="card-text">Current Price:</p>
                              <p className="card-text">Market Value:</p>
                            </div>
                            <div
                              className="col"
                              style={{
                                color:
                                  item.details.c -
                                    (item.totalPrice / item.quantity).toFixed(
                                      2
                                    ) >=
                                  0
                                    ? item.details.c -
                                        (
                                          item.totalPrice / item.quantity
                                        ).toFixed(2) ==
                                      0
                                      ? "black"
                                      : "green"
                                    : "red",
                              }}
                            >
                              <p className="card-text">
                                {item.details.c -
                                  (item.totalPrice / item.quantity).toFixed(
                                    2
                                  ) >=
                                0 ? (
                                  item.details.c -
                                    (item.totalPrice / item.quantity).toFixed(
                                      2
                                    ) ===
                                  0 ? null : (
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
                                  )
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

                                {(
                                  (item.details.c * item.quantity).toFixed(2) -
                                  item.totalPrice
                                ).toFixed(2)}
                              </p>
                              <p className="card-text">{item.details.c}</p>
                              <p className="card-text">
                                {(item.details.c * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => openBuyModal(item)}
                        style={{ marginRight: "10px" }}
                      >
                        Buy
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => openSellModal(item)}
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-warning text-center" role="alert">
                Currently you don't have any stock.
              </div>
            )}
          </div>
        )}
      </div>
      {showBuyModal && selectedItem && (
        <BuyModal
          symbol={selectedItem.symbol}
          name={selectedItem.name}
          currentPrice={selectedItem.details.c}
          closeBuyModal={closeBuyModal}
          wallet={wallet}
          onBuySuccess={handleBuySuccess}
        />
      )}

      {showSellModal && selectedItem && (
        <SellModal
          symbol={selectedItem.symbol}
          name={selectedItem.name}
          currentPrice={selectedItem.details.c}
          closeSellModal={closeSellModal}
          onSellSuccess={handleSellSuccess}
        />
      )}
    </>
  );
}

export default Portfolio;
