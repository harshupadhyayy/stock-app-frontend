import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer" style={{ marginTop: "20px" }}>
      <div className="container text-center">
        Powered by{" "}
        <a href="https://finnhub.io" target="_blank">
          Finnhub.io
        </a>
      </div>
    </footer>
  );
}

export default Footer;
