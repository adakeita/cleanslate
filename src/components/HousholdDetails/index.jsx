import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { linkUserToHousehold } from '../../lib/api';
import JoinExistingHousehold from '../JoinExistingHousehold';
import './housedetails.css';

const HouseholdDetails = () => {
    const [householdName, setHouseholdName] = useState('');
    const [numberOfRooms, setNumberOfRooms] = useState('1');
    const [houseSize, setHouseSize] = useState('');
    const [joinExisting, setJoinExisting] = useState(false);
    const [householdNameError, setHouseholdNameError] = useState('');
    const [houseSizeError, setHouseSizeError] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const navigate = useNavigate();

    const incrementRooms = () => {
        const currentRooms = parseInt(numberOfRooms, 10);
        setNumberOfRooms(currentRooms + 1);
    };

    const decrementRooms = () => {
        const currentRooms = parseInt(numberOfRooms, 10);
        setNumberOfRooms(currentRooms > 1 ? currentRooms - 1 : 1);
    };

    const validateForm = () => {
        let isValid = true;
        if (!householdName.trim()) {
            setHouseholdNameError('Please enter a household name.');
            isValid = false;
        } else {
            setHouseholdNameError('');
        }

        if (!joinExisting && !houseSize.trim()) {
            setHouseSizeError('Please select house size.');
            isValid = false;
        } else {
            setHouseSizeError('');
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedbackMessage('');

        if (!validateForm()) {
            return;
        }

        if (joinExisting) {
            return;
        }

        try {
            await linkUserToHousehold(householdName, houseSize, numberOfRooms, joinExisting);
            setFeedbackMessage("Household created successfully!");
            navigate({ to: "/dashboard" });
        } catch (error) {
            setFeedbackMessage(error.message || "An error occurred.");
        }
    };

    const handleJoinSuccess = () => {
        setFeedbackMessage("Successfully joined the household!");
        navigate({ to: "/dashboard" });
    };

    const handleCancelJoin = () => {
        setJoinExisting(false);
    };
    return (
        <div className='household-container'>
            <form className='household-form' onSubmit={handleSubmit}>
                <h1 className='household-form-title'>Household details</h1>
                <div className="household-form-content">
                    <div className="toggle-join-create">
                        <label>
                            <input
                                type="checkbox"
                                checked={joinExisting}
                                onChange={() => setJoinExisting(!joinExisting)}
                            />
                            Connect to existing household
                        </label>
                    </div>
                    {joinExisting ? (
                        <JoinExistingHousehold
                            onJoinSuccess={handleJoinSuccess}
                            onCancel={handleCancelJoin}
                        />
                    ) : (
                        <>
                            <div className="household-default-columns">
                                <div className="household-col">
                                    <label className='householdform-label' htmlFor="household-name">Household name</label>
                                    <input
                                        className='household-inputfield'
                                        id='household-name'
                                        type="text"
                                        value={householdName}
                                        onChange={(e) => setHouseholdName(e.target.value)}
                                        placeholder="Household Name"
                                    />
                                    {householdNameError && <p className="error-message">{householdNameError}</p>}
                                </div>
                                <div className="household-col">
                                    <label className='householdform-label' htmlFor="number-of-rooms">No. rooms</label>
                                    <div className='room-btn-container'>
                                        <button className='room-btn' type="button" onClick={decrementRooms}>-</button>
                                        <span className='current-room-selection'>{numberOfRooms}</span>
                                        <button className='room-btn' type="button" onClick={incrementRooms}>+</button>
                                    </div>
                                </div>
                                <div className="household-col">
                                    <label className='householdform-label' htmlFor="house-size">House Size (kvm)</label>
                                    <select className='household-inputfield' value={houseSize} onChange={(e) => setHouseSize(e.target.value)}>
                                        {/* House size options */}
                                    </select>
                                    {houseSizeError && <p className="error-message">{houseSizeError}</p>}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
                {!joinExisting && <button className='btn-squared householdform-btn' type="submit">Create Household</button>}
            </form>
        </div>
    );
};

export default HouseholdDetails;
