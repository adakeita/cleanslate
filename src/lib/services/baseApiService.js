import supabase from "../supabaseConfig";
import { determineDateRange } from "../../utils/dateutils";

// Handle API errors (basic)
export const handleApiError = (error) => {
  console.error("API Error:", error);
  throw new Error(error.message || "An unexpected error occurred");
};

// Standard session storage management
export const saveToSessionStorage = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const getFromSessionStorage = (key) => {
  const data = sessionStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Generic API request handler
export const apiRequest = async (callback) => {
  try {
    return await callback();
  } catch (error) {
    handleApiError(error);
  }
};

// Supabase specific functions
export const getSession = async () => {
  const { data: session, error } = await supabase.auth.getSession();
  if (error) handleApiError(error);
  return session;
};

export const getUser = async () => {
  const { data: userData, error } = await supabase.auth.getUser();
  if (error) handleApiError(error);
  return userData.user;
};
