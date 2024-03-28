import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

const ChoreContext = createContext();

export const useChores = () => useContext(ChoreContext);

export const ChoreProvider = ({ children }) => {
    const [chores, setChores] = useState([]);

    // Function to fetch initial chores data
    const fetchChores = async () => {
        try {
            const { data, error } = await supabase
                .from('chore_log')
                .select('*');
            if (error) throw error;
            setChores(data);
        } catch (error) {
            console.error('Error fetching chores:', error.message);
        }
    };

    // Function to update local chores state
    const updateChores = (updatedChore) => {
        setChores((prevChores) => [...prevChores, updatedChore]);
    };

    useEffect(() => {
        fetchChores();

        const choreSubscription = supabase
            .from('chore_log')
            .on('*', payload => {
                console.log('Chore change received:', payload);
                fetchChores(); // Fetch new chores data
            })
            .subscribe();

        return () => supabase.removeSubscription(choreSubscription);
    }, []);

    return (
        <ChoreContext.Provider value={{ chores, updateChores }}>
            {children}
        </ChoreContext.Provider>
    );
};
