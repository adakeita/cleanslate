import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCompleteUser } from "../lib/api";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import ChoreDropdown from "../components/ChoreDropdown";
import UserOverview from "../assets/img/usertaskbtn.png";
import HouseholdOverview from "../assets/img/household-btn.png";
import "./pagestyles/dashboard.css";


const Dashboard = () => {
    useUpdateBodyClass("/dashboard");

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const toggleDropdownOpen = (isOpen) => {
        setIsDropdownOpen(isOpen);
    };

    const [userDetails, setUserDetails] = useState({
        username: '',
        avatar: '',
        alternateAvatar: '',
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const completeUser = await getCompleteUser();
                setUserDetails({
                    username: completeUser.username,
                    avatar: completeUser.avatar,
                    alternateAvatar: completeUser.alternateAvatar,
                });
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, []);


    return (
        <div id="dashboardContainer" className="page-container">
            <section className="dashboard-wrapper">
                <div className="dashboard-content">
                    <div className="dashboard-user-elements">
                        <div className="dashboard-img-container">
                            <img src={userDetails.alternateAvatar} alt="profile-img" className="dashboard-img" />
                        </div>
                        <div className={`dashboard-name-dropdown ${isDropdownOpen ? 'dropdown-open' : ''}`}>
                            <div className="dashboard-name-container">
                                <h1 className="dashboard-name">Hi {userDetails.username || 'Loading...'}!</h1>
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
                                    <img src={UserOverview} alt="overview-img" className="overview-btn-img" />
                                </div>
                                <p className="overview-btn-txt">My Overview</p>
                            </Link>
                            <Link to="/household" className="overview-btn my-overview-btn">
                                <div className="overview-btn-img-container">
                                    <img src={HouseholdOverview} alt="overview-img" className="overview-btn-img" />
                                </div>
                                <p className="overview-btn-txt">Household</p>
                            </Link>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    )
};


export default Dashboard;