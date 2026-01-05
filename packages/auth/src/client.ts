import {
  adminClient,
  lastLoginMethodClient,
  multiSessionClient,
  organizationClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://api.gradebench.dev",
  basePath: "/user/v1/auth",
  sessionOptions: {
    refetchInterval: 15 * 60, // 15 minutes
    refetchOnWindowFocus: true,
    refetchWhenOffline: false,
  },
  plugins: [
    usernameClient(),
    adminClient(),
    organizationClient(),
    lastLoginMethodClient(),
    multiSessionClient(),
  ],
});
