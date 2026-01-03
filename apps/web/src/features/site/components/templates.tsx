import { Button } from "@gb/design-system/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@gb/design-system/components/ui/navigation-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@gb/design-system/components/ui/popover";
import { Separator } from "@gb/design-system/components/ui/separator";
import { H3, P } from "@gb/design-system/components/ui/typography";
import { Award, CheckCircle, Mail, Menu, Shield } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { GradeBench } from "@/components/anim/GradeBench";
import { siteConfig } from "../configs/site";
import type {
	HeaderCTAType,
	NavigationIndexType,
	NavigationMenuItemType,
} from "../types/site";

export const SiteLayout = ({ children }: { children: ReactNode }) => {
	return (
		<DefaultRootLayout>
			<SiteHeader />
			{children}
			<SiteFooter />
		</DefaultRootLayout>
	);
};

export const SitePage = ({ children }: { children: ReactNode }) => {
	return <main className="min-h-screen">{children}</main>;
};

export const SiteHeader = () => {
	return (
		<header className="sticky top-0 z-100 border-b bg-primary/4 px-4 backdrop-blur-lg md:px-6">
			<div className="flex h-16 items-center justify-between gap-4">
				{/* Left side */}
				<LeftNav />
				{/* Right side */}
				<RightNav />
			</div>
		</header>
	);
};

export const LeftNav = ({
	index = siteConfig.header.navigation.index,
	menu = siteConfig.header.navigation.menu,
}: {
	index?: NavigationIndexType;
	menu?: NavigationMenuItemType[];
}) => {
	return (
		<div className="flex items-center gap-2">
			<div className="flex items-center gap-6">
				<Link href={index.href} className="text-primary hover:text-primary/90">
					{index.element}
				</Link>
				<NavigationMenu className="max-md:hidden">
					<NavigationMenuList className="gap-2">
						{menu.map((item, index) => (
							<NavigationMenuItem key={index}>
								<NavigationMenuLink
									href={item.href}
									className="py-1.5 font-medium text-muted-foreground hover:text-primary"
								>
									{item.label}
								</NavigationMenuLink>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</div>
	);
};

export const RightNav = ({
	cta = siteConfig.header.CTA,
	menu = siteConfig.header.navigation.menu,
}: {
	cta?: HeaderCTAType;
	menu?: NavigationMenuItemType[];
}) => {
	return (
		<div className="flex items-center gap-2">
			<Button size="sm" className="max-md:hidden">
				<Link href={cta.href}>{cta.label}</Link>
			</Button>

			<Popover>
				<PopoverTrigger>
					<Button size={"icon"} variant={"ghost"} className="md:hidden">
						<Menu />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="z-100 w-36 p-1 md:hidden">
					<NavigationMenu className="max-w-none *:w-full">
						<NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
							{menu.map((link, index) => (
								<NavigationMenuItem key={index} className="w-full">
									<NavigationMenuLink href={link.href} className="py-1.5">
										{link.label}
									</NavigationMenuLink>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export const SiteFooter = ({
	quickLinks = siteConfig.footer.quickLinks,
}: {
	quickLinks?: NavigationMenuItemType[];
}) => {
	return (
		<footer className="bg-slate-900">
			<div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
					{/* Brand Section */}
					<div className="lg:col-span-2">
						<div className="mb-6 flex items-center">
							<span className="flex gap-8 font-bold text-3xl text-white">
								<GradeBench />
								GradeBench
							</span>
						</div>
						<P className="mb-6 max-w-md text-slate-300 leading-relaxed">
							Empowering educators with AI-powered grading solutions that are
							fast, fair, and affordable. Transform your evaluation process
							today.
						</P>
						<div className="flex items-center space-x-2 text-slate-300">
							<Mail className="h-5 w-5" />
							<span>official@gradebench.com</span>
						</div>
					</div>

					{/* Quick Links */}
					<div className="text-center lg:col-span-3">
						<H3 className="mb-6 font-semibold text-lg text-white">
							Quick Links
						</H3>
						<ul className="space-y-2">
							{quickLinks.map((link, index) => (
								<li key={index}>
									<Link
										href={link.href}
										className="text-slate-300 transition-colors hover:text-white"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
				<Separator className="my-8" />
				<div className="border-slate-700">
					<div className="flex flex-col items-center justify-between md:flex-row">
						<div className="flex flex-col items-center space-y-2 md:flex-row md:space-x-8 md:space-y-0">
							<P className="text-slate-300">
								© {new Date().getFullYear()} GradeBench. All rights reserved.
							</P>
						</div>
					</div>

					{/* Trust Indicators */}
					<Separator className="my-4" />
					<div className="border-slate-800">
						<div className="flex flex-col items-center justify-between md:flex-row">
							<div className="mb-4 flex items-center space-x-8 md:mb-0">
								<div className="flex items-center space-x-2">
									<Shield className="h-5 w-5 text-green-400" />
									<span className="text-slate-300 text-sm">100% Secure</span>
								</div>
								<div className="flex items-center space-x-2">
									<CheckCircle className="h-5 w-5 text-green-400" />
									<span className="text-slate-300 text-sm">
										95% Faster Grading
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<Award className="h-5 w-5 text-green-400" />
									<span className="text-slate-300 text-sm">
										Trusted by Leading Institutes
									</span>
								</div>
							</div>

							<div className="text-slate-400 text-sm">
								Made with ❤️ for Educators
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
