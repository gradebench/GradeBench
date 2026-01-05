"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center md:px-6">
        <div className="mx-auto mb-16 max-w-4xl">
          <h2 className="mb-6 font-bold text-3xl tracking-tight md:text-4xl">
            Trusted by Leaders in Education
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
            Leading institutes rely on GradeBench to streamline their evaluation
            process and provide superior feedback to their students.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-12 md:flex-row md:gap-24">
          <motion.div
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              className="block rounded-2xl border border-border/50 bg-background p-8 shadow-lg transition-all hover:shadow-xl"
              href="https://samkalpias.com/"
              target="_blank"
            >
              <Image
                alt={"Samkalp IAS Coaching logo"}
                className="mx-auto h-24 w-auto object-contain"
                height={120}
                src={"/assets/institute/samkalp-ias.png"}
                width={120}
              />
              <p className="mt-4 font-semibold text-lg">Samkalp IAS</p>
              <p className="text-muted-foreground text-sm">New Delhi</p>
            </Link>
          </motion.div>

          <motion.div
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              className="block rounded-2xl border border-border/50 bg-background p-8 shadow-lg transition-all hover:shadow-xl"
              href="https://primusias.com/"
              target="_blank"
            >
              <Image
                alt={"Primus IAS Coaching logo"}
                className="mx-auto h-24 w-auto object-contain"
                height={120}
                src={"/assets/institute/primus-ias.png"}
                width={120}
              />
              <p className="mt-4 font-semibold text-lg">Primus IAS</p>
              <p className="text-muted-foreground text-sm">Bengaluru</p>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
