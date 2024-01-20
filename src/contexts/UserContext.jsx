import { createContext, useState, useEffect } from 'react';
import { getCompleteUser } from '../lib/api';
import supabase from '../lib/supabaseClient';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const completeUser = await getCompleteUser();
            setUser(completeUser);
        };

        const authListener = supabase.auth.onAuthStateChange(async (event) => {
            if (event === 'SIGNED_IN') {
                await fetchUserDetails();
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
            setLoading(false);
        });

        // Clean up the listener when the component unmounts
        return () => {
            if (authListener && typeof authListener.unsubscribe === 'function') {
                authListener.unsubscribe();
            }
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
