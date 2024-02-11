import { Link } from "@tanstack/react-router";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import cleanSlateHome from "../assets/img/CleanSlate.png";
import "./pagestyles/home.css";

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  useUpdateBodyClass("/");

  return (
    <div id="homePageContainer" className="page-container">
      <div className="static-wrapper">
        <div className="frontpage-image-wrapper">
          <img src={cleanSlateHome} alt="frontpage-img" />
        </div>
        <section className="frontpage-about">
          <h1 className="header">Guess less, share more</h1>
          <p className="about-text">
            Discover a playful way to a balanced of home tasks
          </p>
          <p className="about-text">with CleanSlate.</p>
        </section>
      </div>
      {!isAuthenticated && (
        <div className="frontpage-btn-wrapper">
          <Link
            role="button"
            to="/login"
            className="homepage-link login-btn-homepage btn-squared homepage-btns"
          >
            Login
          </Link>
          <Link
            role="button"
            to="/register"
            className="register-btn-homepage homepage-link btn-squared homepage-btns"
          >
            Register
          </Link>
        </div>
      )}
      {isAuthenticated && (
        <div className="home-dashboard">
          <Link
            aria-roledescription="button"
            role="burron"
            to="/dashboard"
            className="btn-link dashboard-btn btn-squared"
          >
            Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
