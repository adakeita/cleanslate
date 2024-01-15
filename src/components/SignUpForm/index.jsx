import { useState } from 'react';
import { signUp } from "../../lib/api";
import { useNavigate } from '@tanstack/react-router';
import './signup.css';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!email) {
            setEmailError('Please enter an email.');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Please enter a password.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password.');
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        if (!isValid) return;

        try {
            await signUp(email, password);
            console.log("Signup successful, navigating to complete profile");
            navigate({ to: "/completeprofile" });
        } catch (error) {
            setPasswordError(error.message);
        }
    };

    return (
        <form className="signup-form" onSubmit={handleSignup}>
            <h1 className="signup-form-title">Sign Up</h1>
            <div className="signup-form-content">
                <div className={`signupform-col ${emailError ? 'input-invalid' : ''}`}>
                    <label htmlFor="email" className="signup-label">Email</label>
                    <input
                        className='signup-inputfield'
                        id='email'
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        autoComplete='email'
                    />
                    {emailError && <p className="error-message">{emailError}</p>}
                </div>
                <div className={`signupform-col ${passwordError ? 'input-invalid' : ''}`}>
                    <label htmlFor="choose-password" className="signup-label">Choose Password</label>
                    <input
                        className='signup-inputfield'
                        id='choose-password'
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                </div>
                <div className={`signupform-col ${confirmPasswordError ? 'input-invalid' : ''}`}>
                    <label htmlFor="confirm-password" className="signup-label">Confirm Password</label>
                    <input
                        className='signup-inputfield'
                        id='confirm-password'
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                    />
                </div>
                {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
            </div>
            <button className='btn-squared signup-btn' type="submit">Let&apos;s go!</button>
        </form>
    );
};

export default SignupForm;
