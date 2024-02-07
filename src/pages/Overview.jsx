import { useState, useEffect } from "react";
import { getUserChoreOverview, getCompleteUser } from "../lib/api";
import OverviewPie from "../components/OverviewPie";
import TotalCostComponent from "../components/TotalCostComponent";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import "../styles/customlegend.css";
import "./pagestyles/overview.css";

const OverviewPage = () => {
  useUpdateBodyClass("/overview");

  const [grandTotalCost, setGrandTotalCost] = useState(0);
  const [grandTotalMinutes, setGrandTotalMinutes] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 440);
  const [overviewData, setOverviewData] = useState([]);
  const [filter, setFilter] = useState("day");
  const [userDetails, setUserDetails] = useState({ username: "" });

  const dateFilterOptions = ["day", "week", "month", "year", "all"].map(
    (option) => (
      <label className="datefilter-label" key={option}>
        <input
          type="radio"
          name="dateFilter"
          value={option}
          checked={filter === option}
          onChange={(e) => setFilter(e.target.value)}
        />
        {option.charAt(0).toUpperCase() + option.slice(1)}
      </label>
    )
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 440);
    const resizeListener = window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const completeUser = await getCompleteUser();
        const fetchedOverviewData = await getUserChoreOverview(
          completeUser.userDetailsId,
          filter
        );
        setOverviewData(fetchedOverviewData);
        setUserDetails(completeUser);

        const totalMinutes = fetchedOverviewData.reduce(
          (acc, item) => acc + item.total_minutes,
          0
        );
        const totalCost = fetchedOverviewData.reduce(
          (acc, item) => acc + (parseFloat(item.total_monetary_value) || 0),
          0
        );
        setGrandTotalCost(totalCost);
        setGrandTotalMinutes(totalMinutes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filter]);

  const hasNoData = overviewData.every(
    (item) => item.total_minutes === 0 && item.total_monetary_value === 0
  );

  return (
    <div className="page-container">
      <h1 className="user-overview-title">
        {userDetails?.username}&apos;s Overview
      </h1>
      <div className="datefilter-wrapper">
        <div className="date-filter-options">{dateFilterOptions}</div>
      </div>
      {hasNoData ? (
        <div className="no-data-wrapper">
          <div className="no-data-message">
            <p>Nothing to see here yet!</p>
            <p>Start logging your work to see it appear here.</p>
          </div>
        </div>
      ) : (
        <>
          <OverviewPie
            overviewData={overviewData}
            totalMinutes={grandTotalMinutes}
            isMobile={isMobile}
          />
          <TotalCostComponent
            totalCost={grandTotalCost}
            totalTime={`Time spent: ${Math.floor(grandTotalMinutes / 60)}h ${
              grandTotalMinutes % 60
            }min`}
          />
        </>
      )}
    </div>
  );
};

export default OverviewPage;
