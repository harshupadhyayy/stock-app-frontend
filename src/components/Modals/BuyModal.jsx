import React, { useEffect, useState } from "react";
import axios from "axios";

function BuyModal({ symbol, currentPric, closeBuyModal, name, onBuySuccess}) {
  const [quantity, setQuantity] = useState(0);
  const [disableBuyButton, setDisableBuyButton] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);

  function handleQuantityUpdate(event) {
    const { value } = event.target;
    if (value === "") {
      setQuantity(0);
    } else {
      setQuantity(parseInt(value));
    }
  }

  useEffect(() => {
    async function getCurrentWalletValue() {
      try {
        const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/api/v1/fetch-wallet");
      // console.log(response.data.wallet);
      setWallet(response.data.wallet);
      const data = await axios.get(process.env.REACT_APP_API_ADDRESS + `/api/v1/quote?symbol=${symbol}`)
      // console.log(data);
      setCurrentPrice(parseFloat(data.data.c.toFixed(2)));
      setLoading(false);
      } catch(e) {
        // console.error("error fetchign wallet");
        setLoading(false);
      }
    }
  
    getCurrentWalletValue();
  }, [])

  useEffect(() => {
    if(quantity <= 0) {
      setDisableBuyButton(true);
    } else {
      setDisableBuyButton(false);
    }
    if(currentPrice * quantity >= wallet) {
      setShowMessage(true);
      setDisableBuyButton(true);
    } else {
      setShowMessage(false);
      // setDisableBuyButton(false);
    }
  }, [quantity, wallet])

  async function buyStock() {
    closeBuyModal();
    var obj = {
      symbol: symbol,
      name: name,
      totalPrice: parseFloat((quantity * currentPrice).toFixed(2)),
      quantity: parseFloat(quantity),
    };

    // console.log(obj);
    try {
      const data = await axios.get(
        process.env.REACT_APP_API_ADDRESS + `/api/v1/find-symbol-portfolio?symbol=${symbol}`
      );
      const boughtStock = data.data;
      const updateWallet = await axios.post(process.env.REACT_APP_API_ADDRESS + "/api/v1/update-wallet", {amount: wallet - obj.totalPrice})
      if (boughtStock) {
        // console.log("this stock is present in db", boughtStock);
        const newTotalPrice = boughtStock.totalPrice + obj.totalPrice;
        const newQuantity = boughtStock.quantity + obj.quantity;
        obj.totalPrice = newTotalPrice;
        obj.quantity = newQuantity;
        // console.log("onbject going in db is", obj);
        const response = await axios.put(
          process.env.REACT_APP_API_ADDRESS + `/api/v1/buy-symbol-update`,
          obj
        );
      } else {
        // console.log("this stock is not prsent in db");
        const response = await axios.post(
          process.env.REACT_APP_API_ADDRESS + "/api/v1/buy-symbol",
          obj
        );
      }
      onBuySuccess();
    } catch (e) {
      console.error("error saving watchlist", e);
    }
    
  }


  //reference https://getbootstrap.com/docs/5.3/components/modal/
  return (
    <>
    {loading ? null : (<div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        data-backdrop="static"
        style={{ display: "block" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {symbol}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeBuyModal}
              ></button>
            </div>
            <div className="modal-body d-flex flex-column align-items-start">
              <div>Current Price: {currentPrice}</div>
              <div>Money in wallet: ${wallet.toFixed(2)}</div>
              <div className="d-flex flex-row align-items-center w-100">
                <span>Quantity: </span>{" "}
                <input className="form-control" style={{width: '100%'}} type="number" onChange={handleQuantityUpdate} />{" "}
                
              </div>
              {disableBuyButton && showMessage && <p style={{color: 'red'}}>Not enough money in wallet!!</p>}
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <span>Total: ${(currentPrice * quantity).toFixed(2)} </span>
              {disableBuyButton ? (<button type="button" className="btn btn-success" onClick={buyStock} disabled>
                Buy
              </button>) : (<button type="button" className="btn btn-success" onClick={buyStock}>
                Buy
              </button>)}
              
            </div>
          </div>
        </div>
      </div>)}
      
    </>
  );
}

export default BuyModal;
