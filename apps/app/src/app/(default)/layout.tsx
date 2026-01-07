import { AuthProvider } from "@gb/auth/provider";
import { Toaster } from "@gb/design-system/components/ui/sonner";
import type { ReactNode } from "react";
import { env } from "@/configs/env.config";

interface DashboardLayoutProps {
  readonly children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
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
      <Toaster />
    </>
  );
};

export default DashboardLayout;
