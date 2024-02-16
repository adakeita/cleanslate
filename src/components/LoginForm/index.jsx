import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import Modal from "../Modal";
import "./login.css";

const LoginForm = () => {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();

  const ModalContent = () => (
    <div className="modalcontent-container">
      <p className="modal-text">Login successful, Redirecting to dashboard...</p>
    </div>
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setModalMessage(<ModalContent />);
    let isValid = true;

    if (!email) {
      setEmailError("Please enter an email.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Please enter a password.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    try {
      await signIn(email, password);

      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        navigate({ to: "/dashboard" });
      }, 2000);

    } catch (error) {
      setPasswordError(error.message);
    }
  };

  return (
    <div className="loginform-container">
      <form className="loginform" onSubmit={handleLogin}>
        <h1 className="header_login">Login</h1>
        <div className="content-wrapper_login">
          <section className="inputfield-wrapper_login">
            <div
              className={`loginform-col input-item ${
                emailError ? "input-invalid" : ""
              }`}
            >
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="inputfield_login"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>
            <div
              className={`loginform-col input-item ${
                passwordError ? "input-invalid" : ""
              }`}
            >
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="inputfield_login"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <div className="modal-msg">{modalMessage}</div>
            </Modal>
          </section>
          <div className="btn-wrapper_login">
            <button className="login-btn btn" type="submit">
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
