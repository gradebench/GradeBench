import { FinalCTA } from "./FinalCTA";
import { HomeHeroSection } from "./HeroSection";
import { ProblemSection } from "./ProblemSection";
import { SocialProof } from "./SocialProof";
import { SolutionSection } from "./SolutionSection";
import { SupportedBySection } from "./SupportedBySection";

export const Home = () => {
	return (
		<>
			<HomeHeroSection />
			<SupportedBySection />
			<ProblemSection />
			<SolutionSection />
			<SocialProof />
			<FinalCTA />
		</>
	);
};
