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

  const handleLogin = async (e) => {
    e.preventDefault();
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
      setModalMessage("Login successful:)");
      setIsModalOpen(true);
      navigate({ to: "/dashboard" });
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  return (
    <div className="loginform-container">
      <form className="loginform" onSubmit={handleLogin}>
            <h1 className="loginform-title">Login</h1>
            <div className="content-wrapper_login">
              <div className="input-wrapper_login">
                <div
                  className={`loginform-col ${
                    emailError ? "input-invalid" : ""
                  }`}
                >
                  <label htmlFor="email"></label>
                  <input
                    id="email"
                    className="login-inputfield"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                  {emailError && <p className="error-message">{emailError}</p>}
                </div>
                <div
                  className={`loginform-col ${
                    passwordError ? "input-invalid" : ""
                  }`}
                >
                  <label htmlFor="password"></label>
                  <input
                    id="password"
                    className="login-inputfield"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && (
                    <p className="error-message">{passwordError}</p>
                  )}
                </div>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <div className="modal-msg">{modalMessage}</div>
                </Modal>
              </div>
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
