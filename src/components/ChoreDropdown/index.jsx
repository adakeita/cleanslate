// ChoreDropdown.jsx
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { logChore, fetchChoreCategories } from "../../lib/api";
import { useChores } from "../../contexts/ChoreContext";
import PropTypes from "prop-types";
import plus from "../../assets/svg/plus.svg";
import minus from "../../assets/svg/minus.svg";
import checkmark from "../../assets/svg/checkmark.svg";
import arrow from "../../assets/svg/back-arrow.svg";
import "./choredropdown.css";

const ChoreDropdown = ({ onToggleDropdown }) => {
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [sessions, setSessions] = useState(1);
  const { updateChores } = useChores();
  const { openModal, closeModal } = useOutletContext();

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const fetchedCategories = await fetchChoreCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories and subcategories:", error);
      }
    };
    fetchCategoriesAndSubcategories();
  }, []);

  const ModalContent = () => (
    <div>
      <p>
        Sweet! Your task has been tracked. 
        <br />
        <br />
        You can view your updated pie chart
        in My overview.
      </p>
      <p>Keep up the good work!</p>
    </div>
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentLevel("subcategories");
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setCurrentLevel("sessions");
  };

  const incrementSessions = () => setSessions(sessions + 1);
  const decrementSessions = () => setSessions(sessions > 1 ? sessions - 1 : 1);

  const handleBackClick = () => {
    if (currentLevel === "subcategories") {
      setCurrentLevel("categories");
      setSelectedCategory(null);
    } else if (currentLevel === "sessions") {
      setCurrentLevel("subcategories");
    }
  };

  const handleSubmit = async () => {
    if (!selectedSubcategory) {
      openModal("Please select a subcategory.");
      return;
    }

    try {
      const newChore = await logChore(
        selectedSubcategory.subcategory_id,
        sessions
      );
      updateChores(newChore); // Update the global state with the new chore
      openModal(<ModalContent />);

      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSessions(1);
      setCurrentLevel("categories");
    } catch (error) {
      openModal(<div>{error.message || "Error logging chore."}</div>);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (onToggleDropdown) {
      onToggleDropdown(!dropdownOpen);
    }
  };

  return (
    <div className="chorelogger-wrap">
      <button className="dropdown-menu-btn" onClick={toggleDropdown}>
        {dropdownOpen ? "Close menu" : "Log activity"}{" "}
        {dropdownOpen ? " ▲ " : " ▼ "}
      </button>
      <div className={`chore-wrapper ${dropdownOpen ? "open" : "closed"}`}>
        <div className="chore-dropdown-content">
          <ul className="chore-dropdown-menu" role="menu">
            {currentLevel === "categories" &&
              categories.map((category) => (
                <li
                  role="menuitem"
                  className="dropdown-li dropdown-category-li"
                  key={category.category_id}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.category_name}
                  <div className="dropdownli-icon-container">
                    <img
                      src={plus}
                      alt="plus-icon"
                      className="dropdownli-icon"
                    />
                  </div>
                </li>
              ))}
            {currentLevel === "subcategories" &&
              selectedCategory &&
              selectedCategory.chore_subcategories.map((subcategory) => (
                <li
                  role="menuitem"
                  className="dropdown-li dropdown-subcategory-li"
                  key={subcategory.subcategory_id}
                  onClick={() => handleSubcategoryClick(subcategory)}
                >
                  {subcategory.subcategory_name}
                  <div className="dropdownli-icon-container">
                    <img
                      src={plus}
                      alt="plus-icon"
                      className="dropdownli-icon"
                    />
                  </div>
                </li>
              ))}
            {currentLevel === "sessions" && selectedSubcategory && (
              <>
                <p id="subcategory-label" className="session-category">
                  {selectedSubcategory.subcategory_name}
                </p>
                <div className="session-content">
                  <div
                    role="menuitem"
                    className="dropdown-session-counter session-control"
                  >
                    <button
                      className="sessioncount-btn"
                      onClick={decrementSessions}
                    >
                      <div className="sessioncount-img-wrapper">
                        <img
                          src={minus}
                          alt="minus"
                          className="sessioncount-img"
                        />
                      </div>
                    </button>
                    <span className="session-no">{sessions}</span>
                    <button
                      className="sessioncount-btn"
                      onClick={incrementSessions}
                    >
                      <div className="sessioncount-img-wrapper">
                        <img
                          src={plus}
                          alt="plus"
                          className="sessioncount-img"
                        />
                      </div>
                    </button>
                  </div>
                  <p className="session-explain">1 session = 15min</p>
                </div>
                <div className="dropdown-done-btn">
                  <button className="done-btn" onClick={handleSubmit}>
                    Complete
                    <div className="donebtn-img-wrapper">
                      <img src={checkmark} alt="checkmark" />
                    </div>
                  </button>
                </div>
              </>
            )}
          </ul>
          {currentLevel !== "categories" && (
            <div className="backbtn-wrapper">
              <button className="back-btn" onClick={handleBackClick}>
                <div className="backbtn-img-wrapper">
                  <img src={arrow} alt="back-arrow" />
                </div>
                Previous
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ChoreDropdown.propTypes = {
  onToggleDropdown: PropTypes.func,
};

export default ChoreDropdown;
