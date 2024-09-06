import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useParams } from "react-router-dom";
require("highcharts/indicators/indicators")(Highcharts);
require("highcharts/indicators/volume-by-price")(Highcharts);

function Charts(props) {
  const { symbol } = useParams();
  const data = props.data;
  var dataLength = 0;
  //reference https://www.highcharts.com/demo/stock/sma-volume-by-price
  if (data) {
    dataLength = data.length;
  }
  const ohlc = [],
    volume = [],
    groupingUnits = [
      [
        "week",
        [1],
      ],
      ["month", [1, 2, 3, 4, 6]],
    ];

  for (let i = 0; i < dataLength; i += 1) {
    ohlc.push([
      data[i]["t"],
      data[i]["o"],
      data[i]["h"], 
      data[i]["l"], 
      data[i]["c"],
    ]);

    volume.push([
      data[i]["t"],
      data[i]["v"], 
    ]);
  }

  const options = {
    chart: {
      height: 550,
      backgroundColor: '#f8f8f8',
    },

    rangeSelector: {
      selected: 2,
    },

    title: {
      text: `${symbol} Historical`,
    },

    subtitle: {
      text: "With SMA and Volume by Price technical indicators",
    },

    yAxis: [
      {
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "OHLC",
        },
        height: "60%",
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Volume",
        },
        top: "65%",
        height: "35%",
        offset: 0,
        lineWidth: 2,
      },
    ],

    tooltip: {
      split: true,
    },

    plotOptions: {
      series: {
        dataGrouping: {
          enabled: false,
          units: groupingUnits,
        },
      },
    },

    series: [
      {
        type: "candlestick",
        name: `${symbol}`,
        id: `${symbol}`,
        zIndex: 2,
        data: ohlc,
      },
      {
        type: "column",
        name: "Volume",
        id: "volume",
        data: volume,
        yAxis: 1,
      },
      {
        type: "vbp",
        linkedTo: `${symbol}`,
        params: {
          volumeSeriesID: "volume",
        },
        dataLabels: {
          enabled: false,
        },
        zoneLines: {
          enabled: false,
        },
      },
      {
        type: "sma",
        linkedTo: `${symbol}`,
        zIndex: 1,
        marker: {
          enabled: false,
        },
      },
    ],
  };

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType={"stockChart"}
      />
    </>
  );
}

export default Charts;
