import PropTypes from "prop-types";
import Modal from "../Modal";
import { useState } from "react";
import "./welcomeuser.css";

const WelcomeUser = ({ onAcknowledge }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleAcknowledge = () => {
    try {
      onAcknowledge();
    } catch (error) {
      setModalMessage(error.message);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="welcome-container page-container">
      <div className="welcome-content-container">
        <div className="header wrapper">
          <h1>Welcome to CleanSlate!</h1>
          <p className="ingress">We&apos;re excited to have you on board!</p>
        </div>
        <section className="welcome-txt-wrapper">
          <p className="welcome-txt">
            Let's finalize your profile. By sharing a few details about you and
            your household, we tailor CleanSlate to your needs.
          </p>
          <p className="welcome-txt">
            Your profile is crucial for our application&apos;s functionality and
            continuous improvement. We prioritize your privacy, ensuring data
            security and use it exclusively to enhance your CleanSlate
            experience.
          </p>
        </section>
        <section className="privacy-policy">
          <p className="privacy-txt">
            For more information on how we handle your data, please review our{" "}
            <a href="/privacypolicy" target="/privacypolicy">
              Privacy Policy
            </a>
            .
          </p>
        </section>
        <button className="welcome-btn btn-squared" onClick={handleAcknowledge}>
          Let&apos;s get started!
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="modal-msg">{modalMessage}</div>
      </Modal>
    </div>
  );
};

WelcomeUser.propTypes = {
  onAcknowledge: PropTypes.func.isRequired,
};

export default WelcomeUser;
