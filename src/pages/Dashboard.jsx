import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserDetailsContext } from "../contexts/UserDetailsContext";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import { useChores } from "../contexts/ChoreContext";
import { isWithinInterval } from "date-fns";
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
  const { chores } = useChores();
  const { userDetails, fetchAndSetUserDetails } =
    useContext(UserDetailsContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [grandTotalCost, setGrandTotalCost] = useState(0);
  const [grandTotalMinutes, setGrandTotalMinutes] = useState(0);

  const toggleDropdownOpen = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

  useEffect(() => {
    if (!userDetails) {
      fetchAndSetUserDetails();
      console.log("Fetching user details from fallback in Dashboard");
    }
  }, [userDetails, fetchAndSetUserDetails]);

  const navigate = useNavigate();

  const currentDayAndDate = getCurrentDayAndDate();
  const determineDateRange = (filter) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (filter) {
      case "day":
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case "week":
        startDate = new Date(today.setDate(today.getDate() - today.getDay()));
        endDate = new Date(today.setDate(today.getDate() + 6));
        break;
      case "month":
        startDate = new Date(today.setDate(1));
        endDate = new Date(today.setDate(0));
        break;
      case "year":
        startDate = new Date(today.setMonth(0, 1));
        endDate = new Date(today.setMonth(11, 31));
        break;
      case "all":
        startDate = new Date(0);
        endDate = new Date();
        break;
      default:
        break;
    }

    return [startDate, endDate];
  };

  useEffect(() => {
    const [startDate, endDate] = determineDateRange("day");

    const filteredChores = chores.filter((chore) => {
      if (!chore.timestamp) {
        console.error("Chore without timestamp found:", chore);
        return false;
      }
      return isWithinInterval(new Date(chore.timestamp), {
        start: startDate,
        end: endDate,
      });
    });

    const totalMinutes = filteredChores.reduce(
      (acc, chore) => acc + chore.total_minutes,
      0
    );
    const totalCost = filteredChores.reduce(
      (acc, chore) => acc + parseFloat(chore.total_monetary_value || 0),
      0
    );

    setGrandTotalCost(totalCost);
    setGrandTotalMinutes(totalMinutes);
  }, [chores]);

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
    <div id="dashboardContainer" className="content-container_dashboard">
      <div className="greeting-wrapper">
        <h1 className="greeting_dashboard">
          Hi {userDetails?.username || "Loading..."}!
        </h1>
      </div>
      <div className="main-content_dashboard">
        <div className="profile-wrapper_dashboard">
          <div className="test-wrapper">
            <div className="avatar-wrapper_dashboard">
              <img
                src={userDetails?.avatar}
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
