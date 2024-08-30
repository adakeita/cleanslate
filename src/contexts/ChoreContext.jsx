import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  getFromSessionStorage,
  saveToSessionStorage,
} from "../lib/services/baseApiService";
import PropTypes from "prop-types";
import supabase from "../lib/supabaseConfig";

const ChoreContext = createContext();

export const useChores = () => useContext(ChoreContext);

export const ChoreProvider = ({ children }) => {
  const [chores, setChores] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);

  const getCurrentUserId = () => {
    const userDetails = getFromSessionStorage("completeUser") || {};
    return userDetails?.userDetailsId || null;
  };

  const fetchChores = async () => {
    const completeUser = getFromSessionStorage("completeUser");
    const currentUserId = completeUser?.userDetailsId;

    if (!currentUserId) {
      console.warn("No valid userDetailId found, skipping chore fetch.");
      return;
    }

    if (completeUser?.chores) {
      setChores(completeUser.chores);
      return;
    }

    // Fallback fetch from Supabase if chores are not in session storage
    try {
      const { data, error } = await supabase
        .from("chore_log")
        .select("*, timestamp")
        .eq("user_detail_id", currentUserId);
      if (error) throw error;

      const choresWithTimestamps = data.map((chore) => ({
        ...chore,
        timestamp: new Date(chore.timestamp),
      }));

      completeUser.chores = choresWithTimestamps;
      saveToSessionStorage("completeUser", completeUser);
      setChores(choresWithTimestamps);
    } catch (error) {
      console.error("Error fetching chores:", error.message);
    }
  };

  // Update chores in the state and session storage
  const updateChores = (updatedChore) => {
    if (updatedChore && updatedChore.timestamp) {
      setChores((prevChores) => {
        const newChores = [
          ...prevChores,
          { ...updatedChore, timestamp: new Date(updatedChore.timestamp) },
        ];

        const completeUser = getFromSessionStorage("completeUser");
        if (completeUser) {
          completeUser.chores = newChores;
          saveToSessionStorage("completeUser", completeUser);
        }

        return newChores;
      });
    } else {
      console.error("Attempted to add invalid chore:", updatedChore);
    }
  };

  useEffect(() => {
    console.log(
      "ChoreContext: Checking if authenticated and starting chore fetch"
    );

    if (isAuthenticated) {
      const channel = supabase
        .channel("chore-log-all-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "chore_log" },
          (payload) => {
            console.log("ChoreContext: Change received", payload);

            if (payload.new) {
              updateChores({
                ...payload.new,
                timestamp: new Date(payload.new.timestamp),
              });
            }
          }
        )
        .subscribe();

      const completeUser = getFromSessionStorage("completeUser");
      if (completeUser && completeUser.chores) {
        console.log("ChoreContext: Using chores from session storage");
        setChores(completeUser.chores);
      } else {
        console.log("ChoreContext: Fetching chores from Supabase");
        fetchChores();
      }

      return () => {
        supabase.removeChannel(channel);
        console.log("ChoreContext: Unsubscribed from Supabase channel");
      };
    }
  }, [isAuthenticated]);

  return (
    <ChoreContext.Provider value={{ chores, updateChores }}>
      {children}
    </ChoreContext.Provider>
  );
};

ChoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
