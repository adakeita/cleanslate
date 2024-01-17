import PropType from 'prop-types';
import { Pie } from 'react-chartjs-2';

export const UserPieChart = ({ data }) => {
    return <Pie data={data} />;
};

UserPieChart.propTypes = {
    data: PropType.shape({
        labels: PropType.arrayOf(PropType.string).isRequired,
        datasets: PropType.arrayOf(
            PropType.shape({
                data: PropType.arrayOf(PropType.number).isRequired,
                backgroundColor: PropType.arrayOf(PropType.string).isRequired,
                borderWidth: PropType.number,
            })
        ).isRequired,
    }).isRequired,
};