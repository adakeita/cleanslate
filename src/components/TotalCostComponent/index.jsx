import './totalcostcomponent.css';
import PropTypes from 'prop-types';

const TotalCostComponent = ({ totalCost, totalTime }) => {
    return (
        <div className="total-cost-container">
            <div className="total-cost-header">Total cost of your labor</div>
            <div className="total-cost-value">{totalCost.toLocaleString()} nok</div>
            <div className="total-time">{totalTime}</div>
        </div>
    );
};

TotalCostComponent.propTypes = {
    totalCost: PropTypes.number.isRequired,
    totalTime: PropTypes.string.isRequired,
};

export default TotalCostComponent;