import PropTypes from 'prop-types';
import { useState } from 'react';
import { linkUserToHousehold } from '../../lib/api';
import { joinExistingHousehold } from '../../lib/api';
import './joinexisting.css';

const JoinExistingHousehold = ({ onJoinSuccess, onCancel }) => {
    const [householdName, setHouseholdName] = useState('');
    const [message, setMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const checkHouseholdExistence = async () => {
        try {
            const household = await joinExistingHousehold(householdName);
            if (household.exists) {
                setMessage(`Household '${householdName}' already has members: ${household.memberNames}. Did you mean to join this household?`);
                setShowConfirmation(true);
            } else {
                setMessage("Sorry, there doesn't seem to be a household by that name. Check your spelling and try again.");
                setShowConfirmation(false);
            }
        } catch (error) {
            setMessage(error.message || "An error occurred.");
            setShowConfirmation(false);
        }
    };

    const handleJoin = async () => {
        try {
            const { household_id } = await linkUserToHousehold(householdName, null, null, true);
            onJoinSuccess(household_id);
        } catch (error) {
            setMessage(error.message || "An error occurred.");
        }
    };


    return (
        <div className='join-existing-wrapper household-col'>
            <label className='visually-hidden householdform-label' htmlFor="join-household-name">joinhousehold</label>
            <input
                id='join-household-name'
                className='household-inputfield check-household-inputfield'
                type="text"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="Enter household name"
            />
            <button className='btn-squared check-household-btn' onClick={checkHouseholdExistence}>Find Household</button>
            {message && <p className='check-household-msg'>{message}</p>}
            {showConfirmation && (
                <div className='household-confirm-btn-wrapper'>
                    <button className='btn-squared household-confirm-btn yes-btn' onClick={handleJoin}>Yes</button>
                    <button className='btn-squared household-confirm-btn no-btn' onClick={onCancel}>Cancel</button>
                </div>
            )}
        </div>
    );
};

JoinExistingHousehold.propTypes = {
    onJoinSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default JoinExistingHousehold;
