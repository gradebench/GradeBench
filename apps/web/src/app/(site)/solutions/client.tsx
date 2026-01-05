"use client";

import { Badge } from "@gb/design-system/components/ui/badge";
import { Button } from "@gb/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/design-system/components/ui/card";
import { ArrowRight, CheckCircle2, Globe } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { solutionRoadmap } from "@/configs/cards.config";

function SolutionHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white md:py-32">
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-medium text-blue-300 text-sm backdrop-blur-xl">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-blue-500" />
            Enterprise Grade Solutions
          </div>
          <h1 className="mb-8 font-bold text-4xl leading-tight tracking-tight md:text-6xl">
            A <span className="text-blue-400">Scalable Solution</span>,<br />
            Tailor-Made for You
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-slate-300 text-xl leading-relaxed">
            From high-stakes exam preparation to university-wide assessments,
            GradeBench is engineered to meet the demands of any educational
            institution.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              className="h-12 border-none bg-blue-600 px-8 text-white hover:bg-blue-500"
              render={<Link href="/auth/signup">Get Started</Link>}
              size="lg"
            />
            <Button
              className="h-12 border-slate-700 bg-transparent px-8 text-white hover:bg-slate-800 hover:text-white"
              render={<Link href="/contact">Talk to Sales</Link>}
              size="lg"
              variant="outline"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SolutionTargeted() {
  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge className="mb-4" variant="outline">
            Case Study
          </Badge>
          <h2 className="mb-6 font-bold text-3xl tracking-tight md:text-4xl">
            The Winning Edge for UPSC-CSE Coaching
          </h2>
          <p className="text-lg text-muted-foreground">
            How GradeBench transforms evaluation for top-tier institutes.
          </p>
        </div>

        <div className="grid items-stretch gap-8 md:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Card className="h-full border-l-4 border-l-destructive/50 shadow-lg transition-all hover:shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-bold text-2xl">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive text-sm">
                    1
                  </span>
                  The Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Top-tier UPSC institutes must evaluate thousands of subjective
                  answer sheets with speed and precision—a logistical bottleneck
                  that limits growth, increases faculty burnout, and delays
                  student progress.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Card className="h-full border-l-4 border-l-green-500/50 shadow-lg transition-all hover:shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-bold text-2xl">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-600 text-sm">
                    2
                  </span>
                  The GradeBench Solution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
                  We offer a proven platform to eliminate this bottleneck.
                  GradeBench allows you to drastically reduce turnaround times,
                  deliver higher-quality feedback, and scale your operations
                  without increasing faculty costs.
                </p>

                <div className="space-y-3">
                  <p className="font-medium text-foreground text-sm">
                    Proven results with:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-sm">Samkalp IAS</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-sm">Primus IAS</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function RoadmapCard({
  icon,
  title,
  description,
  index,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Card className="h-full border-border/50 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">{icon}</div>
          <CardTitle className="font-bold text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SolutionRoadmap() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-bold text-3xl tracking-tight md:text-4xl">
            Expanding to Serve the Entire Ecosystem
          </h2>
          <p className="mx-auto max-w-3xl text-muted-foreground text-xl">
            We are leveraging our success in the UPSC-CSE segment to build a
            playbook for institutions everywhere.
          </p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutionRoadmap.map((card, index) => (
            <RoadmapCard
              description={card.description}
              icon={card.icon}
              index={index}
              key={card.title}
              title={card.title}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <Card className="relative overflow-hidden border-none bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            <div className="relative z-10 flex flex-col items-center gap-8 p-8 md:flex-row md:gap-12 md:p-12">
              <div className="flex-shrink-0">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                  <Globe className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <CardTitle className="mb-4 font-bold text-3xl">
                  Growing with India
                </CardTitle>
                <p className="max-w-2xl text-blue-100 text-lg leading-relaxed">
                  We are developing robust multilingual support for Hindi,
                  Marathi, Kannada, and many more languages to serve
                  institutions across the nation.
                </p>
              </div>
              <div className="ml-auto flex-shrink-0">
                <Button
                  className="shadow-lg"
                  render={
                    <Link href="/contact">
                      Partner with Us <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  }
                  size="lg"
                  variant="secondary"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export function SolutionsClient() {
  return (
    <>
      <SolutionHero />
      <SolutionTargeted />
      <SolutionRoadmap />
    </>
  );
}
