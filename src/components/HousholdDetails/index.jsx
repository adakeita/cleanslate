import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createNewHousehold, getCompleteUser } from "../../lib/api";
import { AuthContext } from "../../contexts/AuthContext";
import "./housedetails.css";

const HouseholdDetails = () => {
  const [householdName, setHouseholdName] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState("1");
  const [HouseholdId, setHouseholdId] = useState("");
  const [sizeInSqm, setSizeInSqm] = useState("");
  const [sizeInSqmError, setSizeInSqmError] = useState("");
  const [joinExisting, setJoinExisting] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [errors, setErrors] = useState({
    householdNameError: "",
    sizeInSqmError: "",
    feedbackMessage: "",
  });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const incrementRooms = () => {
    const currentRooms = parseInt(numberOfRooms, 10);
    setNumberOfRooms(currentRooms + 1);
  };

  const decrementRooms = () => {
    const currentRooms = parseInt(numberOfRooms, 10);
    setNumberOfRooms(currentRooms > 1 ? currentRooms - 1 : 1);
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!householdName.trim()) {
      errors.householdNameError = "Please enter a household name.";
      isValid = false;
    }

    if (!joinExisting && !sizeInSqm.trim()) {
      errors.sizeInSqmError = "Please select house size.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const completeUser = await getCompleteUser();
      const userId = completeUser.authUserId;

      const fetchUserDetails = async () => {
        try {
          const completeUser = await getCompleteUser();

          setUserDetails({
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

      if (joinExisting) {
        await joinExistingHousehold(householdName, userId);
        setErrors({ feedbackMessage: "Successfully joined the household!" });
      } else {
        const householdId = await createNewHousehold(
          householdName,
          sizeInSqm,
          numberOfRooms,
          userId
        );

        setHouseholdId(householdId);
        completeUser.household.id = householdId;

        sessionStorage.setItem("householdId", householdId);
        sessionStorage.setItem("completeUser", JSON.stringify(completeUser));
        
        setErrors({ feedbackMessage: "Household created successfully!" });
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error handling household form submission:", error);
      setErrors({ feedbackMessage: error.message || "An error occurred." });
    }
  };

  return (
    <div className="household-container">
      <form className="household-form" onSubmit={handleSubmit}>
        <h1 className="household-form-title">Household Details</h1>
        <div className="household-form-content">
          <div className="toggle-join-create">
            <label>
              <input
                type="checkbox"
                checked={joinExisting}
                onChange={() => setJoinExisting(!joinExisting)}
              />
              Connect to existing household
            </label>
          </div>
          {/* Conditional rendering based on whether joining existing or creating new */}
          <div className="household-col">
            <label className="householdform-label" htmlFor="household-name">
              Household Name
            </label>
            <input
              className="household-inputfield"
              id="household-name"
              type="text"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder="Household Name"
            />
            {errors.householdNameError && (
              <p className="error-message">{errors.householdNameError}</p>
            )}
          </div>
          {!joinExisting && (
            <>
              <div className="household-col">
                <div className="household-col">
                  <label
                    className="householdform-label"
                    htmlFor="number-of-rooms"
                  >
                    No. rooms
                  </label>
                  <div className="room-btn-container">
                    <button
                      className="room-btn"
                      type="button"
                      onClick={decrementRooms}
                    >
                      -
                    </button>
                    <span className="current-room-selection">
                      {numberOfRooms}
                    </span>
                    <button
                      className="room-btn"
                      type="button"
                      onClick={incrementRooms}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="household-col">
                  <label className="householdform-label" htmlFor="house-size">
                    House Size (kvm)
                  </label>
                  <select
                    className="household-inputfield"
                    value={sizeInSqm}
                    onChange={(e) => setSizeInSqm(e.target.value)}
                  >
                    <option value="">Select size</option>
                    <option value="20">Up to 20 kvm</option>
                    <option value="60">Up to 60 kvm</option>
                    <option value="80">Up to 80 kvm</option>
                    <option value="120">Up to 120 kvm</option>
                    <option value="160">Up to 160 kvm</option>
                    <option value="200+">200 kvm or more</option>
                  </select>
                  {sizeInSqmError && !joinExisting && (
                    <p className="error-message">{sizeInSqmError}</p>
                  )}
                  {sizeInSqmError && (
                    <p className="error-message">{sizeInSqmError}</p>
                  )}
                </div>
              </div>
              {errors.sizeInSqmError && (
                <p className="error-message">{errors.sizeInSqmError}</p>
              )}
            </>
          )}
        </div>
        {errors.feedbackMessage && (
          <p className="feedback-message">{errors.feedbackMessage}</p>
        )}
        <button className="btn-squared householdform-btn" type="submit">
          {joinExisting ? "Join Household" : "Create Household"}
        </button>
      </form>
    </div>
  );
};

export default HouseholdDetails;
