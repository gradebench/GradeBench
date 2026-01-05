"use client";

import { Button } from "@gb/design-system/components/ui/button";
import { ButtonGroup } from "@gb/design-system/components/ui/button-group";
import { ArrowLeft, Home } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export const NotFoundControls = () => {
  const router = useRouter();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <ButtonGroup className="m-auto flex w-full max-w-80 max-sm:flex-col">
        <ButtonGroup className="w-full flex-1">
          <Button
            className="group w-full"
            onClick={() => router.back()}
            variant="outline"
          >
            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
        </ButtonGroup>
        <ButtonGroup className="w-full flex-1">
          <Button
            className="w-full shadow-lg shadow-primary/25"
            onClick={() => router.push("/")}
          >
            <Home />
            Go Home
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </motion.div>
  );
};
