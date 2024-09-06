import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import './watchlist.css'

function Watchlist() {
  const [tickerData, setTickerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = process.env.REACT_APP_API_ADDRESS + `/api/v1/fetch-watchlist`;
  const stockDataUrl = process.env.REACT_APP_API_ADDRESS + "/api/v1/quote?symbol=";
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    async function fetchTickers() {
      try {
        const response = await axios.get(url);
        const requests = response.data.map((item) =>
          axios.get(stockDataUrl + item.symbol)
        );
        const tickerDataObject = response.data.reduce((acc, _, index) => {
          acc[index] = { data: null, details: response.data[index] };
          return acc;
        }, []);

        Promise.all(requests)
          .then((responses) => {
            const responseData = responses.map((res, index) => {
              const { data } = res;
              tickerDataObject[index].data = data;
              return data;
            });
            setTickerData(tickerDataObject);
            setLoading(false);
          })
          .catch((error) => {
            console.error("error", error);
            setLoading(false);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
    fetchTickers();
  }, []);

  async function handleDeletion(event, index) {
    event.stopPropagation();

    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_ADDRESS + `/api/v1/delete-symbol-watchlist?symbol=${tickerData[index].details.symbol}`
      );
    } catch (e) {
      console.error("error deleting from watchlist", e);
    }
    const updatedTickerData = [...tickerData];
    updatedTickerData.splice(index, 1);
    setTickerData(updatedTickerData);
  }

  return (
    <>
      <div className="container mt-3 col-md-8">
      <h1>My Watchlist</h1>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          </div>
        ) : (
          <div>
            {tickerData.length > 0 ? (
              <div className="row row-cols-1" style={{marginLeft: '5px', marginRight: '5px'}}>
                {tickerData.map((item, idx) => (
                  <div key={idx} className="card mt-4" onClick={() => navigate(`/search/${item.details.symbol}`)}>
                    <div className="card-body">
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={(e) => handleDeletion(e, idx)}
                        style={{
                          position: "relative",
                          top: "-10px",
                          right: "0",
                          zIndex: "1",
                          height: "3px",
                          width: "3px",
                        }}
                      ></button>
                      <div className="row">
                        <div className="col">
                          <h5 className="card-title">{item.details.symbol}</h5>
                          <p className="card-text">{item.details.name}</p>
                        </div>
                        <div
                          className="col"
                          style={{ color: item.data.d >= 0 ? "green" : "red" }}
                        >
                          <h5 className="card-title">{item.data.c}</h5>
                          <p className="card-text">
                            {" "}
                            {item.data.d >= 0 ? (
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
                            {item.data.d.toFixed(2)}{" "}
                            {`(${item.data.dp.toFixed(2)}%)`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-warning text-center" role="alert">
                Currently you don't have any stock in your watchlist.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Watchlist;
