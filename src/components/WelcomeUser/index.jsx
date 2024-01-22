import PropTypes from 'prop-types';
import "./welcomeuser.css";

const WelcomeUser = ({ onAcknowledge }) => {
    const handleAcknowledge = () => {
        try {
            onAcknowledge();
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="welcome-container page-container">
            <div className="welcome-content-container">
                <div className="header wrapper">
                    <h1>Welcome to CleanSlate!</h1>
                    <p>We&apos;re excited to have you on board!</p>
                </div>
                <section className="welcome-txt-wrapper">
                    <p className="welcome-txt">
                        We&apos;re almost ready to get your profile up and running.
                    </p>
                    <p className="welcome-txt">
                        By providing some details about yourself and your living space,
                        you&apos;ll help us create a more personalized experience tailored for you and your household.
                    </p>
                    <p className="welcome-txt">
                        The information you provide is essential for the functionality and ongoing improvement of CleanSlate.
                        We value your privacy and ensure that your data is secure and used solely for enhancing your experience with our app and internal testing.
                    </p>
                </section>
                <section className="privacy-policy">
                    <p className="privacy-txt">
                        For more information on how we handle your data, please review our <a href="/privacy-policy" target="/privacypolicy">Privacy Policy</a>.
                    </p>
                </section>
                <button className="welcome-btn btn-squared" onClick={handleAcknowledge}>
                    Let&apos;s get started!
                </button>
            </div>
        </div>
    );
};

WelcomeUser.propTypes = {
    onAcknowledge: PropTypes.func.isRequired,
};

export default WelcomeUser;

