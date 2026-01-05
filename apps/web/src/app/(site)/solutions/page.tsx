import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/design-system/components/ui/card";
import { H1, H2, Lead, P } from "@gb/design-system/components/ui/typography";
import { Globe } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { solutionRoadmap } from "@/configs/cards.config";
import { env } from "@/configs/env.config";

const SolutionHero = () => {
  return (
    <section className="grid min-h-screen place-items-center bg-linear-to-br from-primary/20 via-background to-primary/20 px-4 py-20 sm:px-6 lg:px-8">
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
  );
};

const SolutionTargeted = () => {
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
            <Card className="h-full border-l-4 border-l-primary/32 shadow-lg">
              <CardHeader>
                <CardTitle
                  className="font-bold text-2xl"
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
              className="border-l-4 border-l-primary/32 shadow-lg"
              data-testid="solution"
            >
              <CardHeader>
                <CardTitle className="font-bold text-2xl">
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
                  <div className="rounded-lg border bg-accent px-4 py-2 text-accent-foreground shadow">
                    <span className="font-semibold text-sm">Samkalp IAS</span>
                  </div>
                  <div className="rounded-lg border bg-accent px-4 py-2 text-accent-foreground shadow">
                    <span className="font-semibold text-sm">Primus IAS</span>
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

const SolutionRoadmap = () => {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <H2 className="mb-6" data-testid="headline">
            Expanding to Serve the Entire Education Ecosystem
          </H2>
          <Lead className="mx-auto max-w-4xl" data-testid="text">
            We are leveraging our success in the UPSC-CSE segment to build a
            playbook for institutions everywhere.
          </Lead>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutionRoadmap.map((card) => (
            <RoadmapCard
              description={card.description}
              icon={card.icon}
              key={card.title.toLowerCase().replace(/\s+/g, "-")}
              title={card.title}
            />
          ))}
        </div>

        <Card className="bg-linear-to-r from-secondary to-secondary/64 shadow-lg">
          <CardHeader className="text-center">
            <Globe className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary/12 p-2 text-primary" />
            <CardTitle className="font-bold text-2xl">
              Growing with India
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <P className="leading-relaxed">
              We are developing robust multilingual support for Hindi, Marathi,
              Kannada, and many more languages to serve institutions across the
              nation.
            </P>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${env.server.BASE_DOMAIN}`),
  title: "AI Grading for UPSC Coaching Institutes & Schools | GradeBench",
  description:
    "GradeBench offers a tailored solution for UPSC institutes to automate answer sheet evaluation, reduce turnaround time, and scale operations. Discover our playbook.",
  alternates: {
    canonical: "/solutions",
  },
};

const RoadmapCard = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card
      className="shadow-lg transition-shadow duration-300 hover:shadow-xl"
      data-testid="card"
    >
      <CardHeader className="text-center">
        {icon}
        <CardTitle className="font-bold text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <P>{description}</P>
      </CardContent>
    </Card>
  );
};

const SolutionsPage = () => {
  return (
    <>
      <SolutionHero />
      <SolutionTargeted />
      <SolutionRoadmap />
    </>
  );
};

export default SolutionsPage;
