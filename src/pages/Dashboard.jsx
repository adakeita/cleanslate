import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getCompleteUser } from "../lib/api";
import ChoreDropdown from "../components/ChoreDropdown";
import UserOverview from "../assets/img/usertaskbtn.png";
import HouseholdOverview from "../assets/img/household-btn.png";
import "./pagestyles/dashboard.css";


const Dashboard = () => {
    const [userDetails, setUserDetails] = useState({
        username: '',
        avatar: '',
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const completeUser = await getCompleteUser();
                setUserDetails({
                    username: completeUser.username,
                    avatar: completeUser.avatar,
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
                    <section className="dashboard-profile">
                        <div className="dashboard-img-container">
                            <img src={userDetails.avatar} alt="profile-img" className="dashboard-img" />
                        </div>
                        <div className="dashboard-name-container">
                            <h1 className="dashboard-name">Hi {userDetails.username || 'Loading...'}!</h1>
                        </div>
                    </section>
                    <section className="log-activity">
                        <ChoreDropdown />
                    </section>
                </div>
                <section className="overviews">
                    <h2 className="overview-title">Overviews</h2>
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
            </section>
        </div>
    )
};

export default Dashboard;