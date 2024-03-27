import { useState, useEffect } from "react";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import { useUI } from "../contexts/UIContext";
import WelcomeUser from "../components/WelcomeUser";
import UserDetails from "../components/UserDetails";
import HouseholdDetails from "../components/HousholdDetails";


const CompleteProfile = () => {
    useUpdateBodyClass("/completeprofile");

    const { setIsMenuVisible } = useUI();

    useEffect(() => {
      setIsMenuVisible(false);
      return () => setIsMenuVisible(true);
    }, [setIsMenuVisible]);
  

    const [welcomeAcknowledged, setWelcomeAcknowledged] = useState(false);
    const [userDetailsCompleted, setUserDetailsCompleted] = useState(false);

    return (
        <div className="content-container_welcome">
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