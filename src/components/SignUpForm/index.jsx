import { useState } from 'react';
import { signUp } from "../../lib/api";
import { useNavigate } from '@tanstack/react-router';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await signUp(email, password);
            console.log("Signup successful, navigating to complete profile");
            navigate({ to: "/completeprofile" });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignupForm;