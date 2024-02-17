import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getCompleteUser } from "../lib/api";
import { UserDetailsProvider } from "../contexts/UserDetailsContext";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import Modal from "../components/Modal";
import ChoreDropdown from "../components/ChoreDropdown";
import UserOverview from "../assets/img/usertaskbtn.png";
import HouseholdOverview from "../assets/img/household-btn.png";
import "./pagestyles/dashboard.css";
import HouseholdDetails from "../components/HousholdDetails";

const Dashboard = () => {
  useUpdateBodyClass("/dashboard");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const toggleDropdownOpen = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

  const [userDetails, setUserDetails] = useState({
    username: "",
    avatar: "",
    alternateAvatar: "",
    household: null,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const completeUser = await getCompleteUser();
        console.log("Fetched complete user:", completeUser);
        setUserDetails({
          username: completeUser.username,
          avatar: completeUser.avatar,
          household: completeUser.household,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const navigate = useNavigate();

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

  const handleNewHouseholdClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div id="dashboard" className="page-container">
      <UserDetailsProvider>
        <section className="dashboard-container">
          <div className="content-container_dashboard">
            <div className="user-content_dashboard">
              <div className="avatar-wrapper_dashboard">
                <img
                  src={userDetails.avatar}
                  alt="avatar-img"
                  className="avatar_dashboard"
                />
              </div>
              <div
                className={`dashboard-name-dropdown ${
                  isDropdownOpen ? "dropdown-open" : ""
                }`}
              >
                <div className="username-wrapper_dashboard">
                  <h1 className="username_dashboard">
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
                <button onClick={handleNewHouseholdClick}>Add household</button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  {HouseholdDetails}
                </Modal>
              </div>
            </section>
          </div>
        </section>
      </UserDetailsProvider>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalMessage}
      </Modal>
    </div>
  );
};

export default Dashboard;
