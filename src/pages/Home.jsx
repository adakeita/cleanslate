import { Link } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import cleanSlateHome from "../assets/img/CleanSlate.png";
import "./pagestyles/home.css";

const HomePage = () => {
    const isAuthenticated = useAuth();

    return (
        <>
            <div id="homePageContainer" className="page-container">
                <div className="frontpage-image-wrapper">
                    <img src={cleanSlateHome} alt="frontpage-img" />
                </div>
                <section className="frontpage-about">
                    <p className="frontpage-about-text">
                        Welcome to CleanSlate, the app that makes household chores fun and fair! Log your chores, see their value in real money, and compare with your partner. Discover a playful way to encourage a balanced share of home tasks.
                    </p>
                </section>
                {!isAuthenticated && (
                    <div className="frontpage-btn-wrapper">
                        <Link to="/login" className="btn-link">
                            <button className="btn-squared homepage-btns">Sign In</button>
                        </Link>
                        <Link to="/register" className="homepage-link">
                            <button className="btn-squared homepage-btns">Register</button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default HomePage;