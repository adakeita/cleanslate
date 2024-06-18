import "./householdcostcomponent.css";
import PropTypes from "prop-types";

const HouseholdCostComponent = ({ householdData }) => {
  const sortedData = [...householdData].sort(
    (a, b) => b.totalValue - a.totalValue
  );
  const leadingMember = sortedData[0];
  const secondMember = sortedData[1];

  const valueDifference = secondMember
    ? leadingMember.totalValue - secondMember.totalValue
    : 0;

  const appreciationMessage = secondMember
    ? `${
        leadingMember.username
      } has worked for ${valueDifference.toLocaleString()} nok more than ${
        secondMember.username
      }. Remember to show them you appreciate them!`
    : `${leadingMember.username} has the highest contribution in household labor. Remember to show appreciation!`;

  return (
    <div className="household-cost-container">
      <div className="household-cost-header">Say thank&apos;s!</div>
      <div className="household-cost-value">{appreciationMessage}</div>
    </div>
  );
};

HouseholdCostComponent.propTypes = {
  householdData: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      totalValue: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default HouseholdCostComponent;
