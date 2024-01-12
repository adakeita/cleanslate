import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { updateUserDetails } from '../../lib/api';
import './userdetails.css';
import avatar1 from '../../assets/avatar/avatar1.png';
import avatar2 from '../../assets/avatar/avatar2.png';

const UserDetails = () => {
    const [username, setUsername] = useState('');
    const [pronouns, setPronouns] = useState('they/them');
    const [avatar, setAvatar] = useState('');
    const isAvatarSelected = (avatarSrc) => avatar === avatarSrc;

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserDetails(username, pronouns, avatar);
            navigate({ to: "/dashboard" });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form className="complete-profileform" onSubmit={handleSubmit}>
            <h1 className="complete-profileform-title">Complete your profile</h1>
            <div className="complete-profileform-content">
                <section className="avatar-select-wrapper">
                    <label>Select an avatar:</label>
                    <div className="avatar-img-row">
                        <div className={`avatar-img-container ${isAvatarSelected(avatar1) ? 'selected' : ''}`}>
                            <img src={avatar1} alt="Avatar 1" onClick={() => setAvatar(avatar1)} />
                        </div>
                        <div className={`avatar-img-container ${isAvatarSelected(avatar2) ? 'selected' : ''}`}>
                            <img src={avatar2} alt="Avatar 2" onClick={() => setAvatar(avatar2)} />
                        </div>
                    </div>
                </section>
                <section className="user-detail-fields">
                    <div className="user-detail-col">
                        <label className='user-detail-label'>Username:</label>
                        <input className="complete-user-input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                    </div>
                    <div className="user-detail-col">
                        <label className='user-detail-label'>Pronouns:</label>
                        <select className="complete-user-input" value={pronouns} onChange={e => setPronouns(e.target.value)}>
                            <option value="they/them">They/Them</option>
                            <option value="she/her">She/Her</option>
                            <option value="he/him">He/Him</option>
                        </select>
                    </div>
                </section>
            </div>
            <button className="btn-rounded complete-user-btn" type="submit">That&apos;s me!</button>
        </form>
    );
};

export default UserDetails;
