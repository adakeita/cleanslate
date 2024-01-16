import { useState } from "react";
import { Link } from "@tanstack/react-router";
import NavLink from "./NavLink";
import { signOut } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import hamburgerIcon from "../../assets/svg/hamburger.svg";
import closeIcon from "../../assets/svg/close.svg";
import logo from "../../assets/img/cs-logo2.png";
import logoutIcon from "../../assets/svg/sign-out.svg";
import "./navbar.css";



const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAuthenticated = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut();
            isAuthenticated(false);
            return
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    return (
        <header id="header">
            <div className="header-content">
                <section className="logo-burger-row">
                    <section className="row-section">
                        <Link to="/" className="logo-link">
                            <div className="logo-wrapper">
                                <img src={logo} alt="logo" className="logo" />
                            </div>
                        </Link>
                    </section>
                    <section className="row-section">
                        <button className="menu-icon-wrapper" onClick={toggleMenu} role="button">
                            <img role="menu" src={isMenuOpen ? closeIcon : hamburgerIcon} alt="menu-icon" className="menu-icon" />
                        </button>
                    </section>
                </section>
                <div className={`nav-wrapper ${isMenuOpen ? 'open' : 'closed'} ${!isAuthenticated ? 'small' : 'large'}`}>
                    <nav role="navigation" className="navigation">
                        <ul className="navlist">
                            <li className="nav-item">
                                <NavLink to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/about">About</NavLink>
                            </li>
                            {isAuthenticated && (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/dashboard">Dashboard</NavLink>
                                    </li>
                                    <li className="nav-item nav-logout-item">
                                        <section className="logout-col logout-container">
                                            <div className="logout-content logout-element">
                                                <button className="logout-btn" onClick={handleLogout}>
                                                    <div className="logout-img-container">
                                                        <img src={logoutIcon} alt="logout-icon" className="logout-icon" />
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
        </header >
    );
};

export default Navbar;