import { useState, useEffect } from 'react';
import { getHouseholdChoreOverview, getCompleteUser } from '../lib/api';
import HouseholdPie from '../components/HousholdPie';
import HouseholdCostComponent from '../components/HouseholdCostComponent';
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import './pagestyles/household.css';

const HouseholdPage = () => {
    useUpdateBodyClass("/household");

    const [householdData, setHouseholdData] = useState([]);
    const [completeUser, setCompleteUser] = useState(null);

    useEffect(() => {
        const fetchHouseholdData = async () => {
            try {
                const fetchedHouseholdData = await getHouseholdChoreOverview();
                setHouseholdData(fetchedHouseholdData);

                // Fetch completeUser data
                const fetchedCompleteUser = await getCompleteUser();
                setCompleteUser(fetchedCompleteUser);
            } catch (error) {
                console.error("Error fetching household data:", error);
            }
        };
        fetchHouseholdData();
    }, []);

    return (
        <div className='page-container'>
            <h1 className='household-title'>Household Overview</h1>
            {householdData.length > 0 ? (
                <>
                    <HouseholdPie householdData={householdData} completeUser={completeUser} />
                    <HouseholdCostComponent householdData={householdData} />
                </>
            ) : (
                <p>Loading Household Data...</p>
            )}
        </div>
    );
};

export default HouseholdPage;


