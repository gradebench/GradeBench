"use client";

import { Badge } from "@gb/design-system/components/ui/badge";
import { Button } from "@gb/design-system/components/ui/button";
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/10 opacity-50 blur-[100px] dark:opacity-20" />
        <div className="absolute right-0 bottom-0 h-[600px] w-[800px] rounded-full bg-blue-500/10 opacity-30 blur-[120px] dark:opacity-10" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                className="mb-6 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 font-medium text-primary text-sm"
                variant="secondary"
              >
                <span className="relative mr-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Reshaping Education Evaluation
              </Badge>

              <h1 className="mb-6 font-bold text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                Grade in{" "}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Seconds
                </span>
                .<br />
                Teach for{" "}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Hours
                </span>
                .
              </h1>

              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl lg:mx-0">
                GradeBench automates 95% of your grading workload with
                AI-powered precision. Deliver fair, instant, and personalized
                feedback so you can get back to what matters most.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button
                  className="h-12 px-8 text-base shadow-lg shadow-primary/20"
                  render={
                    <Link href="/auth/signup">
                      Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  }
                  size="lg"
                />
                <Button
                  className="h-12 px-8 text-base"
                  render={
                    <Link href="/features">
                      <PlayCircle className="ml-2 h-4 w-4" /> View Demo
                    </Link>
                  }
                  size="lg"
                  variant="outline"
                />
              </div>

              <div className="mt-10 flex items-center justify-center gap-6 text-muted-foreground text-sm lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Image/Visual */}
          <div className="w-full max-w-[600px] flex-1 lg:max-w-none">
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 bg-background/50 shadow-2xl backdrop-blur-sm">
                {/* Abstract UI representation since we don't have a real screenshot yet */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background">
                  <div className="grid w-full max-w-md grid-cols-2 gap-4 p-8 opacity-80 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="col-span-2 h-8 w-3/4 animate-pulse rounded-md bg-primary/10" />
                    <div className="h-24 space-y-2 rounded-md border border-border/50 bg-card p-4 shadow-sm">
                      <div className="h-2 w-1/2 rounded bg-muted" />
                      <div className="h-2 w-full rounded bg-muted" />
                    </div>
                    <div className="h-24 space-y-2 rounded-md border border-border/50 bg-card p-4 shadow-sm">
                      <div className="h-2 w-1/2 rounded bg-muted" />
                      <div className="h-2 w-full rounded bg-muted" />
                    </div>
                    <div className="col-span-2 h-32 space-y-3 rounded-md border border-border/50 bg-card p-4 shadow-sm">
                      <div className="flex justify-between">
                        <div className="h-3 w-1/4 rounded bg-muted" />
                        <div className="h-3 w-1/6 rounded bg-green-500/20" />
                      </div>
                      <div className="h-2 w-full rounded bg-muted" />
                      <div className="h-2 w-5/6 rounded bg-muted" />
                      <div className="h-2 w-4/6 rounded bg-muted" />
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  className="absolute -top-6 -right-6 z-10 hidden rounded-xl border border-border/50 bg-card p-4 shadow-xl sm:block"
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      98%
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Accuracy</div>
                      <div className="text-muted-foreground text-xs">
                        AI Grading Score
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  className="absolute -bottom-6 -left-6 z-10 hidden rounded-xl border border-border/50 bg-card p-4 shadow-xl sm:block"
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      30s
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Speed</div>
                      <div className="text-muted-foreground text-xs">
                        Per answer sheet
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
