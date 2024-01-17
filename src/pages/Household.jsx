import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";

const HouseholdPage = () => {
    useUpdateBodyClass("/household");

    return (
        <div>
            <h1>Household</h1>
        </div>
    )
}

export default HouseholdPage