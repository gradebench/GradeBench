import type { Metadata } from "next";
import { CTASection } from "@/components/home/cta-section";
import { FeaturesPreviewSection } from "@/components/home/features-preview-section";
import { HeroSection } from "@/components/home/hero-section";
import { PartnersSection } from "@/components/home/partners-section";
import { StatsSection } from "@/components/home/stats-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { env } from "@/configs/env.config";

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${env.server.BASE_DOMAIN}`),
  title: "Automated Grading & AI Evaluation Platform | GradeBench",
  description:
    "GradeBench saves educators 95% of their time with AI-powered grading. Get instant, unbiased feedback and cut evaluation costs by 70%. Transform your institution today.",
  alternates: {
    canonical: "/",
  },
};

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <PartnersSection />
      <StatsSection />
      <FeaturesPreviewSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
};

export default HomePage;
