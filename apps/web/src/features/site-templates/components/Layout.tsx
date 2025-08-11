import { ScreenRootLayout } from "@/components/providers/Screen";
import { ReactNode } from "react";
import { SiteFooter } from "./Footer";
import { SiteHeader } from "./Header";

export const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ScreenRootLayout>
        <SiteHeader />
        {children}
        <SiteFooter />
      </ScreenRootLayout>
    </>
  );
};


