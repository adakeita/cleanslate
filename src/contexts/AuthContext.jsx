// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import supabase from '../lib/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthState = async () => {
            const session = await supabase.auth.getSession();
            setIsAuthenticated(!!session.session);
        };

        checkAuthState();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        return () => {
            if (authListener) {
                authListener.unsubscribe();
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};