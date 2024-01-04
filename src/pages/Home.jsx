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
                        Welcome to CleanSweep, where we make household chores fun and fair! Track your tasks, see their value as if they were paid, and compare with your partner. Discover a balanced home life with our easy-to-use app, designed for teamwork and appreciation.
                        Join us in celebrating and equalizing the unseen efforts of home life!
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