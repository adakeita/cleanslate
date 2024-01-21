import { createContext, useState, useContext, useEffect } from 'react';
import { getCompleteUser } from '../lib/api';
import { AuthContext } from './AuthContext';
import PropTypes from 'prop-types';

export const UserDetailsContext = createContext();

export const UserDetailsProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);

    const fetchAndSetUserDetails = async () => {
        try {
            const details = await getCompleteUser();
            setUserDetails(details);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAndSetUserDetails();
        }
    }, [isAuthenticated]);

    return (
        <UserDetailsContext.Provider value={{ userDetails, fetchAndSetUserDetails }}>
            {children}
        </UserDetailsContext.Provider>
    );
};

UserDetailsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};