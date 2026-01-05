"use client";

import { Button } from "@gb/design-system/components/ui/button";
import { Input } from "@gb/design-system/components/ui/input";
import { Separator } from "@gb/design-system/components/ui/separator";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { GradeBench } from "@/components/anim/GradeBench";
import { sitePagesConfig } from "@/configs/pages.config";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-2">
            <Link className="flex items-center gap-2" href="/">
              <GradeBench className="h-8 w-8" />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text font-bold text-2xl text-transparent">
                GradeBench
              </span>
            </Link>
            <p className="max-w-sm text-muted-foreground leading-relaxed">
              Empowering educators with AI-driven grading solutions. Save time,
              ensure fairness, and focus on what matters most—teaching.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Button
                className="rounded-full hover:bg-primary/10 hover:text-primary"
                size="icon"
                variant="ghost"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                className="rounded-full hover:bg-primary/10 hover:text-primary"
                size="icon"
                variant="ghost"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button
                className="rounded-full hover:bg-primary/10 hover:text-primary"
                size="icon"
                variant="ghost"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 font-semibold text-foreground">Product</h3>
            <ul className="space-y-3">
              {sitePagesConfig.map((page) => (
                <li key={page.href}>
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-primary"
                    href={page.href}
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="text-muted-foreground text-sm transition-colors hover:text-primary"
                  href="/pricing"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground text-sm transition-colors hover:text-primary"
                  href="/changelog"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-6 font-semibold text-foreground">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-muted-foreground text-sm transition-colors hover:text-primary"
                  href="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground text-sm transition-colors hover:text-primary"
                  href="/careers"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground text-sm transition-colors hover:text-primary"
                  href="/legal/privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground text-sm transition-colors hover:text-primary"
                  href="/legal/terms"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 font-semibold text-foreground">Stay Updated</h3>
            <p className="mb-4 text-muted-foreground text-sm">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <div className="flex flex-col gap-2">
              <Input
                className="bg-background"
                placeholder="Enter your email"
                type="email"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-muted-foreground text-sm md:flex-row">
          <p>© {currentYear} GradeBench. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>All systems operational</span>
            </div>
            <Link
              className="transition-colors hover:text-primary"
              href="mailto:support@gradebench.com"
            >
              support@gradebench.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
