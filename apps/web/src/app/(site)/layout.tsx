import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "GradeBench - AI-Powered Automated Grading",
    template: "%s | GradeBench",
  },
  description: "Automate your grading workflow with fair, instant, and personalized AI feedback. Save time and focus on teaching.",
  twitter: {
    card: "summary_large_image",
  },
};

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      <SiteFooter />
    </>
  );
};

export default SiteLayout;
