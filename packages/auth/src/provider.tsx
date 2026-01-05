"use client";

import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "./client";

interface AuthProviderProps {
  readonly children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  return (
    <AuthQueryProvider>
      <AuthUIProviderTanstack
        authClient={authClient}
        captcha={{
          provider: "google-recaptcha-v3",
          siteKey: "6Lf5CzksAAAAAKRtUCQCAY3mY7qDApxIeaKK31f7",
        }}
        Link={Link}
        multiSession={true}
        navigate={router.push}
        onSessionChange={() => router.refresh()}
        organization={{
          pathMode: "slug",
          basePath: "organizations",
          slug,
        }}
        persistClient={false}
        replace={router.replace}
        social={{
          providers: ["google"],
        }}
      >
        {children}
      </AuthUIProviderTanstack>
    </AuthQueryProvider>
  );
};
