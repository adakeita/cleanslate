import "./totalcostcomponent.css";
import PropTypes from "prop-types";

const TotalCostComponent = ({ totalCost, totalMinutes }) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="total-cost-container">
      <div className="content-container_totalcost">
        {/* Cost Wrapper */}
        <div className="cost-wrapper">
          <h3 className="total-cost-header">Cost contribution</h3>
          <div className="total-cost-value">{totalCost.toLocaleString()} nok</div>
        </div>
        
        {/* Time Wrapper */}
        <div className="time-wrapper">
          <h3 className="total-cost-header">Time spent</h3>
          <div className="total-time-value">{`${hours}h ${minutes}min`}</div>
        </div>
      </div>
    </div>
  );
};

TotalCostComponent.propTypes = {
  totalCost: PropTypes.number.isRequired,
  totalMinutes: PropTypes.number.isRequired,
};

export default TotalCostComponent;




