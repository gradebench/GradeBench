import { Button } from "@gb/design-system/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@gb/design-system/components/ui/card";
import { H1, H2, Lead, P } from "@gb/design-system/components/ui/typography";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemedImage } from "@/components/image";
import { heroProblemCards, heroSolutionCards } from "@/configs/cards.config";
import { env } from "@/configs/env.config";

const HomeProblemCard = ({
	icon,
	title,
	content,
}: {
	icon: ReactNode;
	title: string;
	content: ReactNode;
}) => {
	return (
		<Card
			className="shadow-lg transition-shadow duration-300 hover:shadow-xl"
			data-testid="card"
		>
			<CardHeader className="pb-4 text-center">
				<div>{icon}</div>
				<CardTitle className="font-bold text-xl">{title}</CardTitle>
			</CardHeader>
			<CardContent className="text-center">{content}</CardContent>
		</Card>
	);
};

const HomeHeroSection = () => {
	return (
		<section className="grid min-h-screen place-items-center bg-linear-to-br from-primary/20 via-background to-primary/20 px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl text-center">
				<H1 className="mb-4" data-testid="headline">
					<span className="text-primary">Grade</span>
					<span> in Seconds. </span>
					<span className="text-primary">Teach</span>
					<span> for Hours. </span>
				</H1>
				<Lead className="mb-8 leading-relaxed" data-testid="sub-headline">
					GradeBench automates 95% of your grading workload, delivering fair,
					instant, and personalized feedback so your educators can get back to
					teaching.
				</Lead>
				<div className="flex flex-col justify-center gap-4 sm:flex-row">
					<Button size="lg" data-testid="primary-cta">
						See GradeBench in Action
					</Button>
					<Button variant="outline" size="lg" data-testid="secondary-cta">
						<Link href={"/features"}>Explore the Features</Link>
					</Button>
				</div>
			</div>
		</section>
	);
};

const SupportedBySection = () => {
	return (
		<section className="px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl text-center">
				<div className="mb-16 text-center">
					<H2 className="mb-6" data-testid="headline">
						Accelerated by the Best in Tech
					</H2>
					<Lead
						className="mx-auto max-w-4xl leading-relaxed"
						data-testid="text"
					>
						We partner with industry-leading technology companies to build the
						future of education. Their expertise and infrastructure empower us
						to deliver powerful, scalable solutions to educators worldwide.
					</Lead>
				</div>
				<div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
					<Link
						className="flex items-center justify-center rounded-2xl border border-border/50 bg-background/50 p-8 shadow-[0_0_40px_-15px_rgba(0,164,239,0.3)] backdrop-blur-xs"
						href="https://www.microsoft.com/en-in/startups"
						target="_blank"
						rel="noopener noreferrer"
					>
						<ThemedImage
							lightSrc="/assets/company/microsoft/light.jpg"
							darkSrc="/assets/company/microsoft/dark.png"
							alt="Microsoft For Startups"
							width={128}
							height={128}
							style={{ width: "auto", height: "auto" }}
							className="h-12 w-auto object-contain"
						/>
					</Link>
					<Link
						className="flex items-center justify-center rounded-2xl border border-border/50 bg-background/50 p-8 shadow-[0_0_40px_-15px_rgba(255,153,0,0.3)] backdrop-blur-xs"
						href="https://aws.amazon.com/startups"
						target="_blank"
						rel="noopener noreferrer"
					>
						<ThemedImage
							lightSrc="/assets/company/aws/light.svg"
							darkSrc="/assets/company/aws/dark.png"
							alt="Amazon Web Services"
							width={128}
							height={128}
							style={{ width: "auto", height: "auto" }}
							className="h-12 w-auto object-contain"
						/>
					</Link>
					<Link
						className="flex items-center justify-center rounded-2xl border border-border/50 bg-background/50 p-8 shadow-[0_0_40px_-15px_rgba(66,133,244,0.3)] backdrop-blur-xs"
						href="https://startup.google.com/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<ThemedImage
							lightSrc="/assets/company/google/light.svg"
							darkSrc="/assets/company/google/dark.svg"
							alt="Google Logo"
							width={128}
							height={128}
							style={{ width: "auto", height: "auto" }}
							className="h-12 w-auto object-contain"
						/>
					</Link>
					<Link
						className="flex items-center justify-center rounded-2xl border border-border/50 bg-background/50 p-8 shadow-[0_0_40px_-15px_rgba(118,185,0,0.3)] backdrop-blur-xs"
						href="https://www.nvidia.com/en-in/startups/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<ThemedImage
							lightSrc="/assets/company/nvidia/light.jpg"
							darkSrc="/assets/company/nvidia/dark.png"
							alt="Nvidia Logo"
							width={128}
							height={128}
							style={{ width: "auto", height: "auto" }}
							className="h-12 w-auto object-contain"
						/>
					</Link>
				</div>
			</div>
		</section>
	);
};

