import { useState } from "react";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import UserDetails from "../components/UserDetails";
import HouseholdDetails from "../components/HousholdDetails";


const CompleteProfile = () => {
    useUpdateBodyClass("/completeprofile");

    const [userDetailsCompleted, setUserDetailsCompleted] = useState(false);

    return (
        <div className="page-container">
            {!userDetailsCompleted ?
                <UserDetails onComplete={() => setUserDetailsCompleted(true)} />
                :
                <HouseholdDetails />
            }
        </div>
    );
};


export default CompleteProfile;