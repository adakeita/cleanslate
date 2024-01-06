import { useState } from 'react';
import { signUp } from "../../lib/api"; // Adjust this import path as necessary

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [pronouns, setPronouns] = useState('they/them');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const user = await signUp(email, password, name, username, pronouns);
            console.log("Signup successful, user:", user);
            // Redirect or further actions after successful signup
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
            <select value={pronouns} onChange={e => setPronouns(e.target.value)}>
                <option value="they/them">They/Them</option>
                <option value="he/him">He/Him</option>
                <option value="she/her">She/Her</option>
                {/* Add more options as needed */}
            </select>
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignupForm;

