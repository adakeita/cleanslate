import { useState, useEffect } from "react";
import supabase from "../lib/supabaseConfig";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthState = async () => {
            const { data: session } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        };

        checkAuthState();

        const authListener = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        return () => {
            if (authListener?.unsubscribe) {
                authListener.unsubscribe();
            }
        };
    }, []);

    return isAuthenticated;
};

export default useAuth;
