import { useState } from "react";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import WelcomeUser from "../components/WelcomeUser";
import UserDetails from "../components/UserDetails";
import HouseholdDetails from "../components/HousholdDetails";


const CompleteProfile = () => {
    useUpdateBodyClass("/completeprofile");

    const [welcomeAcknowledged, setWelcomeAcknowledged] = useState(false);
    const [userDetailsCompleted, setUserDetailsCompleted] = useState(false);

    return (
        <div className="page-container">
            {!welcomeAcknowledged ? (
                <WelcomeUser onAcknowledge={() => setWelcomeAcknowledged(true)} />
            ) : !userDetailsCompleted ? (
                <UserDetails onComplete={() => setUserDetailsCompleted(true)} />
            ) : (
                <HouseholdDetails />
            )}
        </div>
    );
};

export default CompleteProfile;