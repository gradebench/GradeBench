import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/ui/src/components/ui/card";
import { H2, Lead, P } from "@gb/ui/src/components/ui/typography";
import { Globe } from "lucide-react";
import { ReactNode } from "react";
import { solutionRoadmap } from "../../configs/cards";

export const SolutionRoadmap = () => {
  return (
    <>
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
            {solutionRoadmap.map((card, index) => (
              <RoadmapCard
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>

          <Card className="from-secondary to-secondary/64 bg-gradient-to-r shadow-lg">
            <CardHeader className="text-center">
              <Globe className="mx-auto mb-4 h-16 w-16 text-primary bg-primary/12 p-2 rounded-2xl" />
              <CardTitle className="text-2xl font-bold">
                Growing with India
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <P className="leading-relaxed">
                We are developing robust multilingual support for Hindi,
                Marathi, Kannada, and many more languages to serve institutions
                across the nation.
              </P>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
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
    <>
      <Card
        className="shadow-lg transition-shadow duration-300 hover:shadow-xl"
        data-testid="card"
      >
        <CardHeader className="text-center">
          {icon}
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <P>{description}</P>
        </CardContent>
      </Card>
    </>
  );
};
