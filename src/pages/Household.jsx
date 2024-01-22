import { useState, useEffect } from 'react';
import { getHouseholdChoreOverview, getHouseholdChoreOverviewForDoubleBar } from '../lib/api';
import HouseholdPie from '../components/HousholdPie';
import DoubleBarChart from '../components/DoubleBarChart';
import HouseholdCostComponent from '../components/HouseholdCostComponent';
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import './pagestyles/household.css';

const HouseholdPage = () => {
    useUpdateBodyClass("/household");

    const [pieChartData, setPieChartData] = useState([]);
    const [doubleBarChartData, setDoubleBarChartData] = useState([]);
    const [totalHouseholdValue, setTotalHouseholdValue] = useState(0);

    useEffect(() => {
        const fetchHouseholdData = async () => {
            try {
                const fetchedHouseholdData = await getHouseholdChoreOverview();
                setPieChartData(fetchedHouseholdData);

                const totalValue = fetchedHouseholdData.reduce((acc, member) => acc + member.totalValue, 0);
                setTotalHouseholdValue(totalValue);

            } catch (error) {
                console.error("Error fetching household data:", error);
            }
        };
        fetchHouseholdData();
    }, []);

    useEffect(() => {
        const fetchDoubleHouseholdData = async () => {
            try {
                const fetchedDoubleHouseholdData = await getHouseholdChoreOverviewForDoubleBar();
                setDoubleBarChartData(fetchedDoubleHouseholdData); // Use a separate state variable for double bar chart data
            } catch (error) {
                console.error("Error fetching double bar chart data:", error);
            }
        };
        fetchDoubleHouseholdData();
    }, []);

    return (
        <div className='page-container'>
            <h1 className='household-title'>Household Overview</h1>
            {pieChartData.length > 0 && doubleBarChartData.length > 0 ? (
                <>
                    <HouseholdPie householdData={pieChartData} />
                    <DoubleBarChart data={doubleBarChartData} /> {/* Pass the correct data to DoubleBarChart */}
                    <HouseholdCostComponent totalValue={totalHouseholdValue} />
                </>
            ) : (
                <p>Loading Household Data...</p>
            )}
        </div>
    );
};

export default HouseholdPage;