const ProblemSection = () => {
	return (
		<section className="px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<div className="mb-16 text-center">
					<H2 className="mb-6" data-testid="headline">
						Don&apos;t Let Grading Overwhelm Your Institution
					</H2>
					<Lead
						className="mx-auto max-w-4xl leading-relaxed"
						data-testid="text"
					>
						Manual grading is more than just a task; it&apos;s a significant
						operational drain. It consumes thousands of hours, inflates costs,
						and delays the crucial feedback students need to succeed.
					</Lead>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{heroProblemCards.map((card, index) => (
						<HomeProblemCard
							key={index}
							title={card.title}
							icon={card.icon}
							content={card.content}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

const SolutionSection = () => {
	return (
		<section className="px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<div className="mb-16 text-center">
					<H2 className="mb-6" data-testid="headline">
						The Future of Evaluation is Here
					</H2>
					<Lead
						className="mx-auto max-w-4xl leading-relaxed"
						data-testid="text"
					>
						GradeBench is the all-in-one solution designed to make your
						evaluation process lightning-fast, remarkably affordable, and
						perfectly fair.
					</Lead>
				</div>
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{heroSolutionCards.map((card, index) => (
						<Card
							className="shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
							key={index}
							data-testid="card"
						>
							<CardHeader className="pb-4">
								{card.icon}
								<CardTitle className="font-bold text-xl">
									{card.title}
								</CardTitle>
							</CardHeader>
							<CardContent>{card.content}</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

const SocialProof = () => {
	return (
		<section className="px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl text-center">
				<div className="mb-16 text-center">
					<H2 className="mb-6" data-testid="headline">
						Trusted by Leaders in Competitive Exam Coaching
					</H2>
					<Lead className="mx-auto mb-12 max-w-4xl" data-testid="text">
						Our technology is already delivering results. We are proud to be
						working with <span className="font-bold">Samkalp IAS in Delhi</span>{" "}
						and <span className="font-bold">Primus IAS in Bengaluru</span>,
						helping them streamline their evaluation process and provide
						superior feedback to their students.
					</Lead>
				</div>

				<div className="md:height-full flex flex-col items-stretch justify-center space-y-8 md:flex-row md:space-x-6 md:space-y-0">
					<Link
						className="grid flex-1 place-items-center"
						href="https://samkalpias.com/"
						target="_blank"
					>
						<Image
							src={"/assets/institute/samkalp-ias.png"}
							alt={"Samkalp IAS Coaching logo"}
							width={150}
							height={150}
						/>
					</Link>
					<Link
						className="grid flex-1 place-items-center"
						href="https://primusias.com/"
						target="_blank"
					>
						<Image
							src={"/assets/institute/primus-ias.png"}
							alt={"Primus IAS Coaching logo"}
							width={150}
							height={150}
						/>
					</Link>
				</div>
			</div>
		</section>
	);
};

const FinalCTA = () => {
	return (
		<section className="bg-linear-to-r from-primary to-blue-500/50 px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl text-center">
				<H2 className="mb-6" data-testid="headline">
					Ready to Revolutionize Your Grading?
				</H2>
				<P className="mb-8" data-testid="text">
					Reclaim countless hours and empower your educators with the
					market&apos;s leading evaluation platform.
				</P>
				<Button
					size="lg"
					className="bg-accent-foreground px-8 py-3 text-accent hover:bg-accent-foreground/90"
					data-testid="cta"
				>
					Request Your Free Demo
				</Button>
			</div>
		</section>
	);
};

export const metadata: Metadata = {
	metadataBase: new URL(`https://www.${env.server.BASE_DOMAIN}`),
	title: "Automated Grading & AI Evaluation Platform | GradeBench",
	description:
		"GradeBench saves educators 95% of their time with AI-powered grading. Get instant, unbiased feedback and cut evaluation costs by 70%. Transform your institution today.",
	alternates: {
		canonical: "/",
	},
};

const HomePage = () => {
	return (
		<>
			<HomeHeroSection />
			<SupportedBySection />
			<ProblemSection />
			<SolutionSection />
			<SocialProof />
			<FinalCTA />
		</>
	);
};

export default HomePage;
