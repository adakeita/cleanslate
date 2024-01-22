import './householdcostcomponent.css';
import PropTypes from 'prop-types';

const HouseholdCostComponent = ({ totalValue }) => {
    return (
        <div className="household-cost-container">
            <div className="household-cost-header">Total value of household labor</div>
            <div className="household-cost-value">{totalValue.toLocaleString()} nok</div>
        </div>
    );
};

HouseholdCostComponent.propTypes = {
    totalValue: PropTypes.number.isRequired,
};

export default HouseholdCostComponent;
