import InsightsEps from "./InsightsEps";
import InsightsStackChart from "./InsightsStackChart";
import InsightsTable from "./InsightsTable";

function Insights(props) {
  const data = props.insightsData;
  const name = props.name;
  var tableData = {
    totalMSPR: 0,
    posMSPR: 0,
    negMSPR: 0,
    totalChange: 0,
    posChange: 0,
    negChange: 0,
  };

  if (data.length > 0) {
    data.forEach((obj) => {
      tableData.totalMSPR += obj.mspr;
      if (obj.mspr > 0) tableData.posMSPR += obj.mspr;
      else if (obj.mspr < 0) tableData.negMSPR += obj.mspr;

      tableData.totalChange += obj.change;
      if (obj.change > 0) tableData.posChange += obj.change;
      else if (obj.change < 0) tableData.negChange += obj.change;
    });
  }

  return (
    <>
      <h3>Insider Sentiments</h3>
      <InsightsTable data={tableData} name={name} />
      <div className="row">
        <div className="col-md-6">
          <InsightsStackChart data={props.recommendationData} />
        </div>
        <div className="col-md-6">
          <InsightsEps data={props.epsData} />
        </div>
      </div>
    </>
  );
}

export default Insights;
