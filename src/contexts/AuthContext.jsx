import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import supabase from "../lib/supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthState = useCallback(async () => {
    const { data: session } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  }, []);

  useEffect(() => {
    checkAuthState();
    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      if (typeof authListener === "function") {
        authListener();
      }
    };
  }, [checkAuthState]);

  const signUp = async (email, password, username, pronouns, avatar) => {
    if (!email || !password || !username || !avatar) {
      throw new Error("All fields are required.");
    }
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError)
        throw new Error(signUpError.message || "Error during signup");

      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError)
        throw new Error(userError.message || "Error fetching user data.");
      if (!userData || !userData.user)
        throw new Error("User data is not available.");

      const user = userData.user;
      await insertUserDetails(
        user.id,
        username,
        pronouns,
        avatar
      );
      console.log("User details added successfully.");

      return user;
    } catch (error) {
      console.error("Signup process error:", error);
      throw error;
    }
  };

  const insertUserDetails = async (userId, username, pronouns, avatar) => {
    const { data, error } = await supabase
      .from("user_details")
      .insert([{ user_id: userId, username, pronouns, avatar }]);
    if (error) throw new Error(error.message || "Error inserting user details");
    return data;
  };
  

  const signIn = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message || "Error during sign-in");
      return user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Sign out successful");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signUp, signIn, signOut, checkAuthState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
