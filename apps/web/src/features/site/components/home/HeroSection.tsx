import { Button } from "@gb/ui/src/components/ui/button";
import { H1, Lead } from "@gb/ui/src/components/ui/typography";
import Link from "next/link";

export const HomeHeroSection = () => {
	return (
		<>
			<section className="from-primary/20 via-background to-primary/20 grid min-h-screen place-items-center bg-gradient-to-br px-4 py-20 sm:px-6 lg:px-8">
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
						<Button
							variant="outline"
							size="lg"
							data-testid="secondary-cta"
							asChild
						>
							<Link href={"/site/features"}>Explore the Features</Link>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
};
