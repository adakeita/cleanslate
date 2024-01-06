import { Router, Route, RootRoute } from "@tanstack/react-router";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
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

const loginRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: LoginPage,
});

const routeTree = rootRoute.addChildren([indexRoute, registerRoute, loginRoute]);

export const router = new Router({ routeTree });

export default router;
