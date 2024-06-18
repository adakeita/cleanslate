import { useEffect } from "react";
import PropTypes from "prop-types";
import exit from "../../assets/svg/exit-cross.svg";
import "./modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="btn-wrapper_modal">
          <button
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <img src={exit} alt="Close modal" />
          </button>
        </div>
        <div className="text_modal">
          {children || <div>No content available</div>}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Modal;
