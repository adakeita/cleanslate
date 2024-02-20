import { useState, useEffect } from "react";
import HouseholdDetails from "../HousholdDetails";
import Modal from "../Modal";
import "./household-options.css";

const HouseholdOptions = () => {
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [householdDetails, setHouseholdDetails] = useState(null);

  const handleOpenHouseholdModal = () => {
    setIsHouseholdModalOpen(true);
  };

  return (
    <div className="household-options-container">
      <div className="header-wrapper_household-options">
        <h1 className="header_household-options">Household Options</h1>
      </div>
      <section className="household-operations">
        <div className="household-operations-wrapper">
          <div className="household-operations-btns">
            <div className="btn-wrapper_household-options">
              <button
                onClick={handleOpenHouseholdModal}
                className="household-operations-btn"
              >
                Create Household
              </button>
            </div>
            <div className="btn-wrapper_household-options">
              <button className="household-operations-btn">
                Invite to Household
              </button>
            </div>
            <div className="btn-wrapper_household-options">
              <button className="household-operations-btn leave-household-btn">
                Leave Household
              </button>
            </div>
          </div>
          <Modal
            isOpen={isHouseholdModalOpen}
            onClose={() => setIsHouseholdModalOpen(false)}
          >
            <HouseholdDetails />
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default HouseholdOptions;
