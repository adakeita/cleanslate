import { Router, Route, RootRoute } from "@tanstack/react-router";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/Login";
import HouseholdPage from "./pages/Household";
import OverviewPage from "./pages/Overview";
import AboutPage from "./pages/About";
import InvitePage from "./pages/InvitePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Root from "./App";

const rootRoute = new RootRoute({
  component: Root,
});

// NOTE: @see https://tanstack.com/router/v1/docs/guide/routes

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const completeProfileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/completeprofile",
  component: CompleteProfile,
});

const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const householdRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/household",
  component: HouseholdPage,
});

const overviewRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/overview",
  component: OverviewPage,
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const privacyPolicyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/privacypolicy",
  component: PrivacyPolicy,
});

const inviteRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/invite",
  component: InvitePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  completeProfileRoute,
  dashboardRoute,
  loginRoute,
  profileRoute,
  aboutRoute,
  householdRoute,
  overviewRoute,
  privacyPolicyRoute,
  inviteRoute,
]);

export const router = new Router({ routeTree });

export default router;
