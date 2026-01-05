import type { Metadata } from "next";
import { env } from "@/configs/env.config";
import { FeaturesClient } from "./client";

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${env.server.BASE_DOMAIN}`),
  title: "AI Grading, Personalized Feedback & Analytics | GradeBench Features",
  description:
    "Explore GradeBench's powerful features: Grade in seconds with our AI, deliver personalized student feedback, and unlock performance insights with our analytics dashboard.",
  alternates: {
    canonical: "/features",
  },
};

const FeaturesPage = () => {
  return <FeaturesClient />;
};

export default FeaturesPage;
