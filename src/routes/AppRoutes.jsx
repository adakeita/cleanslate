import { Routes, Route} from "react-router-dom";
import HomePage from "../pages/Home";
import RegisterPage from "../pages/Register";
import CompleteProfile from "../pages/CompleteProfile";
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../pages/Profile";
import LoginPage from "../pages/Login";
import HouseholdPage from "../pages/Household";
import OverviewPage from "../pages/Overview";
import AboutPage from "../pages/About";
import InvitePage from "../pages/InvitePage";
import PrivacyPolicy from "../pages/PrivacyPolicy";

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/completeprofile" element={<CompleteProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/household" element={<HouseholdPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/invite/:token" element={<InvitePage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      </Routes>
  );
}

export default AppRoutes;
