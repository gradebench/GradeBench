import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@gb/ui/src/components/ui/card";
import { H2, Muted, P } from "@gb/ui/src/components/ui/typography";
import { aboutTeamInfo } from "@/features/site/configs/cards";

export const AboutTeam = () => {
	return (
		<section className="px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<H2 className="mb-16 text-center" data-testid="headline">
					The Team Building the Future of Evaluation
				</H2>

				<div className="grid gap-8 md:grid-cols-3">
					{aboutTeamInfo.map((card, index) => (
						<TeamCard
							key={index}
							name={card.name}
							fallback={card.fallback}
							role={card.role}
							expertise={card.expertise}
							description={card.description}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

const TeamCard = ({
	name,
	fallback,
	role,
	expertise,
	description,
}: {
	name: string;
	fallback: string;
	role: string;
	expertise: string;
	description: string;
}) => {
	return (
		<Card
			className="shadow-lg transition-shadow duration-300 hover:shadow-xl"
			data-testid="card"
		>
			<CardHeader className="pb-6 text-center">
				<div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-4xl bg-gradient-to-br from-primary/64 to-primary/80">
					<span className="font-bold text-2xl text-white">{fallback}</span>
				</div>
				<CardTitle className="font-bold text-xl">{name}</CardTitle>

				<div className="flex flex-wrap items-baseline justify-center gap-4">
					<Muted className="font-bold">{role}</Muted>
					<P className="rounded-4xl bg-primary px-2 text-background leading-relaxed dark:text-foreground">
						{expertise}
					</P>
				</div>
			</CardHeader>
			<CardContent className="text-center">
				<P className="leading-relaxed">{description}</P>
			</CardContent>
		</Card>
	);
};
