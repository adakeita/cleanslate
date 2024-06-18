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
import "../OverviewBar/overviewbar.css";

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

const HouseholdBar = ({ householdData }) => {
  const abbreviations = {
    "Cleaning and Sanitation": "Clean & San",
    // Add other category abbreviations as needed
  };

  const householdDataWithAbbreviations = householdData.flatMap((member) =>
    member.chores.map((chore) => ({
      ...chore,
      username: member.username,
      category_name:
        abbreviations[chore.category_name] ||
        chore.category_name ||
        "Unknown Category",
    }))
  );

  const categories = [
    ...new Set(
      householdDataWithAbbreviations.map((item) => item.category_name)
    ),
  ];
  const members = [...new Set(householdData.map((item) => item.username))];

  const backgroundColors = [
    "rgba(255, 99, 132, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(255, 206, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 159, 64, 0.5)",
    "rgba(54, 162, 235, 0.5)",
  ];

  const datasets = members.map((member, index) => ({
    label: member,
    data: categories.map((category) => {
      const item = householdDataWithAbbreviations.find(
        (data) => data.username === member && data.category_name === category
      );
      return item ? item.total_monetary_value : 0;
    }),
    backgroundColor: backgroundColors[index % backgroundColors.length],
    borderWidth: 3,
    color: "black",
  }));

  const barData = {
    labels: categories,
    datasets: datasets,
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
        display: true,
        position: "bottom",
      },
      datalabels: {
        display: true,
        color: "black",
        formatter: (value) => (value === 0 ? "0" : `${value.toFixed(2)} NOK`),
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const totalMinutes = householdDataWithAbbreviations.find(
              (item) =>
                item.username === context.dataset.label &&
                item.category_name === context.label
            )?.total_minutes;
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

HouseholdBar.propTypes = {
  householdData: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      chores: PropTypes.arrayOf(
        PropTypes.shape({
          category_name: PropTypes.string.isRequired,
          total_monetary_value: PropTypes.number.isRequired,
          total_minutes: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default HouseholdBar;
