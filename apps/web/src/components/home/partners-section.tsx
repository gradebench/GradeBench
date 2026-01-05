"use client";

import Link from "next/link";
import { ThemedImage } from "@/components/image";

export function PartnersSection() {
  return (
    <section className="border-border/40 border-y bg-muted/20 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
            Accelerated by the Best in Tech
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-items-center gap-8 opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 md:grid-cols-4 md:gap-12">
          <Link
            className="group"
            href="https://www.microsoft.com/en-in/startups"
            target="_blank"
          >
            <ThemedImage
              alt="Microsoft For Startups"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105 md:h-10"
              darkSrc="/assets/company/microsoft/dark.png"
              height={128}
              lightSrc="/assets/company/microsoft/light.jpg"
              style={{ width: "auto", height: "auto" }}
              width={128}
            />
          </Link>
          <Link
            className="group"
            href="https://aws.amazon.com/startups"
            target="_blank"
          >
            <ThemedImage
              alt="Amazon Web Services"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105 md:h-10"
              darkSrc="/assets/company/aws/dark.png"
              height={128}
              lightSrc="/assets/company/aws/light.svg"
              style={{ width: "auto", height: "auto" }}
              width={128}
            />
          </Link>
          <Link
            className="group"
            href="https://startup.google.com/"
            target="_blank"
          >
            <ThemedImage
              alt="Google Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105 md:h-10"
              darkSrc="/assets/company/google/dark.svg"
              height={128}
              lightSrc="/assets/company/google/light.svg"
              style={{ width: "auto", height: "auto" }}
              width={128}
            />
          </Link>
          <Link
            className="group"
            href="https://www.nvidia.com/en-in/startups/"
            target="_blank"
          >
            <ThemedImage
              alt="Nvidia Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105 md:h-10"
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
