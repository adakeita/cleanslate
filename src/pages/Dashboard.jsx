import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCompleteUser, getUserChoreOverview } from "../lib/api";
import { UserDetailsProvider } from "../contexts/UserDetailsContext";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import TotalCostComponent from "../components/TotalCostComponent";
import { getCurrentDayAndDate } from "../lib/utils";
import HouseholdOptions from "../components/HouseholdOptions";
import HouseholdDetails from "../components/HousholdDetails";
import Modal from "../components/Modal";
import ChoreDropdown from "../components/ChoreDropdown";
import UserOverview from "../assets/img/user-btn-color.png";
import HouseholdOverview from "../assets/img/household-btn-color.png";
import "./pagestyles/dashboard.css";

const Dashboard = () => {
  useUpdateBodyClass("/dashboard");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [grandTotalCost, setGrandTotalCost] = useState(0);
  const [grandTotalMinutes, setGrandTotalMinutes] = useState(0);

  const toggleDropdownOpen = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

  const currentDayAndDate = getCurrentDayAndDate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const completeUser = await getCompleteUser();

        setUserDetails({
          username: completeUser.username,
          avatar: completeUser.avatar,
          alternateAvatar: completeUser.alternateAvatar,
          household: completeUser.household,
        });

        const fetchedOverviewData = await getUserChoreOverview(
          completeUser.userDetailsId,
          "day"
        );

        const totalMinutes = fetchedOverviewData.reduce(
          (acc, item) => acc + item.total_minutes,
          0
        );
        const totalCost = fetchedOverviewData.reduce(
          (acc, item) => acc + (parseFloat(item.total_monetary_value) || 0),
          0
        );

        setGrandTotalCost(totalCost);
        setGrandTotalMinutes(totalMinutes);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const [userDetails, setUserDetails] = useState({
    username: "",
    avatar: "",
    alternateAvatar: "",
    household: null,
  });

  const navigate = useNavigate();

  const handleOpenHouseholdModal = () => {
    setIsHouseholdModalOpen(true);
  };

  const handleHouseholdOptionsClick = () => {
    setIsModalOpen(true);
  };

  const handleHouseholdClick = (e) => {
    e.preventDefault();
    if (userDetails.household && userDetails.household.users.length === 0) {
      setModalMessage(
        "You need to add someone to your household to compare tasks."
      );
      setIsHouseholdModalOpen(true);
    } else {
      navigate("/household");
    }
  };

  return (
    <div id="dashboardContainer" className="page-container">
      <UserDetailsProvider>
        <div className="greeting-wrapper">
          <h1 className="greeting_dashboard">
            Hi {userDetails.username || "Loading..."}!
          </h1>
        </div>
        <div className="main-content_dashboard">
          <div className="profile-wrapper_dashboard">
            <div className="test-wrapper">
              <div className="avatar-wrapper_dashboard">
                <img
                  src={userDetails.avatar}
                  alt="profile-img"
                  className="profile-img_dashboard"
                />
              </div>
            </div>
            <div className="edit-profile-btn-wrapper_dashboard">
              <button
                onClick={handleHouseholdOptionsClick}
                className="edit-profile-btn_dashboard"
              >
                Edit Profile
              </button>
            </div>
          </div>
          <section className="hero_dashboard">
            <div className="totalday_dashboard-wrapper">
              <div className="date-wrapper_dashboard">
                <h2 className="date_dashboard">{currentDayAndDate}</h2>
              </div>
              <TotalCostComponent
                totalCost={grandTotalCost}
                totalMinutes={grandTotalMinutes}
              />
            </div>

            <div
              className={`user-btn-section ${
                isDropdownOpen ? "dropdown-open" : ""
              }`}
            >
              <section className="overviews">
                <div className="overview-btn-wrapper_dashboard">
                  <div className="user-btns">
                    <Link
                      to="/overview"
                      className="overview-btn_dashboard user-overview-btn"
                    >
                      <div className="img-wrapper_overview-btn">
                        <img
                          src={UserOverview}
                          alt="overview-img"
                          className="btn-img_overview-btn"
                        />
                      </div>
                      <p className="overview-btn-txt">My Overview</p>
                    </Link>
                    <section className="log-activity">
                      <ChoreDropdown onToggleDropdown={toggleDropdownOpen} />
                    </section>
                  </div>
                  <div className="household-btns_dashboard">
                    <Link
                      onClick={handleHouseholdClick}
                      className="overview-btn_dashboard household-overview-btn"
                    >
                      <div className="img-wrapper_overview-btn">
                        <img
                          src={HouseholdOverview}
                          alt="overview-img"
                          className="btn-img_overview-btn"
                        />
                      </div>
                      <p className="overview-btn-txt">Household</p>
                    </Link>
                    <button
                      onClick={handleHouseholdOptionsClick}
                      className="household-options-btn_dashboard"
                    >
                      Household Options
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </UserDetailsProvider>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <HouseholdOptions />
      </Modal>
      <Modal
        isOpen={isHouseholdModalOpen}
        onClose={() => setIsHouseholdModalOpen(false)}
      >
        {modalMessage}
      </Modal>
    </div>
  );
};

export default Dashboard;
