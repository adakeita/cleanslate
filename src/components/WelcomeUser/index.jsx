import PropTypes from 'prop-types';


const WelcomeUser = ({ onComplete }) => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            onComplete();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="welcome-container">
            <div className="header wrapper">
                <h1>Welcome to CleanSlate</h1>
                <p>Let&apos;s get you started!</p>
            </div>
            <section className="welcome-txt-wrapper">
                <p className="welcome-txt">
                    Almost there! Let&apos;s get your household set up!
                </p>
                <p className="welcome-txt">
                    Choose a unique household name to connect with your partner or flatmates, and let us know the size of your place in square meters.
                </p>
                <p className="welcome-txt">
                    This helps us to tailor chores and tips specifically for your living space. Your details are kept private and are just for making sure our suggestions hit the spot!
                </p>
            </section>
            <button onClick={handleSubmit}>
                Get Started
            </button>
        </div >
    )
};

WelcomeUser.propTypes = {
    onComplete: PropTypes.func.isRequired,
};

export default WelcomeUser;