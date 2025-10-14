import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@gb/ui/src/components/ui/card";
import { H2, P } from "@gb/ui/src/components/ui/typography";

export const SolutionTargeted = () => {
	return (
		<section className="px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<div className="mb-16 text-center">
					<H2 className="mb-8" data-testid="headline">
						The Winning Edge for UPSC-CSE Coaching
					</H2>
				</div>

				<div className="flex flex-col items-center gap-16">
					<div>
						<Card className="border-l-primary/32 h-full border-l-4 shadow-lg">
							<CardHeader>
								<CardTitle
									className="text-2xl font-bold"
									data-testid="challenge"
								>
									The Challenge
								</CardTitle>
							</CardHeader>
							<CardContent>
								<P className="leading-relaxed">
									Top-tier UPSC institutes must evaluate thousands of subjective
									answer sheets with speed and precision—a logistical bottleneck
									that limits growth and delays student progress.
								</P>
							</CardContent>
						</Card>
					</div>

					<div>
						<Card
							className="border-l-primary/32 border-l-4 shadow-lg"
							data-testid="solution"
						>
							<CardHeader>
								<CardTitle className="text-2xl font-bold">
									The GradeBench Solution
								</CardTitle>
							</CardHeader>
							<CardContent>
								<P className="mb-4 leading-relaxed">
									We offer a proven platform to eliminate this bottleneck.{" "}
									<span className="font-bold">
										As demonstrated with Samkalp IAS and Primus IAS
									</span>
									, GradeBench allows you to drastically reduce turnaround
									times, deliver higher-quality feedback, and scale your
									operations without increasing faculty costs.
								</P>
								<div className="mt-6 flex items-center space-x-4">
									<div className="bg-accent text-accent-foreground rounded-lg border px-4 py-2 shadow">
										<span className="text-sm font-semibold">Samkalp IAS</span>
									</div>
									<div className="bg-accent text-accent-foreground rounded-lg border px-4 py-2 shadow">
										<span className="text-sm font-semibold">Primus IAS</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
};
