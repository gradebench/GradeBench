"use client";

import { Button } from "@gb/design-system/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 opacity-90 dark:opacity-80" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />

      <div className="container relative z-10 mx-auto px-4 text-center text-white md:px-6">
        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-8 font-bold text-3xl tracking-tight md:text-5xl">
            Ready to Revolutionize Your Grading?
          </h2>
          <p className="mb-10 text-white/90 text-xl leading-relaxed md:text-2xl">
            Reclaim countless hours and empower your educators with the market's
            leading evaluation platform.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              className="h-14 px-8 font-semibold text-lg shadow-xl transition-transform hover:scale-105"
              render={
                <Link href="/auth/signup">
                  Request Your Free Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              }
              size="lg"
              variant="secondary"
            />
            <Button
              className="h-14 border-white bg-transparent px-8 text-lg text-white hover:bg-white/10 hover:text-white"
              render={<Link href="/contact">Contact Sales</Link>}
              size="lg"
              variant="outline"
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
