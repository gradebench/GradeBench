"use client";

import { Badge } from "@gb/design-system/components/ui/badge";
import { Card, CardContent } from "@gb/design-system/components/ui/card";
import { cn } from "@gb/design-system/lib/utils";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { featuresDetailInfo } from "@/configs/cards.config";

function FeaturesHero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 origin-top-left -skew-y-3 scale-110 transform bg-primary/5" />

      <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-6 bg-blue-600 text-white transition-colors hover:bg-blue-700">
            Features
          </Badge>
          <h1 className="mb-8 font-bold text-4xl tracking-tight md:text-6xl">
            The Most{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Powerful
            </span>{" "}
            Toolkit
            <br />
            for{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Effortless Evaluation
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground text-xl leading-relaxed">
            Explore the intelligent features that make GradeBench the smartest
            way to grade. Built for speed, accuracy, and impact.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const FeatureInfoTab = ({
  index,
  title,
  subtitle,
  description,
  icon,
  cardIcon,
  cardTitle,
  cardSubtitle,
}: {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  cardIcon: ReactNode;
  cardTitle: string;
  cardSubtitle: string;
}) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center gap-12 lg:gap-20",
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex-1 space-y-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="mb-2 font-bold text-2xl tracking-tight md:text-3xl">
            {title}
          </h3>
          <p className="font-medium text-primary text-xl">{subtitle}</p>
        </div>
        <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="w-full max-w-lg flex-1 lg:max-w-none">
        <Card className="group overflow-hidden border-border/50 bg-background/50 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-8">
              {/* Decorative background elements */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

              <motion.div
                className="relative z-10 w-full max-w-xs rounded-2xl border border-border/20 bg-white p-8 text-center shadow-xl dark:bg-slate-900"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary">
                  {cardIcon}
                </div>
                <h4 className="mb-1 font-bold text-2xl">{cardTitle}</h4>
                <p className="text-muted-foreground text-sm">{cardSubtitle}</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

function FeatureDetails() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-32">
          {featuresDetailInfo.map((info, index) => (
            <FeatureInfoTab
              index={index}
              key={info.title}
              {...info}
              cardIcon={info.card.icon}
              cardSubtitle={info.card.subtitle}
              cardTitle={info.card.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesClient() {
  return (
    <>
      <FeaturesHero />
      <FeatureDetails />
    </>
  );
}
