import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './doublebarchart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DoubleBarChart = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.username),
        datasets: [
            {
                label: 'Total Minutes',
                data: data.map(d => d.totalMinutes),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                categoryPercentage: 0.4,
                barPercentage: 0.4,
            },
            {
                label: 'Total Value',
                data: data.map(d => d.totalValue),
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
                categoryPercentage: 0.4,
                barPercentage: 0.4,
            }
        ]
    };

    const chartOptions = {
        scales: {
            x: {
                grid: {
                    display: false
                },
                beginAtZero: true,
            },
            y: {
                grid: {
                    display: true
                },
                beginAtZero: true,
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
        },
        responsive: false,
        maintainAspectRatio: false,
        indexAxis: 'y',
    };

    return (
        <Bar data={chartData} options={chartOptions} />
    );
};

DoubleBarChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        username: PropTypes.string.isRequired,
        totalMinutes: PropTypes.number.isRequired,
        totalValue: PropTypes.number.isRequired,
    })).isRequired,
};

export default DoubleBarChart;

