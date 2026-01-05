"use client";

import { Button } from "@gb/design-system/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@gb/design-system/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@gb/design-system/components/ui/sheet";
import { cn } from "@gb/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { sitePagesConfig } from "@/configs/pages.config";
import { GradeBench } from "@/components/anim/GradeBench";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border/50 shadow-sm py-3"
          : "bg-transparent border-transparent py-5"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
           <GradeBench className="transform transition-transform group-hover:scale-110" />
           <span className="text-xl font-bold tracking-tight">GradeBench</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {sitePagesConfig.map((page) => (
                <NavigationMenuItem key={page.href}>
                  <Link href={page.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-primary/10 data-[active]:bg-primary/10 text-base font-medium",
                        pathname === page.href && "text-primary bg-primary/10"
                      )}
                    >
                      {page.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="font-medium" render={<Link href="/auth/login">Log in</Link>} />
          <Button className="font-medium" render={<Link href="/auth/signup">Get Started</Link>} />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <SheetTitle className="flex items-center gap-2">
                    <GradeBench className="w-8 h-8" />
                    <span>GradeBench</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                {sitePagesConfig.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={cn(
                      "text-lg font-medium px-4 py-2 rounded-md transition-colors hover:bg-muted",
                      pathname === page.href && "text-primary bg-primary/10"
                    )}
                  >
                    {page.label}
                  </Link>
                ))}
                <div className="my-4 border-t border-border/50" />
                <div className="flex flex-col gap-3 px-2">
                   <Button variant="outline" className="w-full justify-start" render={<Link href="/auth/login">Log in</Link>} />
                   <Button className="w-full" render={<Link href="/auth/signup">Get Started</Link>} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
