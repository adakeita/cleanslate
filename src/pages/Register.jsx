import SignupForm from "../components/SignUpForm";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";

const RegisterPage = () => {
    useUpdateBodyClass("/register");
    return (
        <div id="registerPage" className="page-container">
            <SignupForm />
        </div>
    );
};

export default RegisterPage;