"use client";

import { Button } from "@gb/design-system/components/ui/button";
import { Badge } from "@gb/design-system/components/ui/badge";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { ThemedImage } from "@/components/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[100px] rounded-full opacity-50 dark:opacity-20" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full opacity-30 dark:opacity-10" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 rounded-full text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Reshaping Education Evaluation
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Grade in <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Seconds</span>.<br />
                Teach for <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Hours</span>.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                GradeBench automates 95% of your grading workload with AI-powered precision. 
                Deliver fair, instant, and personalized feedback so you can get back to what matters most.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20" render={<Link href="/auth/signup">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>} />
                <Button size="lg" variant="outline" className="h-12 px-8 text-base" render={<Link href="/features"><PlayCircle className="ml-2 h-4 w-4" /> View Demo</Link>} />
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
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
          <div className="flex-1 w-full max-w-[600px] lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-2xl overflow-hidden aspect-[4/3] group">
                {/* Abstract UI representation since we don't have a real screenshot yet */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background flex items-center justify-center">
                   <div className="grid grid-cols-2 gap-4 p-8 w-full max-w-md opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="col-span-2 h-8 bg-primary/10 rounded-md w-3/4 animate-pulse"></div>
                      <div className="h-24 bg-card rounded-md shadow-sm border border-border/50 p-4 space-y-2">
                         <div className="h-2 bg-muted rounded w-1/2"></div>
                         <div className="h-2 bg-muted rounded w-full"></div>
                      </div>
                       <div className="h-24 bg-card rounded-md shadow-sm border border-border/50 p-4 space-y-2">
                         <div className="h-2 bg-muted rounded w-1/2"></div>
                         <div className="h-2 bg-muted rounded w-full"></div>
                      </div>
                      <div className="col-span-2 h-32 bg-card rounded-md shadow-sm border border-border/50 p-4 space-y-3">
                         <div className="flex justify-between">
                            <div className="h-3 bg-muted rounded w-1/4"></div>
                            <div className="h-3 bg-green-500/20 rounded w-1/6"></div>
                         </div>
                         <div className="h-2 bg-muted rounded w-full"></div>
                         <div className="h-2 bg-muted rounded w-5/6"></div>
                         <div className="h-2 bg-muted rounded w-4/6"></div>
                      </div>
                   </div>
                </div>

                {/* Floating Elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-xl border border-border/50 z-10 hidden sm:block"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">98%</div>
                    <div>
                      <div className="text-sm font-semibold">Accuracy</div>
                      <div className="text-xs text-muted-foreground">AI Grading Score</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border border-border/50 z-10 hidden sm:block"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                   <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">30s</div>
                    <div>
                      <div className="text-sm font-semibold">Speed</div>
                      <div className="text-xs text-muted-foreground">Per answer sheet</div>
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
