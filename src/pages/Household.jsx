import { useState, useEffect } from 'react';
import { getHouseholdChoreOverview } from '../lib/api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import HouseholdCostComponent from '../components/HouseholdCostComponent';
import './pagestyles/household.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const HouseholdPage = () => {
    useUpdateBodyClass("/household");

    const [pieChartData, setPieChartData] = useState(null);
    const [totalHouseholdValue, setTotalHouseholdValue] = useState(0);


    useEffect(() => {
        const fetchHouseholdData = async () => {
            try {
                const householdData = await getHouseholdChoreOverview();

                // Preparing pie chart data
                const labels = householdData.map(member => member.username);
                const totalMinutes = householdData.map(member => member.totalMinutes);

                const totalValue = householdData.reduce((acc, member) => acc + member.totalValue, 0);
                setTotalHouseholdValue(totalValue);

                const data = {
                    labels,
                    datasets: [{
                        data: totalMinutes,
                        backgroundColor: [
                            // Add different colors for each slice
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            // ... more colors as needed
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            // ... more border colors as needed
                        ],
                        borderWidth: 1
                    }]
                };

                setPieChartData(data);

            } catch (error) {
                console.error("Error fetching household data:", error);
            }
        };
        fetchHouseholdData();
    }, []);

    return (
        <div className='page-container'>
            <h1 className='household-title'>Household Overview</h1>
            {pieChartData ? (
                <div className='piechart-container'>
                    <Pie data={pieChartData} />
                </div>
            ) : (
                <p>Loading Household Data...</p>
            )}
            <HouseholdCostComponent totalValue={totalHouseholdValue} />
        </div>
    );
};

export default HouseholdPage;

