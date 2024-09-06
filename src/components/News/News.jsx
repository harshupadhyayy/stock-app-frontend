import React, { useState } from "react";
import NewsModal from "./NewsModal";
import './news.css'

function News(props) {
  const [selectedNews, setSelectedNews] = useState(null);

  const newsData = props.newsData
    .filter(
      (item) =>
        item.image && item.url && item.headline && item.datetime !== undefined
    )
    .slice(0, 20);

  const openModal = (news) => {
    setSelectedNews(news);
  };

  const closeModal = () => {
    setSelectedNews(null);
  };

  return (
    <>
      <div>
        {newsData.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {newsData.map((news, index) => (
              <div className="col" key={index}>
                <div className="card h-100" onClick={() => openModal(news)}>
                  <div className="card-body d-flex align-item-center justify-content-center">
                    <div className="row">
                      <div className="col-md-4 d-flex">
                        <img
                          src={news.image}
                          className="img-fluid mb-md-0 mb-3"
                          alt="Thumbnail"
                        />
                      </div>
                      <div className="col-md-8 d-flex align-items-center">
                        <p className="card-title text-center mb-0">
                          {news.headline}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-warning text-center" role="alert">
            No news found
          </div>
        )}
      </div>

      {selectedNews && (
        <div className="overlay"><NewsModal news={selectedNews} onClose={closeModal} name={props.name} /></div>
      )}
    </>
  );
}

export default News;
