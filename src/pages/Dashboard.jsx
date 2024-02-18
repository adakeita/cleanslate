import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getCompleteUser } from "../lib/api";
import { UserDetailsProvider } from "../contexts/UserDetailsContext";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import HouseholdDetails from "../components/HousholdDetails";
import Modal from "../components/Modal";
import ChoreDropdown from "../components/ChoreDropdown";
import UserOverview from "../assets/img/usertaskbtn.png";
import HouseholdOverview from "../assets/img/household-btn.png";
import "./pagestyles/dashboard.css";

const Dashboard = () => {
  useUpdateBodyClass("/dashboard");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const toggleDropdownOpen = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

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

  const handleHouseholdClick = () => {
    if (userDetails.household && userDetails.household.users.length === 0) {
      setModalMessage(
        "You need to add someone to your household to compare tasks."
      );
      setIsModalOpen(true);
    } else {
      navigate({ to: "/household" });
    }
  };

  return (
    <div id="dashboardContainer" className="page-container">
      <UserDetailsProvider>
        <section className="dashboard-wrapper">
          <div className="dashboard-content">
            <div className="dashboard-user-elements">
              <div className="dashboard-img-container">
                <img
                  src={userDetails.avatar}
                  alt="profile-img"
                  className="dashboard-img"
                />
              </div>
              <div
                className={`dashboard-name-dropdown ${
                  isDropdownOpen ? "dropdown-open" : ""
                }`}
              >
                <div className="dashboard-name-container">
                  <h1 className="dashboard-name">
                    Hi {userDetails.username || "Loading..."}!
                  </h1>
                </div>
                <section className="log-activity">
                  <ChoreDropdown onToggleDropdown={toggleDropdownOpen} />
                </section>
              </div>
            </div>
            <section className="overviews">
              <h2 className="overview-title">Check the stats</h2>
              <div className="overview-btn-container">
                <Link to="/overview" className="overview-btn my-overview-btn">
                  <div className="overview-btn-img-container">
                    <img
                      src={UserOverview}
                      alt="overview-img"
                      className="overview-btn-img"
                    />
                  </div>
                  <p className="overview-btn-txt">My Overview</p>
                </Link>
                <button
                  onClick={handleHouseholdClick}
                  className="overview-btn household-overview-btn"
                >
                  <div className="overview-btn-img-container">
                    <img
                      src={HouseholdOverview}
                      alt="overview-img"
                      className="overview-btn-img"
                    />
                  </div>
                  <p className="overview-btn-txt">Household</p>
                </button>
                <button
                  onClick={handleOpenHouseholdModal}
                  className="overview-btn household-overview-btn"
                >
                  Create/Join Household
                </button>
              </div>
            </section>
          </div>
        </section>
      </UserDetailsProvider>
      <Modal
        isOpen={isHouseholdModalOpen}
        onClose={() => setIsHouseholdModalOpen(false)}
      >
        <HouseholdDetails />
      </Modal>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalMessage}
      </Modal>
    </div>
  );
};

export default Dashboard;
