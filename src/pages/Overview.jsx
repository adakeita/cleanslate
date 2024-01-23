import { useState, useEffect } from 'react';
import { getUserChoreOverview, getCompleteUser, updateUserChores } from '../lib/api';
import OverviewPie from '../components/OverviewPie';
import TotalCostComponent from '../components/TotalCostComponent';
import { useUpdateBodyClass } from '../hooks/useUpdateBodyClass';
import '../styles/customlegend.css';
import './pagestyles/overview.css';


const OverviewPage = () => {
    useUpdateBodyClass("/overview");

    const [grandTotalCost, setGrandTotalCost] = useState(0);
    const [grandTotalMinutes, setGrandTotalMinutes] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 440);
    const [overviewData, setOverviewData] = useState([]);
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


                const fetchedOverviewData = await getUserChoreOverview(updatedCompleteUser.userDetailsId);
                setOverviewData(fetchedOverviewData);

                const totalMinutes = fetchedOverviewData.reduce((acc, item) => acc + item.total_minutes, 0);
                const totalCost = fetchedOverviewData.reduce((acc, item) => acc + item.total_cost, 0);
                setGrandTotalCost(totalCost);
                setGrandTotalMinutes(totalMinutes);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

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
                    <OverviewPie overviewData={overviewData} totalMinutes={grandTotalMinutes} isMobile={isMobile} />
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