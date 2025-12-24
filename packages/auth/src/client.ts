import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: "http://localhost:8082",
	basePath: "/user/v1/auth",
	sessionOptions: {},
	fetchOptions: {},
});
