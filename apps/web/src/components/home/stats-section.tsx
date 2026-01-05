"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gb/design-system/components/ui/card";
import { heroProblemCards } from "@/configs/cards.config";
import { motion } from "motion/react";

export function StatsSection() {
  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Don't Let Grading Overwhelm Your Institution
          </h2>
          <p className="text-xl text-muted-foreground">
            Manual grading is more than just a task; it's a significant operational drain that costs time and money.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {heroProblemCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="text-center md:text-left">
                  <div className="mb-4 inline-flex">
                    {card.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold mb-2">{card.title}</CardTitle>
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
