import { H2, Lead } from "@gb/ui/src/components/ui/typography";

export const AboutVision = () => {
	return (
		<section className="px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl text-center">
				<H2 className="mb-8" data-testid="headline">
					A World Where Every Evaluation Fuels Growth
				</H2>
				<Lead className="leading-relaxed" data-testid="text">
					We envision an educational landscape where feedback is instant,
					learning is continuous, and educators are free to inspire. By
					automating the mechanics of grading, we empower institutions to
					deliver the timely, unbiased, and personalized guidance that allows
					every student to thrive.
				</Lead>
			</div>
		</section>
	);
};
