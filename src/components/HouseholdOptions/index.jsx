import { useState, useEffect } from "react";
import HouseholdDetails from "../HousholdDetails";
import { getCompleteUser } from "../../lib/api";
import { generateMagicLink } from "../../lib/api";
import Modal from "../Modal";
import "./household-options.css";

const HouseholdOptions = () => {
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [householdDetails, setHouseholdDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const completeUser = await getCompleteUser();

        setHouseholdDetails({
          username: completeUser.username,
          household: completeUser.household,
          householdId: completeUser.household.id,
          householdName: completeUser.household.name,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  const handleGenerateInviteLink = async () => {
    const householdId = householdDetails.householdId;
    try {
      const link = await generateMagicLink(householdId);
      console.log("Generated link:", link);
      navigator.clipboard
        .writeText(link)
        .then(() => alert("Link copied to clipboard!"));
    } catch (error) {
      console.error("Error generating invite link:", error);
    }
  };

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
              <button
                onClick={handleGenerateInviteLink}
                className="household-operations-btn"
              >
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
