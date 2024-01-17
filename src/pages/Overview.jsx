import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";

const OverviewPage = () => {
    useUpdateBodyClass("/overview");

    return (
        <div>
            <h1>Overview</h1>
        </div>
    );
};

export default OverviewPage;