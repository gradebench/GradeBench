import { Button } from "@gb/design-system/components/ui/button";
import { H2, P } from "@gb/design-system/components/ui/typography";

export const FinalCTA = () => {
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
