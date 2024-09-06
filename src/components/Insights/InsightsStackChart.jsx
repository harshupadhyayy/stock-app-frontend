import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function InsightsStackChart(props) {
  const data = props.data;
  const categories = data.map((item, idx) => {
    return item.period.slice(0, 7);
  });

  const filteredData = data.reduce(
    (acc, item) => {
      acc.strongBuy.push(item.strongBuy);
      acc.buy.push(item.buy);
      acc.hold.push(item.hold);
      acc.sell.push(item.sell);
      acc.strongSell.push(item.strongSell);
      return acc;
    },
    { strongBuy: [], buy: [], hold: [], sell: [], strongSell: [] }
  );
  //reference https://www.highcharts.com/docs/chart-and-series-types/column-chart
  const options = {
    chart: {
      type: "column",
      backgroundColor: '#f8f8f8',
    },
    title: {
      text: "Recommendation Trends",
      align: "center",
    },
    xAxis: {
      categories: categories,
    },
    yAxis: {
      min: 0,
      title: {
        text: "#Analysis",
      },
      stackLabels: {
        enabled: false,
      },
    },
    legend: {
      align: "center",
    //   x: 10,
      verticalAlign: "bottom",
    //   y: 25,
    //   floating: true,
    layout: 'horizontal',
      backgroundColor: "#f8f8f8",
      borderColor: "#CCC",
      borderWidth: 0,
      shadow: false,
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        name: "Strong Buy",
        data: filteredData.strongBuy,
        color: "#266331"
      },
      {
        name: "Buy",
        data: filteredData.buy,
        color: "#3faf4a"
      },
      {
        name: "Hold",
        data: filteredData.hold,
        color: "#ac7e17"
      },
      {
        name: "Sell",
        data: filteredData.sell,
        color: "#e85150"
      },
      {
        name: "Strong Sell",
        data: filteredData.strongSell,
        color: "#722c2b"
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

export default InsightsStackChart;
