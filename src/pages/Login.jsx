import LoginForm from "../components/LoginForm";
import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";

const LoginPage = () => {
    useUpdateBodyClass("/login");
    return (
        <div id="loginPage" className="page-container">
            <LoginForm />
        </div>
    );
};

export default LoginPage;