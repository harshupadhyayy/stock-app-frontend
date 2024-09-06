import { Link, useNavigate } from "react-router-dom";
import SummaryChart from "./SummaryChart";

function Summary(props) {
  // console.log(props.chartData, "this is chart data for summary");
  const filteredData = props.peersData.filter(
    (item) => !item.includes(".")
  );

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6 col-sm-6">
            <div className="row">
            <div className="col-md-6 col-sm-6" style={{fontSize: "15px"}}>
              <div><strong>High Price:</strong>  {props.summaryData.h}</div>
              <div><strong>Low Price:</strong> {props.summaryData.l}</div>
              <div><strong>Open Price: </strong> {props.summaryData.o}</div>
              <div><strong>Prev. Close: </strong> {props.summaryData.pc}</div>
            </div>
            <span className="col-md-6 col-sm-6"></span>
            </div>
            

            <div style={{fontSize: "13px", marginTop: "50px"}}>
              <div style={{ textDecoration: "underline" }}>
                <div style={{fontSize: "20px"}}>About the company</div>
              </div>
              <div className="mt-4"><strong>IPO Start Date: </strong> {props.profileData.ipo}</div>
              <div className="mt-2"><strong>Industry: </strong>{props.profileData.finnhubIndustry}</div>
              <div className="mt-2">
                <strong>Webpage: </strong>
                <a href={props.profileData.weburl}>
                  {props.profileData.weburl}
                </a>
              </div>
              <div className="mt-2"><strong>Company Peers: </strong></div>
              <div className="mt-2 d-flex flex-wrap justify-content-center">
                {filteredData ? (
                  
                  filteredData.map((peer, idx) => (
                    <li key={idx}
                      onClick={() => props.updateResult(peer)}
                      style={{
                        listStyle: "none",
                        marginRight: "5px",
                        textDecoration: "underline",
                        color: "blue",
                      }}
                      onMouseEnter={(e) => (e.target.style.cursor = "pointer")} // Change cursor on hover
                      onMouseLeave={(e) => (e.target.style.cursor = "default")}
                    >
                      {peer}
                    </li>
                  ))) : (<div className="alert alert-warning text-center" role="alert">
                  No peers found
                </div>)
                  }
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6">
            <SummaryChart
              data={props.chartData}
              colorFlag={props.summaryData.d >= 0}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Summary;
