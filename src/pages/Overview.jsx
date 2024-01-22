import { useState, useEffect } from 'react';
import { getUserChoreOverview, getCompleteUser, updateUserChores } from '../lib/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useUpdateBodyClass } from '../hooks/useUpdateBodyClass';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import TotalCostComponent from '../components/TotalCostComponent';
import '../styles/customlegend.css';
import './pagestyles/overview.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartDataLabels
);

const OverviewPage = () => {
    useUpdateBodyClass("/overview");

    const [grandTotalCost, setGrandTotalCost] = useState(0);
    const [grandTotalMinutes, setGrandTotalMinutes] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 440);
    const [pieChartData, setPieChartData] = useState(null);
    const [userDetails, setUserDetails] = useState({
        username: '',
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 440);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const completeUser = await getCompleteUser();
                await updateUserChores(completeUser.userDetailsId);
                const updatedCompleteUser = JSON.parse(sessionStorage.getItem('completeUser'));


                setUserDetails({
                    authUserId: updatedCompleteUser.authUserId,
                    userDetailsId: updatedCompleteUser.userDetailsId,
                    username: updatedCompleteUser.username,
                });

                const overviewData = await getUserChoreOverview(updatedCompleteUser.userDetailsId);

                const totalMinutes = overviewData.reduce((acc, item) => acc + item.total_minutes, 0);
                const totalCost = overviewData.reduce((acc, item) => acc + item.total_cost, 0);
                setGrandTotalCost(totalCost);
                setGrandTotalMinutes(totalMinutes);

                const pieData = {
                    labels: overviewData.map(item => item.category_name),
                    datasets: [{
                        data: overviewData.map(item => item.total_minutes),
                        backgroundColor: [
                            'rgba(227, 147, 89, 0.8)',
                            'rgba(65, 129, 228, 0.8)',
                            'rgba(255, 203, 0, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                        ],
                        borderWidth: 3
                    }]
                };

                const pieOptions = {
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    const category = tooltipItem.label;
                                    const percentage = (pieData.datasets[0].data[tooltipItem.dataIndex] / totalMinutes * 100).toFixed(2);
                                    return `${category}: (${percentage}%)`;
                                }
                            }
                        },
                        datalabels: isMobile ? {
                            display: true,
                            color: 'black',
                            formatter: (value) => {
                                const percentage = (value / totalMinutes * 100).toFixed(2);
                                return `${percentage}%`;
                            },
                        } : { display: false },
                    }
                };

                setPieChartData({ data: pieData, options: pieOptions });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [isMobile]);

    const renderCustomLegend = () => {
        if (!pieChartData) return null;

        return (
            <div className="custom-legend">
                {pieChartData.data.labels.map((label, index) => (
                    <div key={index} className="legend-item">
                        <span
                            className="legend-color"
                            style={{
                                backgroundColor: pieChartData.data.datasets[0].backgroundColor[index],
                            }}
                        ></span>
                        <span className="legend-label">{label}</span>
                    </div>
                ))}
            </div>
        );
    };

    const hasNoData = () => grandTotalMinutes === 0 && grandTotalCost === 0;

    const renderNoDataMessage = () => (
        <div className="no-data-message">
            <p>Nothing to see here yet!</p>
            <p>Start logging your chores to see them appear here.</p>
        </div>
    );

    return (
        <div className='page-container'>
            <h1 className='user-overview-title'>{userDetails?.username}&apos;s overview</h1>
            {hasNoData() ? (
                renderNoDataMessage()
            ) : (
                <>
                    {pieChartData ? (
                        <div className='piechart-container'>
                            <Pie
                                className='piechart'
                                data={pieChartData.data}
                                options={pieChartData.options}
                                style={{ maxWidth: '300px', maxHeight: '300px', margin: '0 auto' }}
                            />
                            {renderCustomLegend()}
                        </div>
                    ) : (
                        <p>Loading Pie Chart...</p>
                    )}
                    <TotalCostComponent
                        totalCost={grandTotalCost}
                        totalTime={`Time spent: ${Math.floor(grandTotalMinutes / 60)}h ${grandTotalMinutes % 60}min`}
                    />
                </>
            )}
        </div>
    );
};

export default OverviewPage;