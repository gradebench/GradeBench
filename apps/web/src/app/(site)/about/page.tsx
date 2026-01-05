import { AboutClient } from "./client";
import { env } from "@/configs/env.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${env.server.BASE_DOMAIN}`),
  title: "Our Mission to Empower Educators | About GradeBench",
  description:
    "Learn about the GradeBench mission to reduce educator workload and make academic evaluations quick, fair, and meaningful. Meet our dedicated founding team.",
  alternates: {
    canonical: "/about",
  },
};

const AboutPage = () => {
  return <AboutClient />;
};

export default AboutPage;
