import Highcharts, { chart } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useParams } from "react-router-dom";

function SummaryChart(props) {
  const { symbol } = useParams();
  // console.log("props", props);
  const data = props.data;
  const flag = props.colorFlag;
  var chartData = []
  if(data) {
    chartData = data.map((item, idx) => {
      return [item.t, item.c]
    })
  }
  
  //reference highcharts docs
  const options = {
    chart: {
      backgroundColor: '#f8f8f8',
    },

    time: {
      timezone: 'America/Los_Angeles'
    },

    title: {
      text: `${symbol} Hourly Price Variation`,
      align: "center",
      style: {
        color: "grey",
        fontWeight: "light"
      }
    },

    yAxis: {
        opposite: true,
      title: {
        enabled: false,
        text: "random",
      },
    },

    xAxis: {
      type: "datetime",
    },

    legend: {
      enabled: false,
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    plotOptions: {
      series: {
        marker: {
            enabled: false,
        },
        label: {
          connectorAllowed: false,
        },
        // pointStart: 2010,
        color: flag ? "green" : "red"
      },
    },

    series: [
      {
        name: `${symbol}`,
        data: chartData,
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}

export default SummaryChart;
