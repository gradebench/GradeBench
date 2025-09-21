import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@gb/ui/src/components/ui/card";
import { H2, Lead } from "@gb/ui/src/components/ui/typography";
import { heroSolutionCards } from "../../configs/cards";

export const SolutionSection = () => {
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
								<CardTitle className="text-xl font-bold">
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
