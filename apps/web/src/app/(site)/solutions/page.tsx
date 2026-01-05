import { SolutionsClient } from "./client";
import { env } from "@/configs/env.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${env.server.BASE_DOMAIN}`),
  title: "AI Grading for UPSC Coaching Institutes & Schools | GradeBench",
  description:
    "GradeBench offers a tailored solution for UPSC institutes to automate answer sheet evaluation, reduce turnaround time, and scale operations. Discover our playbook.",
  alternates: {
    canonical: "/solutions",
  },
};

const SolutionsPage = () => {
  return <SolutionsClient />;
};

export default SolutionsPage;
