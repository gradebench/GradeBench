import { H1, Lead } from "@gb/ui/src/components/ui/typography";

export const SolutionHero = () => {
	return (
		<>
			<section className="from-primary/20 to-primary/20 via-background grid min-h-screen place-items-center bg-gradient-to-br px-4 py-20 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					<H1 className="t mb-8" data-testid="headline">
						A <span className="text-primary">Scalable </span>
						Solution,
						<span className="text-primary">Tailor-Made </span>
						for You
					</H1>
					<Lead className="leading-relaxed" data-testid="text">
						From high-stakes exam preparation to university-wide assessments,
						GradeBench is engineered to meet the demands of any educational
						institution.
					</Lead>
				</div>
			</section>
		</>
	);
};
