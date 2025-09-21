import { H1, Lead } from "@gb/ui/src/components/ui/typography";

export const FeaturesHero = () => {
	return (
		<section className="from-primary/20 via-background to-primary/20 grid min-h-screen place-items-center bg-gradient-to-br px-4 py-20 sm:px-6 lg:px-8">
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
