"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/design-system/components/ui/card";
import { Badge } from "@gb/design-system/components/ui/badge";
import { aboutTeamInfo } from "@/configs/cards.config";
import { motion } from "motion/react";

function AboutHero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-muted/30">
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-background/0 to-background/0 pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
            >
                <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/20 text-primary bg-primary/5">
                    Our Mission
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                    We're on a Mission to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Empower Educators</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    GradeBench was founded on a single, powerful idea: technology should reduce the cognitive load on educators, not add to it. 
                    We are dedicated to making academic evaluations quick, fair, and profoundly meaningful.
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
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                 <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                 >
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-muted">
                        {/* Placeholder for Vision Image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center">
                             <div className="text-center p-8">
                                <span className="block text-6xl mb-4">🌍</span>
                                <span className="text-lg font-medium text-muted-foreground">Global Impact</span>
                             </div>
                        </div>
                    </div>
                 </motion.div>

                 <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                 >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                        A World Where Every Evaluation Fuels Growth
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        We envision an educational landscape where feedback is instant, learning is continuous, and educators are free to inspire.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                         By automating the mechanics of grading, we empower institutions to deliver the timely, unbiased, and personalized guidance that allows every student to thrive.
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
  index
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
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
    >
        <Card className="h-full border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-6">
                 <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                    <span className="font-bold text-2xl text-white tracking-wider">{fallback}</span>
                </div>
                <CardTitle className="font-bold text-xl mb-1">{name}</CardTitle>
                <div className="flex flex-col gap-2 items-center">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{role}</span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        {expertise}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed text-sm">
                    {description}
                </p>
            </CardContent>
        </Card>
    </motion.div>
  );
}

function AboutTeam() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            The Team Building the Future
          </h2>
          <p className="text-lg text-muted-foreground">
             Meet the passionate individuals driving the revolution in educational assessment.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {aboutTeamInfo.map((card, index) => (
            <TeamCard
              key={card.name}
              description={card.description}
              expertise={card.expertise}
              fallback={card.fallback}
              name={card.name}
              role={card.role}
              index={index}
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
