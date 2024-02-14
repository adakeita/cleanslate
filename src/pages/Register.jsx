import SignupForm from "../components/SignUpForm";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";

const RegisterPage = () => {
    useUpdateBodyClass("/register");
    return (
        <div className="register page-container">
            <SignupForm />
        </div>
    );
};

export default RegisterPage;