"use client";

import { Badge } from "@gb/design-system/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/design-system/components/ui/card";
import { motion } from "motion/react";
import { aboutTeamInfo } from "@/configs/cards.config";

function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-20 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-background/0 to-background/0" />

      <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            className="mb-6 border-primary/20 bg-primary/5 px-4 py-1 text-primary"
            variant="outline"
          >
            Our Mission
          </Badge>
          <h1 className="mb-8 font-bold text-4xl tracking-tight md:text-6xl">
            We're on a Mission to{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Empower Educators
            </span>
          </h1>
          <p className="text-muted-foreground text-xl leading-relaxed">
            GradeBench was founded on a single, powerful idea: technology should
            reduce the cognitive load on educators, not add to it. We are
            dedicated to making academic evaluations quick, fair, and profoundly
            meaningful.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function AboutVision() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-2xl">
              {/* Placeholder for Vision Image */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-blue-600/20">
                <div className="p-8 text-center">
                  <span className="mb-4 block text-6xl">🌍</span>
                  <span className="font-medium text-lg text-muted-foreground">
                    Global Impact
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="mb-6 font-bold text-3xl tracking-tight md:text-4xl">
              A World Where Every Evaluation Fuels Growth
            </h2>
            <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
              We envision an educational landscape where feedback is instant,
              learning is continuous, and educators are free to inspire.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              By automating the mechanics of grading, we empower institutions to
              deliver the timely, unbiased, and personalized guidance that
              allows every student to thrive.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TeamCard({
  name,
  fallback,
  role,
  expertise,
  description,
  index,
}: {
  name: string;
  fallback: string;
  role: string;
  expertise: string;
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
      <Card className="h-full border-border/50 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="pb-6 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 transform items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 shadow-lg transition-transform hover:scale-110">
            <span className="font-bold text-2xl text-white tracking-wider">
              {fallback}
            </span>
          </div>
          <CardTitle className="mb-1 font-bold text-xl">{name}</CardTitle>
          <div className="flex flex-col items-center gap-2">
            <span className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
              {role}
            </span>
            <Badge
              className="bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              variant="secondary"
            >
              {expertise}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AboutTeam() {
  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 font-bold text-3xl tracking-tight md:text-4xl">
            The Team Building the Future
          </h2>
          <p className="text-lg text-muted-foreground">
            Meet the passionate individuals driving the revolution in
            educational assessment.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {aboutTeamInfo.map((card, index) => (
            <TeamCard
              description={card.description}
              expertise={card.expertise}
              fallback={card.fallback}
              index={index}
              key={card.name}
              name={card.name}
              role={card.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutClient() {
  return (
    <>
      <AboutHero />
      <AboutVision />
      <AboutTeam />
    </>
  );
}
