"use client";

import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { type AuthClientOptions, authClient } from "./client";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{12,128}$/;

interface AuthProviderProps {
  authClientOptions: AuthClientOptions;
  captchaSiteKey: string;

  readonly children: ReactNode;
}

const AuthProvider = ({
  authClientOptions,
  captchaSiteKey,
  children,
}: AuthProviderProps) => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  return (
    <AuthQueryProvider>
      <AuthUIProviderTanstack
        authClient={authClient(authClientOptions)}
        avatar={{
          Image,
        }}
        basePath="/auth"
        // baseURL={authClientOptions.baseURL}
        captcha={{
          provider: "google-recaptcha-v3",
          siteKey: captchaSiteKey,
        }}
        changeEmail // 24 hours
        credentials={{
          confirmPassword: true,
          forgotPassword: true,
          passwordValidation: {
            minLength: 12,
            maxLength: 128,
            regex: PASSWORD_REGEX,
          },
          rememberMe: false,
          username: true,
          usernameRequired: true,
        }}
        deleteUser={{
          verification: true,
        }}
        emailOTP={false}
        emailVerification={{
          otp: false,
        }}
        freshAge={60 * 60 * 24}
        Link={Link}
        magicLink={false}
        multiSession
        nameRequired
        navigate={router.push}
        oneTap={false}
        onSessionChange={() => router.refresh()}
        optimistic
        organization={{ apiKey: false, pathMode: "slug", logo: true, slug }}
        passkey={false}
        persistClient={false}
        redirectTo="/"
        replace={router.replace}
        social={{
          providers: ["google"],
        }}
        teams={{
          enabled: true,
          colors: {
            count: 5,
            prefix: "team",
          },
        }}
      >
        {children}
      </AuthUIProviderTanstack>
    </AuthQueryProvider>
  );
};

export { AuthProvider };
