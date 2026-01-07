import {
  adminClient,
  lastLoginMethodClient,
  multiSessionClient,
  organizationClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export interface AuthClientOptions {
  baseURL: string;
  basePath: string;
}

export const authClient = ({ baseURL, basePath }: AuthClientOptions) =>
  createAuthClient({
    baseURL,
    basePath,
    sessionOptions: {
      refetchInterval: 5 * 60, // 5 minutes
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
