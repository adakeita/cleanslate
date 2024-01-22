import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './doublebarchart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserBarChart = ({ data, backgroundColor, borderColor, reversed }) => {
    const labels = reversed ? ['', ''] : ['Total Minutes', 'Total Value'];

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: data.username,
                data: reversed ? [data.totalMinutes * -1, data.totalValue * -1] : [data.totalMinutes, data.totalValue],
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: value => Math.abs(value),
                    max: 100,
                }
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.x !== null) {
                            label += Math.abs(context.parsed.x);
                        }
                        return label;
                    }
                }
            },
            legend: {
                display: false, // Hide legend to control it separately
            },
        },
        responsive: false,
        maintainAspectRatio: false,
    };

    return <Bar data={chartData} options={chartOptions} />;
};

UserBarChart.propTypes = {
    data: PropTypes.shape({
        username: PropTypes.string.isRequired,
        totalMinutes: PropTypes.number.isRequired,
        totalValue: PropTypes.number.isRequired,
        reversed: PropTypes.bool,
    }).isRequired,
    backgroundColor: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    reversed: PropTypes.bool.isRequired,
};

const DoubleBarChart = ({ userData }) => {
    // Assuming userData is an array with two user objects
    const user1Data = { ...userData[0], reversed: false }; // Normal orientation for user 1
    const user2Data = { ...userData[1], reversed: true }; // Reversed orientation for user 2

    return (
        <div className="double-bar-chart-container">
            <UserBarChart
                className="user1-chart"
                data={user1Data}
                backgroundColor="rgba(54, 162, 235, 0.5)"
                borderColor="rgba(54, 162, 235, 1)"
                reversed={true}
            />
            <UserBarChart
                className="user2-chart"
                data={user2Data}
                backgroundColor="rgba(255, 206, 86, 0.5)"
                borderColor="rgba(255, 206, 86, 1)"
                reversed={false}
            />
        </div>
    );
};

DoubleBarChart.propTypes = {
    userData: PropTypes.arrayOf(PropTypes.shape({
        username: PropTypes.string.isRequired,
        totalMinutes: PropTypes.number.isRequired,
        totalValue: PropTypes.number.isRequired,
    })).isRequired,
};

export default DoubleBarChart;

