"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Trusted by Leaders in Education
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             Leading institutes rely on GradeBench to streamline their evaluation process and provide superior feedback to their students.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          <motion.div 
             whileHover={{ scale: 1.05 }}
             transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
                className="block p-8 rounded-2xl bg-background border border-border/50 shadow-lg hover:shadow-xl transition-all"
                href="https://samkalpias.com/"
                target="_blank"
            >
                <Image
                alt={"Samkalp IAS Coaching logo"}
                height={120}
                src={"/assets/institute/samkalp-ias.png"}
                width={120}
                className="w-auto h-24 object-contain mx-auto"
                />
                <p className="mt-4 font-semibold text-lg">Samkalp IAS</p>
                <p className="text-sm text-muted-foreground">New Delhi</p>
            </Link>
          </motion.div>

          <motion.div 
             whileHover={{ scale: 1.05 }}
             transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
             <Link
                className="block p-8 rounded-2xl bg-background border border-border/50 shadow-lg hover:shadow-xl transition-all"
                href="https://primusias.com/"
                target="_blank"
            >
                <Image
                alt={"Primus IAS Coaching logo"}
                height={120}
                src={"/assets/institute/primus-ias.png"}
                width={120}
                className="w-auto h-24 object-contain mx-auto"
                />
                 <p className="mt-4 font-semibold text-lg">Primus IAS</p>
                <p className="text-sm text-muted-foreground">Bengaluru</p>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
