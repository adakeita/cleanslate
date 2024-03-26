import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import cleanSlateHome from "../assets/img/cleanslate-logo.svg";
import ChoreDropdown from "../components/ChoreDropdown";
import "./pagestyles/home.css";

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  useUpdateBodyClass("/");

  return (
    <div id="homePage" className="page-container">
      <div className="content-container_home">
        <div className="image-wrapper_home">
          <img src={cleanSlateHome} alt="main-img_home" />
        </div>
        <div className="text-btns_home">
          <section className="text-section_home">
            <h1 className="header_home">Guess less, share more</h1>
            <p className="text_home">
              Discover a playful way towards balanced home management with
              CleanSlate.
            </p>
          </section>
          {!isAuthenticated && (
            <div className="signedout-btn-wrapper_home">
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
            <div className="signedin-btn-wrapper_home">
              <div className="dropdown_home">
                <ChoreDropdown />
              </div>
              <Link
                aria-roledescription="button"
                role="button"
                to="/dashboard"
                className="btn-link dashboard-btn_home"
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
