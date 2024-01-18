import { useState, useEffect } from 'react';
import { getUserChoreOverview } from '../lib/api';
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
import { getCompleteUser } from "../lib/api";
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
        const fetchUserDetails = async () => {
            try {
                const completeUser = await getCompleteUser();
                setUserDetails({
                    username: completeUser.username,
                });
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUserDetails();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 440);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const overview = await getUserChoreOverview();

                setGrandTotalCost(overview.grandTotalCost);
                setGrandTotalMinutes(overview.grandTotalMinutes);

                const totalMinutes = overview.overviewData.reduce((acc, cat) => acc + cat.total_minutes, 0);
                overview.overviewData.forEach(cat => {
                    cat.percentage = totalMinutes > 0 ? ((cat.total_minutes / totalMinutes) * 100).toFixed(2) : 0;
                });

                const pieData = {
                    labels: overview.overviewData.map(cat => cat.category_name),
                    datasets: [{
                        data: overview.overviewData.map(cat => cat.total_minutes),
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
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    const category = tooltipItem.label;
                                    const percentage = overview.overviewData[tooltipItem.dataIndex].percentage;
                                    return `${category}: (${percentage}%)`;
                                }
                            }
                        },
                        // Conditionally apply the datalabels plugin based on the isMobile state
                        ...(isMobile && {
                            datalabels: {
                                display: true,
                                color: 'black',
                                formatter: (value, context) => {
                                    const percentage = overview.overviewData[context.dataIndex].percentage;
                                    return `${percentage}%`;
                                },
                            }
                        }),
                    }
                };

                setPieChartData({ data: pieData, options: pieOptions });
            } catch (error) {
                console.error("Error fetching overview data:", error);
            }
        };

        fetchOverview();
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


    return (
        <div className='page-container'>
            <h1 className='user-overview-title'>{userDetails.username}&apos;s overview</h1>
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
            <>
                <TotalCostComponent
                    totalCost={grandTotalCost}
                    totalTime={`Time spent: ${Math.floor(grandTotalMinutes / 60)}h ${grandTotalMinutes % 60}min`}
                />
            </>

        </div>
    );
};

export default OverviewPage;