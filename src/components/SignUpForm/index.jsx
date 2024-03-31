import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AvatarSelection from "../AvatarSelection";
import { newAvatars } from "../../lib/avatar.js";
import PropTypes from "prop-types";
import Modal from "../Modal";
import "./signup.css";

const SignupForm = () => {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [pronouns, setPronouns] = useState("they/them");
  const [avatar, setAvatar] = useState("");
  const [avatarError, setAvatarError] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
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

    if (!username.trim()) {
      setUsernameError("Please enter a username.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!avatar) {
      setAvatarError("Please select an avatar.");
      isValid = false;
    } else {
      setAvatarError("");
    }

    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signUp(email, password, username, pronouns, avatar);
      navigate("/dashboard");
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  const handleAvatarClick = (avatarSrc) => {
    setAvatar(avatarSrc);
  };

  return (
    <div className="signupform-container">
      <form className="signupform" onSubmit={handleSignup}>
        <h1 className="header_signup">Sign Up</h1>
        <div className="content-wrapper_signup">
          <div className="infofields-wrapper_signup">
            <section className="input-wrapper_auth">
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
            <section className="personalia-wrapper_signup">
              <div className="signupform-col">
                <label htmlFor="username" className="signup-label">
                  Username
                </label>
                <input
                  className="signup-inputfield"
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  placeholder="Username"
                />
                {usernameError && (
                  <p className="error-message">{usernameError}</p>
                )}
              </div>
              <div className="signupform-col">
                <label htmlFor="pronouns" className="signup-label">
                  Pronouns
                </label>
                <select
                  className="signup-inputfield"
                  id="pronouns"
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                >
                  <option value="they/them">They/Them</option>
                  <option value="she/her">She/Her</option>
                  <option value="he/him">He/Him</option>
                </select>
              </div>
            </section>
          </div>
          <section className="avatar-wrapper_signup">
            <h2 className="avatar-header_signup">Select Avatar</h2>
            <AvatarSelection
              selectedAvatar={avatar}
              onAvatarSelect={setAvatar}
              avatars={newAvatars}
            />
            {avatarError && <p className="error-message">{avatarError}</p>}
          </section>
        </div>
        <div className="btn-wrapper_signup">
          <button className="btn signup-btn" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
