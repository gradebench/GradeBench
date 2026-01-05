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
import { Large } from "@gb/design-system/components/ui/typography";
import { cn } from "@gb/design-system/lib/utils";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GradeBench } from "@/components/anim/GradeBench";
import { sitePagesConfig } from "@/configs/pages.config";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, []);

  return (
    <motion.header
      animate={{ y: 0 }}
      className={
        "fixed top-0 right-0 left-0 z-50 border-white/10 border-b bg-background/60 py-3 shadow-lg backdrop-blur-xl backdrop-saturate-150"
      }
      initial={{ y: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <Link className="group flex items-center gap-2" href="/">
          <GradeBench className="transform transition-transform group-hover:scale-110" />
          <Large className="font-bold tracking-tight">GradeBench</Large>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {sitePagesConfig.map((page) => (
                <NavigationMenuItem key={page.href}>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent font-medium text-base hover:bg-primary/10 data-active:bg-primary/10",
                      pathname === page.href && "bg-primary/10 text-primary"
                    )}
                    href={page.href}
                  >
                    {page.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Button
            render={<Link href="/auth/login">Log in</Link>}
            variant="outline"
          />
          <Button render={<Link href="/auth/signup">Get Started</Link>} />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet onOpenChange={setIsOpen} open={isOpen}>
            <SheetTrigger
              nativeButton={false}
              render={
                <Button nativeButton={true} size="icon" variant="ghost">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />
            <SheetContent className="w-75 sm:w-100" side="right">
              <SheetHeader className="mb-4 border-b pb-4 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <GradeBench className="h-8 w-8" />
                  <span>GradeBench</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                {sitePagesConfig.map((page) => (
                  <Link
                    className={cn(
                      "rounded-md px-4 py-2 font-medium text-lg transition-colors hover:bg-muted",
                      pathname === page.href && "bg-primary/10 text-primary"
                    )}
                    href={page.href}
                    key={page.href}
                  >
                    {page.label}
                  </Link>
                ))}
                <div className="my-4 border-border/50 border-t" />
                <div className="flex flex-col gap-3 px-2">
                  <Button
                    render={<Link href="/auth/login">Log in</Link>}
                    variant="outline"
                  />
                  <Button
                    render={<Link href="/auth/signup">Get Started</Link>}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
