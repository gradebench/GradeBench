"use client";

import { cn } from "@gb/design-system/lib/utils";
import { motion } from "motion/react";

export const GradeBench = ({ className }: { className?: string }) => {
  return (
    <div className={cn("aspect-square w-8", className)}>
      <motion.svg
        animate={{ rotate: 0, opacity: 10 }}
        aria-label="GradeBench"
        fill="none"
        height="256"
        initial={{ rotate: 30, opacity: 0 }}
        role="img"
        style={{ width: "100%", height: "100%" }}
        transition={{
          type: "spring",
          damping: 100,
          stiffness: 1000,
          mass: 10,
        }}
        viewBox="0 0 256 256"
        width="256"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          animate={{ pathLength: 1, opacity: 10 }}
          d="M224 32H128C74.9807 32 32 74.9807 32 128C32 181.019 74.9807 224 128 224H154.021"
          initial={{ pathLength: 0, opacity: 0 }}
          stroke="#1E40AF"
          strokeLinecap="round"
          strokeWidth="48"
          transition={{
            delay: 0,
            duration: 1,
            type: "spring",
          }}
        />
        <motion.path
          animate={{ pathLength: 1, opacity: 10 }}
          d="M224 32H128C74.9807 32 32 74.9807 32 128C32 181.019 74.9807 224 128 224H154.021"
          initial={{ pathLength: 0, opacity: 0 }}
          stroke="#3B82F6"
          strokeLinecap="round"
          strokeWidth="48"
          transition={{
            delay: 0.1,
            duration: 1,
            type: "spring",
          }}
        />
        <motion.path
          animate={{ pathLength: 1, opacity: 10 }}
          d="M224 224V192V160C224 142.327 209.673 128 192 128H160H128"
          initial={{ pathLength: 0, opacity: 0 }}
          stroke="#3B82F6"
          strokeLinecap="round"
          strokeWidth="48"
          transition={{
            delay: 0.2,
            duration: 1,
            type: "spring",
          }}
        />
        <motion.path
          animate={{ pathLength: 1, opacity: 10 }}
          d="M224 224V192V160C224 142.327 209.673 128 192 128H160H128"
          initial={{ pathLength: 0, opacity: 0 }}
          stroke="#1E40AF"
          strokeLinecap="round"
          strokeWidth="48"
          transition={{
            delay: 0.4,
            duration: 1,
            type: "spring",
          }}
        />
      </motion.svg>
    </div>
  );
};
