import React, { useEffect, useState } from "react";
import axios from "axios";

function SellModal({ symbol, currentPric, closeSellModal, name, onSellSuccess }) {
  const [quantity, setQuantity] = useState(0);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [disableSellButton, setDisableSellButton] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
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
      const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/api/v1/fetch-wallet")
      setWallet(response.data.wallet);
    }
  
    getCurrentWalletValue();
  
    async function getStockQuantity() {
      try {
        const response = await axios.get(process.env.REACT_APP_API_ADDRESS + `/api/v1/find-symbol-portfolio?symbol=${symbol}`)
      setAvailableQuantity(response.data.quantity);
      const data = await axios.get(process.env.REACT_APP_API_ADDRESS + `/api/v1/quote?symbol=${symbol}`)
      // console.log(data);
      setCurrentPrice(parseFloat(data.data.c.toFixed(2)));
      setLoading(false);
      } catch(e) {
        console.error("error");
      }
      
    }
  
    getStockQuantity()
  })
  useEffect(() => {
    if(quantity <= 0) {
      setDisableSellButton(true)
    } else {
      setDisableSellButton(false);
    }
    if(quantity > availableQuantity) {
      setDisableSellButton(true);
      setShowMessage(true);
    } else {
      // setDisableSellButton(false);
      setShowMessage(false);
    }

  }, [wallet, availableQuantity, quantity])

  async function sellStock() {
    closeSellModal();
    var obj = {
      symbol: symbol,
      name: name,
      totalPrice: parseFloat((quantity * currentPrice).toFixed(2)),
      quantity: parseFloat(quantity).toFixed(2),
    };
    try {
      const data = await axios.get(
        process.env.REACT_APP_API_ADDRESS + `/api/v1/find-symbol-portfolio?symbol=${symbol}`
      );
      const boughtStock = data.data;
      const updateWallet = await axios.post(process.env.REACT_APP_API_ADDRESS + "/api/v1/update-wallet", {amount: wallet + obj.totalPrice})
      // if (boughtStock) {
        // console.log("this stock is present in db", boughtStock);
        const newTotalPrice = boughtStock.totalPrice - obj.totalPrice;
        const newQuantity = boughtStock.quantity - obj.quantity;
        obj.totalPrice = newTotalPrice;
        obj.quantity = newQuantity;
        if(obj.quantity === 0) {
          // console.log(`api is http://localhost:3000/api/v1/symbol-delete?symbol=${obj.symbol}`);
          const reponse = await axios.delete(process.env.REACT_APP_API_ADDRESS + `/api/v1/symbol-delete?symbol=${obj.symbol}`)
        } else {
          const response = await axios.put(
            process.env.REACT_APP_API_ADDRESS + `/api/v1/buy-symbol-update`,
            obj
          );
        }
        onSellSuccess();
      // }
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
                onClick={closeSellModal}
              ></button>
            </div>
            <div className="modal-body">
              <p>Current Price: {currentPrice}</p>
              <p>Money in wallet: {wallet.toFixed(2)}</p>
              <div className="d-flex flex-row align-items-center">
                <span>Quantity: </span>{" "}
                <input className="form-control" type="number" onChange={handleQuantityUpdate} />{" "}
                
              </div>
              {disableSellButton && showMessage && <p style={{color: 'red'}}>You cannot sell the stocks you don't have!</p>}
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <span>Total: ${currentPrice * quantity} </span>
              {disableSellButton ? (<button type="button" className="btn btn-danger" onClick={sellStock} disabled>
                Sell
              </button>) : (<button type="button" className="btn btn-danger" onClick={sellStock}>
                Sell
              </button>)}
            </div>
          </div>
        </div>
      </div>)}
    </>
  );
}

export default SellModal;
