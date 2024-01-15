import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { linkUserToHousehold, joinExistingHousehold } from '../../lib/api';
import './housedetails.css';

const HouseholdDetails = () => {
    const [householdName, setHouseholdName] = useState('');
    const [numberOfRooms, setNumberOfRooms] = useState('1');
    const [houseSize, setHouseSize] = useState('');
    const [joinExisting, setJoinExisting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const navigate = useNavigate();

    const incrementRooms = () => {
        const currentRooms = parseInt(numberOfRooms, 10); // Parse as integer
        setNumberOfRooms(currentRooms + 1);
    };

    const decrementRooms = () => {
        const currentRooms = parseInt(numberOfRooms, 10); // Parse as integer
        setNumberOfRooms(currentRooms > 1 ? currentRooms - 1 : 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedbackMessage('');

        try {
            if (joinExisting) {
                await joinExistingHousehold(householdName);
                setFeedbackMessage("Successfully joined the household!");
            } else {
                await linkUserToHousehold(householdName, houseSize, numberOfRooms);
                setFeedbackMessage("Household created successfully!");
            }
            navigate({ to: "/dashboard" });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            <section className="household-info">
                <p className="household-info-txt">
                    Almost there! Let&apos;s get your household set up!
                </p>
                <p className="household-info-txt">
                    Choose a unique household name to connect with your partner or flatmates, and let us know the size of your place in square meters.
                </p>
                <p className="household-info-txt">
                    This helps us to tailor chores and tips specifically for your living space. Your details are kept private and are just for making sure our suggestions hit the spot!
                </p>
            </section>

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
                            Connect to an existing household
                        </label>
                    </div>
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
                    </div>
                    {!joinExisting && (
                        <>
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
                            </div>
                        </>
                    )}
                </div>
                {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}m
                <button className='btn-squared householdform-btn' type="submit">
                    {joinExisting ? "Join Household" : "Create Household"}
                </button>
            </form>
        </>
    );
};

export default HouseholdDetails;
