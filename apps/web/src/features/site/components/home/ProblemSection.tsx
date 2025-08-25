import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/ui/src/components/ui/card";
import { H2, Lead } from "@gb/ui/src/components/ui/typography";
import { heroProblemCards } from "../../configs/cards";

export const ProblemSection = () => {
  return (
    <>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <H2 className="mb-6" data-testid="headline">
              Don&apos;t Let Grading Overwhelm Your Institution
            </H2>
            <Lead className="mx-auto max-w-4xl leading-relaxed">
              Manual grading is more than just a task; it&apos;s a significant
              operational drain. It consumes thousands of hours, inflates costs,
              and delays the crucial feedback students need to succeed.
            </Lead>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {heroProblemCards.map((card, index) => (
              <Card
                className="shadow-lg transition-shadow duration-300 hover:shadow-xl"
                key={index}
              >
                <CardHeader className="pb-4 text-center">
                  {card.icon}
                  <CardTitle className="text-xl font-bold">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {card.content}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
