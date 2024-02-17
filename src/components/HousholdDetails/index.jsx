import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { linkUserToHousehold } from '../../lib/api';
import JoinExistingHousehold from '../JoinExistingHousehold';
import './housedetails.css';

const HouseholdDetails = () => {
    const [householdName, setHouseholdName] = useState('');
    const [numberOfRooms, setNumberOfRooms] = useState('1');
    const [houseSize, setHouseSize] = useState('');
    const [householdId, setHouseholdId] = useState(null);
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

        try {
            const linkedHousehold = await linkUserToHousehold(householdName, houseSize, numberOfRooms, joinExisting);
            setFeedbackMessage(joinExisting ? "Successfully joined the household!" : "Household created successfully!");
            setHouseholdId(linkedHousehold.household_id);
            navigate({ to: "/dashboard" });
        } catch (error) {
            setFeedbackMessage(error.message || "An error occurred.");
        }
    };

    const handleJoinSuccess = (joinedHouseholdId) => {
        setFeedbackMessage("Successfully joined the household!");
        setHouseholdId(joinedHouseholdId);
        navigate({ to: "/dashboard" });
    };

    const handleCancelJoin = () => {
        setJoinExisting(false);
    };
    return (
        <div className='container_householdform'>
            <form className='householdform' onSubmit={handleSubmit}>
                <h1 className='header_householdform'>Household details</h1>
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
                            householdId={householdId}
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
                                        <option value="">Select size</option>
                                        <option value="20">Up to 20 kvm</option>
                                        <option value="40">Up to 40 kvm</option>
                                        <option value="60">Up to 60 kvm</option>
                                        <option value="80">Up to 80 kvm</option>
                                        <option value="100">Up to 100 kvm</option>
                                        <option value="120">Up to 120 kvm</option>
                                        <option value="140">Up to 140 kvm</option>
                                        <option value="160">Up to 160 kvm</option>
                                        <option value="180">Up to 180 kvm</option>
                                        <option value="200+">200 kvm or more</option>
                                    </select>
                                    {houseSizeError && !joinExisting && <p className="error-message">{houseSizeError}</p>}
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
