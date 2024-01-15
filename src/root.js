import { Router, Route, RootRoute } from "@tanstack/react-router";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/Login";
import AboutPage from "./pages/About";
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

const aboutRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/about",
	component: AboutPage,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	registerRoute,
	completeProfileRoute,
	dashboardRoute,
	loginRoute,
	profileRoute,
	aboutRoute,
]);

export const router = new Router({ routeTree });

export default router;
