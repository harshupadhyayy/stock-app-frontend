import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import moment from "moment";

function NewsModal({ news, onClose, name }) {
  const formattedDate = moment(news.datetime * 1000).format("Do MMMM, YYYY");
  //reference https://getbootstrap.com/docs/5.3/components/modal/
  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      role="dialog"
      data-backdrop="static"
      style={{ display: "block" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content" style={{textAlign: 'start'}}>
          <div className="d-flex justify-content-between modal-header">
            <div className="col">
              <h3 className="modal-title">{name}</h3>
              <p style={{color: 'grey', fontSize: '12px'}}> {formattedDate}</p>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => onClose()}
              style={{fontSize: '7px'}}
            ></button>
          </div>
          <div className="modal-body">
            <h6>{news.headline}</h6>
            <div style={{fontSize: "12px"}}>{news.summary}</div>
            <div style={{fontSize: "12px", color: 'grey'}}>For more details click <a href={news.url} target="_blank" rel="noopener noreferrer">
              here
            </a></div>
          </div>
          <div
            style={{
              height: "120px",
              width: "95%",
              border: "0.5px solid grey",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: 'center',
              textAlign: 'start',
              margin: "0 auto",
              marginBottom: "15px"
            }}
            className="d-flex"
          >
            <div style={{marginLeft: '20px'}}>
            <div style={{marginBottom: "10px"}}>Share</div>
            <div>
              <a
                className="twitter-share-button"
                href={`https://twitter.com/intent/tweet?text=${news.headline}%20${news.url}`}
                target="_blank"
                style={{ color: "black", fontSize: "40px", marginRight: "15px" }}
              >
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a
                targetName="_blank"
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  news.url
                )}&amp;src=sdkpreparse`}
                className="fb-xfbml-parse-ignore"
                style={{ fontSize: "40px" }}
              >
                <FontAwesomeIcon icon={faSquareFacebook} />
              </a>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsModal;
