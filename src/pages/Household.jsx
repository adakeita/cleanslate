import { useState, useEffect } from "react";
import { getHouseholdChoreOverview, getCompleteUser } from "../lib/api";
import HouseholdPie from "../components/HousholdPie";
import HouseholdCostComponent from "../components/HouseholdCostComponent";
import HouseholdBar from "../components/HouseholdBar/HouseholdBar";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import "../styles/customlegend.css";
import "./pagestyles/overview.css"; // Reuse the same CSS for consistency

const HouseholdPage = () => {
  useUpdateBodyClass("/household");

  const [householdData, setHouseholdData] = useState([]);
  const [completeUser, setCompleteUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 440);
  const [filter, setFilter] = useState("day");

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
    const fetchHouseholdData = async () => {
      try {
        const fetchedHouseholdData = await getHouseholdChoreOverview(filter);
        setHouseholdData(fetchedHouseholdData);

        // Fetch completeUser data
        const fetchedCompleteUser = await getCompleteUser();
        setCompleteUser(fetchedCompleteUser);
      } catch (error) {
        console.error("Error fetching household data:", error);
      }
    };
    fetchHouseholdData();
  }, [filter]);

  const hasNoData = householdData.every((member) =>
    member.chores.every(
      (item) => item.total_minutes === 0 && item.total_monetary_value === 0
    )
  );

  return (
    <div className="content-container_user-overview">
      <div id="UserOverview">
        <div className="header_user-overview">
          <button>Back to Dashboard</button>
          <h1 className="user-overview-greeting">Household Overview</h1>
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
                  <HouseholdPie
                    householdData={householdData}
                    completeUser={completeUser}
                    isMobile={isMobile}
                  />
                </section>
                <div className="interaction_user-overview">
                  <section className="monetary-section_user-overview">
                    <HouseholdCostComponent householdData={householdData} />
                  </section>
                </div>
              </div>
              <section className="barchart-section_user-overview">
                <HouseholdBar householdData={householdData} />
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseholdPage;
