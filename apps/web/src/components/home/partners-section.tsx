"use client";

import Link from "next/link";
import { ThemedImage } from "@/components/image";
import { motion } from "motion/react";

export function PartnersSection() {
  return (
    <section className="py-12 border-y border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Accelerated by the Best in Tech
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center opacity-70 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
           <Link
            href="https://www.microsoft.com/en-in/startups"
            target="_blank"
            className="group"
          >
            <ThemedImage
              alt="Microsoft For Startups"
              className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              darkSrc="/assets/company/microsoft/dark.png"
              height={128}
              lightSrc="/assets/company/microsoft/light.jpg"
              style={{ width: "auto", height: "auto" }}
              width={128}
            />
          </Link>
          <Link
            href="https://aws.amazon.com/startups"
            target="_blank"
              className="group"
          >
            <ThemedImage
              alt="Amazon Web Services"
              className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              darkSrc="/assets/company/aws/dark.png"
              height={128}
              lightSrc="/assets/company/aws/light.svg"
              style={{ width: "auto", height: "auto" }}
              width={128}
            />
          </Link>
          <Link
            href="https://startup.google.com/"
            target="_blank"
              className="group"
          >
            <ThemedImage
              alt="Google Logo"
              className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              darkSrc="/assets/company/google/dark.svg"
              height={128}
              lightSrc="/assets/company/google/light.svg"
              style={{ width: "auto", height: "auto" }}
              width={128}
            />
          </Link>
          <Link
            href="https://www.nvidia.com/en-in/startups/"
            target="_blank"
              className="group"
          >
            <ThemedImage
              alt="Nvidia Logo"
              className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              darkSrc="/assets/company/nvidia/dark.png"
              height={128}
              lightSrc="/assets/company/nvidia/light.jpg"
              style={{ width: "auto", height: "auto" }}
              width={128}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
