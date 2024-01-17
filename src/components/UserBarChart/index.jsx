import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";

export const UserBarChart = ({ data }) => {
    return <Bar data={data} />;
};

UserBarChart.propTypes = {
    data: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string).isRequired,
        datasets: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                data: PropTypes.arrayOf(PropTypes.number).isRequired,
                backgroundColor: PropTypes.arrayOf(PropTypes.string).isRequired,
                borderWidth: PropTypes.number,
            })
        ).isRequired,
    }).isRequired,
};