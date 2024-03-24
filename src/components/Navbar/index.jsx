import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";
import hamburgerIcon from "../../assets/svg/hamburger.svg";
import closeIcon from "../../assets/svg/close.svg";
import logo from "../../assets/img/cs-logo3.png";
import logoutIcon from "../../assets/svg/sign-out.svg";
import "./navbar.css";

const Navbar = () => {
  const { isMenuVisible } = useUI();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, signOut } = useContext(AuthContext);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      sessionStorage.clear();
      navigate("/" );
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <header id="header">
      <div className="header-content">
        <section className="logo-burger-row">
          <section className="row-section">
            <Link to="/" onClose={closeMenu} className="logo-link">
              <div className="logo-wrapper">
                <img src={logo} alt="logo" className="logo" />
              </div>
            </Link>
          </section>
          <section className="row-section">
            {isMenuVisible && (
              <button
                className="menu-icon-wrapper"
                onClick={toggleMenu}
                role="button"
              >
                <img
                  role="menu"
                  src={isMenuOpen ? closeIcon : hamburgerIcon}
                  alt="menu-icon"
                  className="menu-icon"
                />
              </button>
            )}
          </section>
        </section>
        <div
          className={`nav-wrapper ${isMenuOpen ? "open" : "closed"} ${
            !isAuthenticated ? "small" : "large"
          }`}
        >
          <nav role="navigation" className="navigation">
            <ul className={`navlist ${!isAuthenticated ? "default" : ""}`}>
              <li className="nav-item">
                <Link to="/" onClose={closeMenu}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" onClose={closeMenu}>
                  About
                </Link>
              </li>
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" onClose={closeMenu}>
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item nav-logout-item">
                    <section className="logout-col logout-container">
                      <div className="logout-content logout-element">
                        <button className="logout-btn" onClick={handleLogout}>
                          <div className="logout-img-container">
                            <img
                              src={logoutIcon}
                              alt="logout-icon"
                              className="logout-icon"
                            />
                          </div>
                          <p className="logout-txt">Logout</p>
                        </button>
                      </div>
                    </section>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
