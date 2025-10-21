import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@gb/ui/src/components/ui/card";
import { H2, Lead } from "@gb/ui/src/components/ui/typography";
import type { ReactNode } from "react";
import { heroProblemCards } from "@/features/site/configs/cards";

export const ProblemSection = () => {
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

export const HomeProblemCard = ({
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
