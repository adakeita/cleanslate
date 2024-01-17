import { useState, useEffect } from 'react';
import { getUserChoreOverview } from '../lib/api';
import { UserPieChart } from '../components/UserPieChart';
import { UserBarChart } from '../components/UserBarChart';
import { useUpdateBodyClass } from '../hooks/useUpdateBodyClass';

const OverviewPage = () => {
    useUpdateBodyClass("/overview");
    const [pieChartData, setPieChartData] = useState(null);
    const [barChartData, setBarChartData] = useState(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const overview = await getUserChoreOverview();

                const pieData = {
                    labels: overview.overviewData.map(cat => cat.category_name),
                    datasets: [{
                        data: overview.overviewData.map(cat => cat.total_hours),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                        ],
                        borderWidth: 1
                    }]
                };

                const barData = {
                    labels: overview.overviewData.map(cat => cat.category_name),
                    datasets: [{
                        label: 'Total Cost by Category',
                        data: overview.overviewData.map(cat => cat.total_cost),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                        ],
                        borderWidth: 1
                    }]
                };

                setPieChartData(pieData);
                setBarChartData(barData);
            } catch (error) {
                console.error("Error fetching overview data:", error);
            }
        };

        fetchOverview();
    }, []);

    return (
        <div>
            <h1>Overview</h1>
            {pieChartData ? <UserPieChart data={pieChartData} /> : <p>Loading Pie Chart...</p>}
            {barChartData ? <UserBarChart data={barChartData} /> : <p>Loading Bar Chart...</p>}
        </div>
    );
};

export default OverviewPage;