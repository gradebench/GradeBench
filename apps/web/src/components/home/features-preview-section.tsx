"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/design-system/components/ui/card";
import { heroSolutionCards } from "@/configs/cards.config";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@gb/design-system/components/ui/button";

export function FeaturesPreviewSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div className="max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                    The Future of Evaluation is Here
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                    GradeBench is the all-in-one solution designed to make your evaluation process lightning-fast, 
                    remarkably affordable, and perfectly fair.
                </p>
            </div>
            <Button variant="ghost" className="group" render={<Link href="/features">View All Features <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroSolutionCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="mb-2">
                     {card.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    {card.content}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
