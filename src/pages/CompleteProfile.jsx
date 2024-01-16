import { useState } from "react";
import UserDetails from "../components/UserDetails";
import HouseholdDetails from "../components/HousholdDetails";


const CompleteProfile = () => {
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