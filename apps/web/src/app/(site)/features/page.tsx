import { Card, CardContent } from "@gb/design-system/components/ui/card";
import {
	H1,
	H3,
	Large,
	Lead,
	P,
	Small,
} from "@gb/design-system/components/ui/typography";
import { cn } from "@gb/design-system/lib/utils";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { featuresDetailInfo } from "@/configs/cards.config";
import { env } from "@/configs/env.config";

const FeaturesHero = () => {
	return (
		<section className="grid min-h-screen place-items-center bg-linear-to-br from-primary/20 via-background to-primary/20 px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl text-center">
				<H1 className="mb-8" data-testid="headline">
					The Most <span className="text-primary">Powerful </span>
					Toolkit for <span className="text-primary">Effortless </span>
					Evaluation
				</H1>
				<Lead className="leading-relaxed" data-testid="text">
					Explore the intelligent features that make GradeBench the smartest way
					to grade.
				</Lead>
			</div>
		</section>
	);
};

const FeatureDetails = () => {
	return (
		<section className="px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<div className="space-y-24">
					{featuresDetailInfo.map((info, index) => (
						<FeatureInfoTab
							index={index}
							key={index}
							icon={info.icon}
							title={info.title}
							subtitle={info.subtitle}
							description={info.description}
							cardIcon={info.card.icon}
							cardTitle={info.card.title}
							cardSubtitle={info.card.subtitle}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

const FeatureInfoTab = ({
	index,
	title,
	subtitle,
	description,
	icon,
	cardIcon,
	cardTitle,
	cardSubtitle,
}: {
	index: number;
	title: string;
	subtitle: string;
	description: string;
	icon: ReactNode;
	cardIcon: ReactNode;
	cardTitle: string;
	cardSubtitle: string;
}) => {
	return (
		<div
			className={cn(
				"flex flex-col gap-12",
				index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
			)}
		>
			<div className="flex-1">
				<div className="mb-6 flex items-center">
					{icon}
					<div>
						<H3>{title}</H3>
						<Large className="text-primary">{subtitle}</Large>
					</div>
				</div>
				<P className="leading-relaxed">{description}</P>
			</div>
			<Card className="flex-1 shadow-xl" data-testid="card">
				<CardContent className="p-8">
					<div className="rounded-lg bg-gradient-to-br from-primary/60 to-blue-400/60 p-6 text-center text-white">
						{cardIcon}
						<Large className="font-bold text-2xl">{cardTitle}</Large>
						<Small>{cardSubtitle}</Small>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export const metadata: Metadata = {
	metadataBase: new URL(`https://www.${env.server.BASE_DOMAIN}`),
	title: "AI Grading, Personalized Feedback & Analytics | GradeBench Features",
	description:
		"Explore GradeBench's powerful features: Grade in seconds with our AI, deliver personalized student feedback, and unlock performance insights with our analytics dashboard.",
	alternates: {
		canonical: `/features`,
	},
};

const FeaturesPage = () => {
	return (
		<>
			<FeaturesHero />
			<FeatureDetails />
		</>
	);
};

export default FeaturesPage;
