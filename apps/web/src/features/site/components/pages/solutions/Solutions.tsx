import { SolutionHero } from "./Hero";
import { SolutionRoadmap } from "./Roadmap";
import { SolutionTargeted } from "./TargetedSolution";

export const Solutions = () => {
	return (
		<>
			<SolutionHero />
			<SolutionTargeted />
			<SolutionRoadmap />
		</>
	);
};
