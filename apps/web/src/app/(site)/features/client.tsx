"use client";

import { Card, CardContent } from "@gb/design-system/components/ui/card";
import { Badge } from "@gb/design-system/components/ui/badge";
import { cn } from "@gb/design-system/lib/utils";
import type { ReactNode } from "react";
import { featuresDetailInfo } from "@/configs/cards.config";
import { motion } from "motion/react";

function FeaturesHero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-top-left scale-110 transform" />
      
      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.6 }}
           className="max-w-4xl mx-auto"
        >
             <Badge className="mb-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors">Features</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                The Most <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Powerful</span> Toolkit<br />
                for <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Effortless Evaluation</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Explore the intelligent features that make GradeBench the smartest way to grade.
                Built for speed, accuracy, and impact.
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "flex flex-col gap-12 lg:gap-20 items-center",
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
    >
      <div className="flex-1 space-y-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
        </div>
        <div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{title}</h3>
            <p className="text-xl font-medium text-primary">{subtitle}</p>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            {description}
        </p>
      </div>
      
      <div className="flex-1 w-full max-w-lg lg:max-w-none">
        <Card className="border-border/50 shadow-2xl overflow-hidden bg-background/50 backdrop-blur-sm group">
          <CardContent className="p-0">
            <div className="relative aspect-video flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-8">
               {/* Decorative background elements */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
               
               <motion.div 
                 className="relative z-10 text-center p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-border/20 w-full max-w-xs"
                 whileHover={{ scale: 1.05 }}
                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
               >
                 <div className="mx-auto mb-4 h-16 w-16 text-primary flex items-center justify-center bg-primary/5 rounded-full">
                     {cardIcon}
                 </div>
                 <h4 className="font-bold text-2xl mb-1">{cardTitle}</h4>
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
              key={info.title}
              index={index}
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
