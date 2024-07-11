import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabaseConfig";

const ChoreContext = createContext();

export const useChores = () => useContext(ChoreContext);

export const ChoreProvider = ({ children }) => {
  const [chores, setChores] = useState([]);

  const getCurrentUserId = () => {
    const userDetails =
      JSON.parse(sessionStorage.getItem("completeUser")) || {};
    return userDetails?.userDetailsId;
  };

  // Fetch initial chore data
  const fetchChores = async () => {
    const currentUserId = getCurrentUserId();
    try {
      const { data, error } = await supabase
        .from("chore_log")
        .select("*, timestamp")
        .eq("user_detail_id", currentUserId);
      if (error) throw error;

      // Timestamps to Date objects if necessary
      const choresWithTimestamps = data.map((chore) => ({
        ...chore,
        timestamp: new Date(chore.timestamp),
      }));
      setChores(choresWithTimestamps);
    } catch (error) {
      console.error("Error fetching chores:", error.message);
    }
  };

  // Update local chores state
  const updateChores = (updatedChore) => {
    console.log("Updating chores with:", updatedChore);
    if (updatedChore && updatedChore.timestamp) {
      setChores((prevChores) => [
        ...prevChores,
        { ...updatedChore, timestamp: new Date(updatedChore.timestamp) },
      ]);
    } else {
      console.error("Attempted to add invalid chore:", updatedChore);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("chore-log-all-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chore_log" },
        (payload) => {
          console.log("Change received!", payload);
          if (payload.new) {
            updateChores({
              ...payload.new,
              timestamp: new Date(payload.new.timestamp),
            });
          } else {
            fetchChores(); // Fallback to refetching all chores
          }
        }
      )
      .subscribe();

    fetchChores();

    return () => {
      supabase.removeChannel(channel); //unsubscribe
    };
  }, []);

  return (
    <ChoreContext.Provider value={{ chores, updateChores }}>
      {children}
    </ChoreContext.Provider>
  );
};
