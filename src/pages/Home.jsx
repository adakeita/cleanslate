import "./pagestyles/home.css";
import cleanSlateHome from "../assets/img/CleanSlate.png";

const HomePage = () => {
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
                <div className="frontpage-btn-wrapper">
                    <button className="btn-rounded homepage-btns">Sign In</button>
                    <button className="btn-rounded homepage-btns">Sign Up</button>
                </div>
            </div>
        </>
    );
};

export default HomePage;