"use client";
import { cn } from "@gb/ui/src/lib/utils";
import { motion } from "motion/react";

export const GradeBench = ({ className }: { className?: string }) => {
  return (
    <>
      <div className={cn("aspect-square w-8", className)}>
        <motion.svg
          width="256"
          height="256"
          style={{ width: "100%", height: "100%" }}
          viewBox="0 0 256 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ rotate: 30 }}
          animate={{ rotate: 0 }}
          transition={{
            type: "spring",
            damping: 100,
            stiffness: 1000,
            mass: 10,
          }}
        >
          <motion.path
            d="M224 32H128C74.9807 32 32 74.9807 32 128C32 181.019 74.9807 224 128 224H154.021"
            stroke="#1E40AF"
            strokeWidth="48"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              delay: 0,
              duration: 1,
              type: "spring",
            }}
          />
          <motion.path
            d="M224 32H128C74.9807 32 32 74.9807 32 128C32 181.019 74.9807 224 128 224H154.021"
            stroke="#3B82F6"
            strokeWidth="48"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              delay: 0.1,
              duration: 1,
              type: "spring",
            }}
          />
          <motion.path
            d="M224 224V192V160C224 142.327 209.673 128 192 128H160H128"
            stroke="#3B82F6"
            strokeWidth="48"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              delay: 0.2,
              duration: 1,
              type: "spring",
            }}
          />
          <motion.path
            d="M224 224V192V160C224 142.327 209.673 128 192 128H160H128"
            stroke="#1E40AF"
            strokeWidth="48"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              delay: 0.4,
              duration: 1,
              type: "spring",
            }}
          />
        </motion.svg>
      </div>
    </>
  );
};
