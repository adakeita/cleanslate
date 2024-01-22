import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './doublebarchart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategoryLabels = ({ categories }) => (
    <div className="category-labels">
        {categories.map((category, index) => (
            <div key={index} className="category-label">{category.category}</div>
        ))}
    </div>
);

CategoryLabels.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.string.isRequired,
    })).isRequired,
};

const UserBarChart = ({ data, username, backgroundColor, borderColor, reversed, style }) => {
    const chartData = {
        labels: data.map(() => ''), // No labels on the bars
        datasets: [{
            label: username,
            data: data.map(d => reversed ? -d.percentage : d.percentage),
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
        }],
    };

    const chartOptions = {
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: value => Math.abs(value) + '%',
                    max: 100,
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: context => `${context.label}: ${Math.abs(context.parsed.x)}%`
                }
            },
            legend: {
                display: false,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={style}>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

UserBarChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.string.isRequired,
        percentage: PropTypes.number.isRequired,
    })).isRequired,
    username: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    reversed: PropTypes.bool.isRequired,
    style: PropTypes.object,
};

const DoubleBarChart = ({ userData }) => {
    const user1Data = userData[0] || { username: "User 1", categories: [] };
    const user2Data = userData[1] || { username: "User 2", categories: [] };

    return (
        <div className="double-bar-chart-container">
            <UserBarChart
                data={user1Data.categories}
                username={user1Data.username}
                backgroundColor="rgba(54, 162, 235, 0.5)"
                borderColor="rgba(54, 162, 235, 1)"
                reversed={true}
                style={{ width: "250px", margin: '0' }}
            />
            <CategoryLabels categories={user1Data.categories} />
            <UserBarChart
                data={user2Data.categories}
                username={user2Data.username}
                backgroundColor="rgba(255, 206, 86, 0.5)"
                borderColor="rgba(255, 206, 86, 1)"
                reversed={false}
                style={{ width: "250px", margin: '0' }}
            />
        </div>
    );
};

DoubleBarChart.propTypes = {
    userData: PropTypes.arrayOf(PropTypes.shape({
        username: PropTypes.string.isRequired,
        categories: PropTypes.arrayOf(PropTypes.shape({
            category: PropTypes.string.isRequired,
            percentage: PropTypes.number.isRequired,
        })).isRequired,
    })).isRequired,
};

export default DoubleBarChart;

