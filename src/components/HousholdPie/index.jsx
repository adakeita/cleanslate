import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './householdpie.css';

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

const HouseholdPie = ({ householdData, completeUser }) => {
    const labels = householdData.map(member => member.username);
    const totalSum = householdData.reduce((acc, member) => acc + member.totalMinutes, 0);
    const percentages = householdData.map(member => (member.totalMinutes / totalSum) * 100);
    const backgroundColors = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)'
    ];

    const data = {
        labels,
        datasets: [{
            data: percentages,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.5', '1')),
            borderWidth: 1
        }]
    };

    const Options = {
        plugins: {
            datalabels: {
                color: 'black',
                formatter: (value) => `${value.toFixed(2)}%`
            },
            legend: { display: false },
            tooltip: {
            }
        }
    };



    const allUsers = [
        { username: completeUser.username, avatar: completeUser.avatar },
        ...(completeUser.household?.users || [])
    ];

    const renderCustomLegend = () => {
        return (
            <div className="household-custom-legend">
                {allUsers.map((user, index) => (
                    <div key={index} className="household-legend-item">
                        <img
                            src={user.avatar}
                            alt={user.username}
                            className="household-legend-avatar"
                            style={{
                                border: `3px solid ${data.datasets[0].backgroundColor[index]}`,
                            }}
                        />
                        <span className="legend-username">{user.username}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='piechart-container'>
            <Pie data={data} options={Options} />
            {renderCustomLegend()}
        </div>
    );
};

HouseholdPie.propTypes = {
    householdData: PropTypes.array.isRequired,
    completeUser: PropTypes.object.isRequired,
};

export default HouseholdPie;

