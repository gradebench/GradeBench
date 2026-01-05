"use client";

import { Button } from "@gb/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/design-system/components/ui/card";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { heroSolutionCards } from "@/configs/cards.config";

export function FeaturesPreviewSection() {
  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 flex flex-col items-end justify-between gap-8 md:flex-row">
          <div className="max-w-3xl">
            <h2 className="mb-6 font-bold text-3xl tracking-tight md:text-5xl">
              The Future of Evaluation is Here
            </h2>
            <p className="max-w-2xl text-muted-foreground text-xl leading-relaxed">
              GradeBench is the all-in-one solution designed to make your
              evaluation process lightning-fast, remarkably affordable, and
              perfectly fair.
            </p>
          </div>
          <Button
            className="group"
            render={
              <Link href="/features">
                View All Features{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
            variant="ghost"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {heroSolutionCards.map((card, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              key={card.title}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <Card className="h-full border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="mb-2">{card.icon}</div>
                  <CardTitle className="font-bold text-xl">
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
