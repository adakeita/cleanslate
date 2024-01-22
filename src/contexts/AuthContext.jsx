import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import supabase from '../lib/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthState = useCallback(async () => {
        const { data: session } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
    }, []);

    useEffect(() => {
        checkAuthState();
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });
        return () => {
            if (authListener) {
                authListener.unsubscribe();
            }
        };
    }, [checkAuthState]);

    const signUp = async (email, password) => {
        if (!email || !password) {
            throw new Error("Email and password are required.");
        }

        try {
            const { user, error } = await supabase.auth.signUp({ email, password });
            if (error) throw new Error(error.message || "Error during signup");
            console.log("Signup successful:", user);
            return user;
        } catch (error) {
            console.error("Signup process error:", error);
            throw error;
        }
    };

    const signIn = async (email, password) => {
        if (!email || !password) {
            throw new Error("Email and password are required.");
        }

        try {
            const { user, error } = await supabase.auth.signInWithPassword({ email, password });
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
        <AuthContext.Provider value={{ isAuthenticated, signUp, signIn, signOut, checkAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
