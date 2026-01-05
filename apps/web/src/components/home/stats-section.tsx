"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gb/design-system/components/ui/card";
import { motion } from "motion/react";
import { heroProblemCards } from "@/configs/cards.config";

export function StatsSection() {
  return (
    <section className="overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 font-bold text-3xl tracking-tight md:text-4xl">
            Don't Let Grading Overwhelm Your Institution
          </h2>
          <p className="text-muted-foreground text-xl">
            Manual grading is more than just a task; it's a significant
            operational drain that costs time and money.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {heroProblemCards.map((card, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              key={card.title}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className="h-full border-border/50 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="text-center md:text-left">
                  <div className="mb-4 inline-flex">{card.icon}</div>
                  <CardTitle className="mb-2 font-bold text-2xl">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {card.content}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
