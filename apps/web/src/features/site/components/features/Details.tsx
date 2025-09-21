import { Card, CardContent } from "@gb/ui/src/components/ui/card";
import { H3, Large, P, Small } from "@gb/ui/src/components/ui/typography";
import { cn } from "@gb/ui/src/lib/utils";
import type { ReactNode } from "react";
import { featuresDetailInfo } from "../../configs/cards";

export const FeatureDetails = () => {
	return (
		<>
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
		</>
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
		<>
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
						<div className="from-primary/60 rounded-lg bg-gradient-to-br to-blue-400/60 p-6 text-center text-white">
							{cardIcon}
							<Large className="text-2xl font-bold">{cardTitle}</Large>
							<Small>{cardSubtitle}</Small>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};
