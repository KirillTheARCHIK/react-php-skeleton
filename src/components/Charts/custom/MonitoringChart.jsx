import React from "react";
import ReactECharts from "echarts-for-react";

const colorPalette = ["#02BC7D", "#FF4C61"];

const MonitoringChart = ({ values }) => {
  const option = {
    series: [
      {
        type: "pie",
        radius: ["30%", "70%"],
        data: values,
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
          },
        },
      },
    ],
    color: colorPalette,
  };

  return <ReactECharts option={option} style={{ height: 67, width: 67 }} />;
};

export default MonitoringChart;
