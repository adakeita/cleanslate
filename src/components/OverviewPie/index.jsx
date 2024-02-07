import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
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
import "./pie.css";

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

const OverviewPie = ({ overviewData, totalMinutes, isMobile }) => {
  const pieData = {
    labels: overviewData.map((item) => item.category_name),
    datasets: [
      {
        data: overviewData.map((item) => item.total_minutes),
        backgroundColor: [
          "rgba(227, 147, 89, 0.8)",
          "rgba(65, 129, 228, 0.8)",
          "rgba(255, 203, 0, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ],
        borderWidth: 3,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const category = tooltipItem.label;
            const percentage = (
              (pieData.datasets[0].data[tooltipItem.dataIndex] / totalMinutes) *
              100
            ).toFixed(2);
            return `${category}: (${percentage}%)`;
          },
        },
      },
      datalabels: isMobile
        ? {
            display: true,
            color: "black",
            formatter: (value) => {
              const percentage = ((value / totalMinutes) * 100).toFixed(2);
              return `${percentage}%`;
            },
          }
        : { display: false },
    },
  };

  const renderCustomLegend = () => {
    return (
      <div className="custom-legend">
        {pieData.labels.map((label, index) => (
          <div key={index} className="legend-item">
            <span
              className="legend-color"
              style={{
                backgroundColor: pieData.datasets[0].backgroundColor[index],
              }}
            ></span>
            <span className="legend-label">{label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="piechart-container">
      <div className="piechart-container-content">
        {renderCustomLegend()}
        <Pie
          className="piechart"
          data={pieData}
          options={pieOptions}
          style={{ maxWidth: "200px", maxHeight: "200px", display:"flex" }}
        />
      </div>
    </div>
  );
};

OverviewPie.propTypes = {
  overviewData: PropTypes.array.isRequired,
  totalMinutes: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default OverviewPie;
