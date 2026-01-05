import {
  Card,
  CardContent,
  CardHeader,
} from "@gb/design-system/components/ui/card";
import { H1, Large, Muted } from "@gb/design-system/components/ui/typography";
import { FileSearch, Ghost, Sparkles } from "lucide-react";
import * as motion from "motion/react-client";
import type { Metadata } from "next";
import { NotFoundControls } from "./client";

export const metadata: Metadata = {
  title: "404 - Page Not Found | GradeBench",
  description: "The page you are looking for does not exist on GradeBench.",
};

const NotFound = () => {
  return (
    <main className="relative grid min-h-screen place-items-center p-8">
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="border-t-4 border-t-primary/64">
          <CardHeader className="p-4 text-center">
            <div className="relative flex justify-center">
              <motion.div
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                className="relative z-10"
                initial={{ rotate: -15, scale: 0.5, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                  delay: 0.2,
                }}
              >
                <div className="relative my-4 flex h-20 w-20 items-center justify-center rounded-xl border border-white/20 bg-linear-to-br from-primary/20 via-primary/5 to-blue-500/20 shadow-inner backdrop-blur-md dark:border-white/10">
                  <FileSearch
                    className="h-12 w-12 animate-pulse text-primary drop-shadow-xl"
                    strokeWidth={1.25}
                  />

                  {/* Ornamental pieces */}
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                    className="absolute -top-4 -right-4 flex h-8 w-8 items-center justify-center rounded-md border border-border/50 bg-background shadow-xl"
                    transition={{
                      duration: 3.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-amber-400" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                    className="absolute -bottom-2 -left-4 flex h-8 w-8 items-center justify-center rounded-md border border-border/50 bg-background shadow-xl"
                    transition={{
                      duration: 4.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  >
                    <Ghost className="h-4 w-4 text-muted-foreground/60" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Radial glow */}
              <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 opacity-60 blur-[80px]" />
            </div>

            <H1 className="bg-linear-to-b from-foreground to-foreground/64 bg-clip-text font-black text-8xl text-transparent">
              404
            </H1>
            <Large className="font-bold text-2xl">Not Found</Large>
          </CardHeader>

          <CardContent className="space-y-10 px-10 pb-16 text-center">
            <Muted>
              We couldn't find the page you're looking for. It might have
              drifted off our index or been migrated to a new location.
            </Muted>

            <NotFoundControls />
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
};

export default NotFound;
