import { useState, useContext } from 'react';
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from '@tanstack/react-router';
import './login.css';

const LoginForm = () => {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
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

        if (!isValid) return;

        try {
            await signIn(email, password);
            alert('Login successful!');
            navigate({ to: "/dashboard" });
        } catch (error) {
            setPasswordError(error.message);
        }
    };

    return (
        <form className='loginform' onSubmit={handleLogin}>
            <h1 className='loginform-title'>Login</h1>
            <div className="loginform-content">
                <div className={`loginform-col ${emailError ? 'input-invalid' : ''}`}>
                    <label htmlFor="email"></label>
                    <input
                        id='email'
                        className='login-inputfield'
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete='email'
                    />
                    {emailError && <p className="error-message">{emailError}</p>}
                </div>
                <div className={`loginform-col ${passwordError ? 'input-invalid' : ''}`}>
                    <label htmlFor="password"></label>
                    <input
                        id='password'
                        className='login-inputfield'
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                </div>
            </div>
            <button className='login-btn btn-squared' type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
