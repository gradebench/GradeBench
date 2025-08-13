import { ReactNode } from "react";

export const SitePage = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <main className="min-h-screen">{children}</main>
    </>
  );
};
