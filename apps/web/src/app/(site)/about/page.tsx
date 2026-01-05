import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/design-system/components/ui/card";
import {
  H1,
  H2,
  Lead,
  Muted,
  P,
} from "@gb/design-system/components/ui/typography";
import type { Metadata } from "next";
import { aboutTeamInfo } from "@/configs/cards.config";
import { env } from "@/configs/env.config";

const AboutHero = () => {
  return (
    <section className="grid min-h-screen place-items-center bg-linear-to-br from-primary/20 via-background to-primary/20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <H1 className="mb-8" data-testid="headline">
          We&apos;re on a <span className="text-primary">Mission</span> to{" "}
          <span className="text-primary">Empower Educators</span>
        </H1>
        <Lead className="leading-relaxed" data-testid="text">
          GradeBench was founded on a single, powerful idea: technology should
          reduce the cognitive load on educators, not add to it. We are
          dedicated to making academic evaluations quick, fair, and profoundly
          meaningful.
        </Lead>
      </div>
    </section>
  );
};

const AboutVision = () => {
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

const AboutTeam = () => {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <H2 className="mb-16 text-center" data-testid="headline">
          The Team Building the Future of Evaluation
        </H2>

        <div className="grid gap-8 md:grid-cols-3">
          {aboutTeamInfo.map((card) => (
            <TeamCard
              description={card.description}
              expertise={card.expertise}
              fallback={card.fallback}
              key={card.name.toLowerCase().replace(/\s+/g, "-")}
              name={card.name}
              role={card.role}
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
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-4xl bg-linear-to-br from-primary/64 to-primary/80">
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

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${env.server.BASE_DOMAIN}`),
  title: "Our Mission to Empower Educators | About GradeBench",
  description:
    "Learn about the GradeBench mission to reduce educator workload and make academic evaluations quick, fair, and meaningful. Meet our dedicated founding team.",
  alternates: {
    canonical: "/about",
  },
};

const AboutPage = () => {
  return (
    <>
      <AboutHero />
      <AboutVision />
      <AboutTeam />
    </>
  );
};

export default AboutPage;
