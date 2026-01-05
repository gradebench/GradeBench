"use client";

import { Button } from "@gb/design-system/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 opacity-90 dark:opacity-80" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
            >
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
                    Ready to Revolutionize Your Grading?
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
                    Reclaim countless hours and empower your educators with the market's leading evaluation platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                        size="lg" 
                        variant="secondary" 
                        className="h-14 px-8 text-lg font-semibold shadow-xl hover:scale-105 transition-transform"
                        render={<Link href="/auth/signup">Request Your Free Demo <ArrowRight className="ml-2 h-5 w-5" /></Link>}
                    />
                    <Button 
                        size="lg" 
                        variant="outline" 
                        className="h-14 px-8 text-lg bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
                        render={<Link href="/contact">Contact Sales</Link>}
                    />
                </div>
                <p className="mt-8 text-sm text-white/70">
                    Join forward-thinking institutes transforming education today.
                </p>
            </motion.div>
        </div>
    </section>
  );
}
