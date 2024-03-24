import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./overviewbar.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

const OverviewBar = ({ overviewData }) => {
  const abbreviations = {
    "Cleaning and Sanitation": "Clean & San",
  };

  const overviewDataWithAbbreviations = overviewData.map((item) => ({
    ...item,
    category_name: abbreviations[item.category_name] || item.category_name,
  }));

  const barData = {
    labels: overviewDataWithAbbreviations.map((item) => item.category_name),
    datasets: [
      {
        label: "Monetary Value",
        data: overviewDataWithAbbreviations.map(
          (item) => item.total_monetary_value
        ),
        backgroundColor: [
          "rgba(227, 147, 89, 0.8)",
          "rgba(65, 129, 228, 0.8)",
          "rgba(255, 203, 0, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ],
        borderWidth: 3,
        color: "black",
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,

        title: {
          display: true,
          text: "Monetary Value (NOK)",
          color: "black",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color: "black",
        formatter: (value) => `${value.toFixed(2)} NOK`,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const totalMinutes = overviewData[context.dataIndex].total_minutes;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${context.dataset.label}: ${context.parsed.y.toFixed(
              2
            )} NOK\nTime: ${hours}h ${minutes}min`;
          },
        },
      },
    },
  };
  const renderCustomLegend = () => {
    return (
      <div className="custom-legend">
        {barData.labels.map((label, index) => (
          <div key={index} className="legend-item">
            <span
              className="legend-color"
              style={{
                backgroundColor: barData.datasets[0].backgroundColor[index],
              }}
            ></span>
            <span className="legend-label">{label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="barchart-container">
      <div className="barchart-content">
        <Bar
          className="barchart"
          data={barData}
          options={{
            ...barOptions,
            maintainAspectRatio: false,
            responsive: true,
          }}
        />
      </div>
    </div>
  );
};

export default OverviewBar;
