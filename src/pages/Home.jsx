import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import cleanSlateHome from "../assets/img/CleanSlate.png";
import "./pagestyles/home.css";

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  useUpdateBodyClass("/");

  return (
    <div id="homePage" className="page-container">
      <div className="content-container">
        <div className="frontpage-image-wrapper">
          <img src={cleanSlateHome} alt="frontpage-img" />
        </div>
        <div className="btns-about_frontpage">
          <section className="about-wrapper_frontpage">
            <h1 className="header_frontpage">Guess less, share more</h1>
            <p className="about-text_frontpage">
              Discover a playful way towards balanced home management with
              CleanSlate.
            </p>
          </section>
          {!isAuthenticated && (
            <div className="frontpage-btn-wrapper">
              <Link
                role="button"
                to="/login"
                className="homepage-link login-btn-homepage homepage-btns"
              >
                Login
              </Link>
              <Link
                role="button"
                to="/register"
                className="register-btn-homepage homepage-link homepage-btns"
              >
                Register
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <div className="home-dashboard">
              <Link
                aria-roledescription="button"
                role="button"
                to="/dashboard"
                className="btn-link dashboard-btn"
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
