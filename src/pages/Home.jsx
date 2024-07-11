import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import cleanSlateHome from "../assets/img/cleanslate-logo.svg";
import ChoreDropdown from "../components/ChoreDropdown";
import "./pagestyles/home.css";

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useUpdateBodyClass("/");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = windowWidth > 745;

  return (
    <div id="homePage">
      <div className="content-container_home">
        <div className="cc-desktop-layer">
          <div className="image-wrapper_home">
            <img src={cleanSlateHome} alt="Cleanslate main logo" />
          </div>
          <div className="text-btns_home">
            <section className="text-section_home">
              <h1 className="header_home">Guess less, share more</h1>
              <p className="text_home">
                Discover a playful way towards a balanced home with CleanSlate.
              </p>
            </section>
            {!isAuthenticated && (
              <div className="signedout-btn-wrapper_home">
                <Link
                  role="button"
                  to="/login"
                  className="homepage-link login-btn-homepage loggedout-btn_home"
                >
                  Login
                </Link>
                <Link
                  role="button"
                  to="/register"
                  className="register-btn-homepage homepage-link loggedout-btn_home"
                >
                  Register
                </Link>
              </div>
            )}
            <div className="btns-mobile_home">
              {isAuthenticated && !isDesktop && (
                <div className="signedin-btn-wrapper_home_mobile">
                  <div className="dropdown_home">
                    <ChoreDropdown />
                  </div>
                  <Link to="/dashboard" className="btn-link dashboard-btn_home">
                    Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {isAuthenticated && isDesktop && (
          <div className="signedin-btn-wrapper_home">
            <div className="dropdown_home">
              <ChoreDropdown />
            </div>
            <Link to="/dashboard" className="btn-link dashboard-btn_home">
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
