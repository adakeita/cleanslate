import { useState } from 'react';
import { updateUserDetails } from '../../lib/api';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import avatar1 from '../../assets/avatar/avatar1.png';
import alternateavatar1 from '../../assets/avatar/alternate-avatar1.png';
import alternateavatar2 from '../../assets/avatar/alternate-avatar2.png';
import avatar2 from '../../assets/avatar/avatar2.png';

const UserDetails = ({ onComplete }) => {
    const [username, setUsername] = useState('');
    const [pronouns, setPronouns] = useState('they/them');
    const [avatar, setAvatar] = useState('');
    const [alternateAvatar, setAlternateAvatar] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [avatarError, setAvatarError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const isAvatarSelected = (avatarSrc) => avatar === avatarSrc;

    const avatarToAlternateMap = {
        [avatar1]: alternateavatar1,
        [avatar2]: alternateavatar2,
    };

    const handleAvatarClick = (avatarSrc) => {
        setAvatar(avatarSrc);
        const alternateAvatarSrc = avatarToAlternateMap[avatarSrc];
        setAlternateAvatar(alternateAvatarSrc || avatarSrc);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isValid = true;
        if (!username.trim()) {
            setUsernameError('Please enter a username.');
            isValid = false;
        } else {
            setUsernameError('');
        }

        if (avatar === '') {
            setAvatarError('Please select an avatar.');
            isValid = false;
        } else {
            setAvatarError('');
        }

        if (!isValid) return;

        try {
            await updateUserDetails(username, pronouns, avatar, alternateAvatar);
            onComplete();
        } catch (error) {
            setModalMessage(error.message);
            setIsModalOpen(true);
        }
    };

    return (
        <form className="complete-user-detailform" onSubmit={handleSubmit}>
            <h1 className="complete-user-detailform-title">Profile Details</h1>
            <div className="complete-user-detailform-content">
                <section className={`avatar-select-wrapper ${avatarError ? 'avatar-invalid' : ''}`}>
                    <label>Select an avatar:</label>
                    <div className="avatar-img-row">
                        <div className={`avatar-img-container ${isAvatarSelected(avatar1) ? 'selected' : ''}`}>
                            <img src={avatar1} alt="Avatar 1" onClick={() => handleAvatarClick(avatar1)} />
                        </div>
                        <div className={`avatar-img-container ${isAvatarSelected(avatar2) ? 'selected' : ''}`}>
                            <img src={avatar2} alt="Avatar 2" onClick={() => handleAvatarClick(avatar2)} />
                        </div>
                    </div>
                    {avatarError && <p className="error-message">{avatarError}</p>}
                </section>
                <section className="user-detail-fields">
                    <div className={`user-detail-col ${usernameError ? 'input-invalid' : ''}`}>
                        <label className='user-detail-label'>Username:</label>
                        <input
                            className="complete-user-input"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                        {usernameError && <p className="error-message">{usernameError}</p>}
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
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="modal-msg">
                        {modalMessage}
                    </div>
                </Modal>
            </div>
            <button className="btn-squared complete-user-btn" type="submit">That&apos;s me!</button>
        </form>
    );
};


UserDetails.propTypes = {
    onComplete: PropTypes.func.isRequired,
};

export default UserDetails;
