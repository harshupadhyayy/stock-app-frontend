import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function InsightsEps(props) {
  var data = props.data;
  data = data.map((item) => ({
    actual: item.actual !== null ? item.actual : 0,
    estimate: item.estimate !== null ? item.estimate : 0,
    period: item.period !== null ? item.period : 0,
    quarter: item.quarter !== null ? item.quarter : 0,
    surprise: item.surprise !== null ? item.surprise : 0,
    surprisePercent: item.surprisePercent !== null ? item.surprisePercent : 0,
    symbol: item.symbol !== null ? item.symbol : 0,
    year: item.year !== null ? item.year : 0,
  }));
  //reference https://www.highcharts.com/docs/chart-and-series-types/spline-chart
  const actualData = data.map((item, idx) => [idx, item.actual]);
  const estimateData = data.map((item, idx) => [idx, item.estimate]);
  const categories = data.map((item, idx) => item.period);
  const surpriseMapping = {};
  data.forEach((item) => {
    surpriseMapping[item.period] = item.surprise;
  });
  const options = {
    chart: {
      type: "spline",
      inverted: false,
      backgroundColor: "#f8f8f8",
    },
    title: {
      text: "Historical EPS Surprises",
      align: "center",
    },
    xAxis: {
      reversed: false,
      categories: categories,
      labels: {
        formatter: function () {
          return (
            this.value + "<br>" + "Surprise: " + surpriseMapping[this.value]
          );
        },
      },
      maxPadding: 0.05,
      showLastLabel: true,
    },
    yAxis: {
      title: {
        text: "Quarterly EPS",
      },
      labels: {
        format: "{value}",
      },
      lineWidth: 2,
    },
    legend: {
      enabled: true,
    },
    tooltip: {
      shared: true,
      useHTML: true,
      //tooltip help taken from chatgpt - prompt: add legend colour to shared tooltip in highcharts
      formatter: function () {
        const dateX = this.points[0].point.category;
        const surprise = surpriseMapping[dateX];
        let html = `${this.x}<br/>Surprise: ${surprise}<br>`;
        this.points.forEach((point) => {
          html += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: ${point.y}<br/>`;
        });
        return html;
      },
    },
    plotOptions: {
      spline: {
        marker: {
          enable: false,
        },
      },
    },
    series: [
      {
        name: "Actual",
        data: actualData,
      },
      {
        name: "Estimate",
        data: estimateData,
      },
    ],
  };

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType={"chart"}
      />
    </>
  );
}

export default InsightsEps;
