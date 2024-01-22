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


const HouseholdPie = ({ householdData }) => {
    const labels = householdData.map(member => member.username);
    const totalMinutes = householdData.map(member => member.totalMinutes);

    const data = {
        labels,
        datasets: [{
            data: totalMinutes,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1
        }]
    };

    return (
        <div className='piechart-container'>
            <Pie data={data} />
        </div>
    );
};

HouseholdPie.propTypes = {
    householdData: PropTypes.array.isRequired
};

export default HouseholdPie;
