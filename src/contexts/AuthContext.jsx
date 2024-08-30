import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  getSession,
  getUser,
  apiRequest,
  saveToSessionStorage,
  getFromSessionStorage,
} from "../lib/services/baseApiService";
import supabase from "../lib/supabaseConfig";
import { updateUserDetails } from "../lib/services/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuthState = useCallback(async () => {
    let session = getFromSessionStorage("sessionData");

    if (!session) {
      session = await getSession();
      if (session) saveToSessionStorage("sessionData", session);
    }

    const userData = session?.user || null;

    setIsAuthenticated(!!userData);
    setUser(userData);
  }, []);

  useEffect(() => {
    checkAuthState();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const userData = session?.user || null;
        setIsAuthenticated(!!userData);
        setUser(userData);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [checkAuthState]);

  const signUp = async (email, password, username, pronouns, avatar) => {
    if (!email || !password || !username || !avatar) {
      throw new Error("All fields are required.");
    }
    return await apiRequest(async () => {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError)
        throw new Error(signUpError.message || "Error during signup");

      const user = await getUser();
      if (!user) throw new Error("User data is not available.");

      await updateUserDetails(username, pronouns, avatar);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    });
  };

  const signIn = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    return await apiRequest(async () => {
      const { data: session, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message || "Error during sign-in");

      setUser(session.user);
      setIsAuthenticated(true);
      return session.user;
    });
  };

  const signOut = async () => {
    return await apiRequest(async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setIsAuthenticated(false);
      console.log("Sign out successful");
    });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signUp, signIn, signOut, checkAuthState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
