"use client";

import { GradeBench } from "@/components/anim/GradeBench";
import { sitePagesConfig } from "@/configs/pages.config";
import { Button } from "@gb/design-system/components/ui/button";
import { Separator } from "@gb/design-system/components/ui/separator";
import { Input } from "@gb/design-system/components/ui/input";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Github } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <GradeBench className="w-8 h-8" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">GradeBench</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Empowering educators with AI-driven grading solutions. 
              Save time, ensure fairness, and focus on what matters most—teaching.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
               <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">Product</h3>
            <ul className="space-y-3">
              {sitePagesConfig.map((page) => (
                <li key={page.href}>
                  <Link 
                    href={page.href} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                   Pricing
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                   Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
               <li>
                <Link href="/legal/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
             <h3 className="font-semibold text-foreground mb-6">Stay Updated</h3>
             <p className="text-sm text-muted-foreground mb-4">
               Subscribe to our newsletter for the latest updates and features.
             </p>
             <div className="flex flex-col gap-2">
               <Input placeholder="Enter your email" type="email" className="bg-background" />
               <Button>Subscribe</Button>
             </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} GradeBench. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>All systems operational</span>
            </div>
            <Link href="mailto:support@gradebench.com" className="hover:text-primary transition-colors">
              support@gradebench.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
