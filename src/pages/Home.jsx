import "./pagestyles/home.css";
import cleanSlateHome from "../assets/img/CleanSlate.png";

const HomePage = () => {
    return (
        <>
            <div id="homePageContainer" className="page-container">
                <div className="frontpage-image-wrapper">
                    <img src={cleanSlateHome} alt="frontpage-img" />
                </div>
                <div className="frontpage-btn-wrapper">
                    <button className="btn-rounded homepage-btns">Sign In</button>
                    <button className="btn-rounded homepage-btns">Sign Up</button>
                </div>
            </div>
        </>
    );
};

export default HomePage;