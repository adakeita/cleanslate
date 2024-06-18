import { useState, useEffect } from "react";
import { getUserChoreOverview, getCompleteUser } from "../lib/api";
import OverviewPie from "../components/OverviewPie";
import TotalCostComponent from "../components/TotalCostComponent";
import OverviewBar from "../components/OverviewBar/overviewbar.jsx";
import ChoreDropdown from "../components/ChoreDropdown";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdownOpen = (isOpen) => {
    setIsDropdownOpen(isOpen);
    
  };

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
    <div className="content-container_user-overview">
      <div id="UserOverview">
        <div className="header_user-overview">
          <button>Back to Dashboard</button>
          <h1 className="user-overview-greeting">
            {userDetails?.username}&apos;s Overview
          </h1>
        </div>
        <div className="content-wrapper_user-overview"></div>
        <div className="user-overview-content">
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
              <div className="data-presentation_user-overview">
                <section className="piechart-section_user-overview">
                  <OverviewPie
                    overviewData={overviewData}
                    totalMinutes={grandTotalMinutes}
                    isMobile={isMobile}
                  />
                </section>
                <div className="interaction_user-overview">
                  <section className="monetary-section_user-overview">
                    <TotalCostComponent
                      totalCost={grandTotalCost}
                      totalMinutes={grandTotalMinutes}
                    />
                  </section>
                  <section className="log-activity">
                    <ChoreDropdown onToggleDropdown={toggleDropdownOpen} />
                  </section>
                </div>
              </div>
              <section className="barchart-section_user-overview">
                <OverviewBar overviewData={overviewData} />
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
