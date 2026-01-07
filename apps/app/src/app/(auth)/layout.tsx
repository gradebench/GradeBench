import { AuthProvider } from "@gb/auth/provider";
import { Toaster } from "@gb/design-system/components/ui/sonner";
import type { ReactNode } from "react";
import { env } from "@/configs/env.config";

interface AuthLayoutProps {
  readonly children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <AuthProvider
        authClientOptions={{
          baseURL: `https://api.${env.server.BASE_DOMAIN}`,
          basePath: "/user/v1/auth",
        }}
        captchaSiteKey={env.server.CAPTCHA_SITE_KEY}
      >
        {children}
      </AuthProvider>
      <Toaster position="top-right" />
    </>
  );
};

export default AuthLayout;
