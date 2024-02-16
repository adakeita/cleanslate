import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import "./signup.css";

const SignupForm = () => {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
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

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!isValid) return;

    try {
      await signUp(email, password);
      navigate({ to: "/completeprofile" });
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  return (
    <div className="signupform-container">
      <form className="signupform" onSubmit={handleSignup}>
        <h1 className="header_signup">Sign Up</h1>
        <div className="content-wrapper_signup">
          <section className="inputfield-wrapper_signup">
            <div className="email-wrapper">
              <div
                className={`signupform-col  ${
                  emailError ? "input-invalid" : ""
                }`}
              >
                <label htmlFor="email" className="signup-label">
                  Email
                </label>
                <input
                  className="signup-inputfield"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                {emailError && <p className="error-message">{emailError}</p>}
              </div>
            </div>
            <div className="passwd-wrapper_signup">
              <div
                className={`signupform-col ${
                  passwordError ? "input-invalid" : ""
                }`}
              >
                <label htmlFor="choose-password" className="signup-label">
                  Choose Password
                </label>
                <input
                  className="signup-inputfield"
                  id="choose-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}
              </div>
              <div
                className={`signupform-col ${
                  confirmPasswordError ? "input-invalid" : ""
                }`}
              >
                <label htmlFor="confirm-password" className="signup-label">
                  Confirm Password
                </label>
                <input
                  className="signup-inputfield"
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
              </div>
              {confirmPasswordError && (
                <p className="error-message">{confirmPasswordError}</p>
              )}
            </div>
          </section>
          <div className="btn-wrapper_signup">
            <button className="btn signup-btn" type="submit">
              Let&apos;s go!
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
