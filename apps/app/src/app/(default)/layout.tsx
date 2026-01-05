import { AuthProvider } from "@gb/auth/provider";
import { Toaster } from "@gb/design-system/components/ui/sonner";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  readonly children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
      <Toaster />
    </>
  );
};

export default DashboardLayout;
