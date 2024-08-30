import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { getCompleteUser } from "../lib/services/userService";
import { AuthContext } from "./AuthContext";
import {
  getFromSessionStorage,
  saveToSessionStorage,
} from "../lib/services/baseApiService";

export const UserDetailsContext = createContext();

export const UserDetailsProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchAndSetUserDetails = async () => {
    try {
      let details = getFromSessionStorage("completeUser");

      if (!details) {
        details = await getCompleteUser(); // Fetch from server if not in session storage
        if (details) saveToSessionStorage("completeUser", details);
      }

      setUserDetails(details);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log("UserDetailsProvider: Fetching user details");
      fetchAndSetUserDetails();
    }
  }, [isAuthenticated]);

  return (
    <UserDetailsContext.Provider
      value={{ userDetails, fetchAndSetUserDetails }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};

UserDetailsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
