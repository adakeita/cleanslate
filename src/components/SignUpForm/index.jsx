import { useState } from 'react';
import supabase from '../../lib/supabaseClient';

function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [pronouns, setPronouns] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.signUp({ email, password, first_name: firstName, last_name: lastName, username, pronouns });

        if (error) {
            console.error('Error signing up:', error);
        } else {
            console.log('User signed up successfully');
            // You don't need to insert user details manually here
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
            <select value={pronouns} onChange={e => setPronouns(e.target.value)}>
                <option value="they/them">They/Them</option>
                <option value="she/her">She/Her</option>
                <option value="he/him">He/Him</option>
            </select>
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default SignupForm;

