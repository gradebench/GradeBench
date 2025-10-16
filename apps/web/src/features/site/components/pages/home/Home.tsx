import { BackedBySection } from "./BackedBySection";
import { FinalCTA } from "./FinalCTA";
import { HomeHeroSection } from "./HeroSection";
import { ProblemSection } from "./ProblemSection";
import { SocialProof } from "./SocialProof";
import { SolutionSection } from "./SolutionSection";

export const Home = () => {
	return (
		<>
			<HomeHeroSection />
			<BackedBySection />
			<ProblemSection />
			<SolutionSection />
			<SocialProof />
			<FinalCTA />
		</>
	);
};
