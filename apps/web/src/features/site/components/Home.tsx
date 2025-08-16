import { Button } from "@gb/ui/src/components/ui/button";
import {
  BlockQuote,
  H1,
  H2,
  Lead,
  P,
} from "@gb/ui/src/components/ui/typography";

export const HomeHero = () => {
  return (
    <>
      <section className="grid min-h-screen place-items-center">
        <article className="flex flex-col items-center gap-8 p-8">
          <H1 className="text-center">We Grade, You Teach!</H1>
          <Lead className="text-center">
            Effortless Evaluation for Educators
          </Lead>
          <Button>Get Started </Button>
        </article>
      </section>
    </>
  );
};

export const HomeChallenge = () => {
  return (
    <>
      <section>
        <H2>The Challenge</H2>
        <Lead>The Burden of Manual Grading</Lead>
        <P>
          Are you tired of spending countless hours on grading instead of
          teaching? Manual grading is a time-consuming and inefficient process
          that puts a significant burden on educators and institutions.
        </P>
        <ul>
          <li>
            Teachers spend over 213 hours annually on grading, which amounts to
            27% of their salary.
          </li>
          <li>
            82% of students believe personalized feedback would enhance their
            learning, a crucial element that&apos;s often sacrificed due to time
            constraints.
          </li>
          <li>
            As enrollment grows, institutions struggle to scale their evaluation
            processes, leading to increased faculty costs and logistical
            inefficiencies.
          </li>
        </ul>
      </section>
    </>
  );
};

export const HomeSolution = () => {
  return (
    <>
      <section>
        <H2>Our Solution</H2>
        <Lead>GradeBench: Redefining Evaluation</Lead>
        <P>
          GradeBench offers a revolutionary approach to evaluation that&apos;s fast,
          cost-effective, and provides personalized, meaningful feedback.
        </P>
        <ul>
          <li>
            <span>
              <BlockQuote>Lightning-Fast: </BlockQuote>
              <P>
                Grade an entire answer sheet in just 30 seconds —a dramatic
                improvement from the 24-48 hours required for manual grading.
              </P>
            </span>
          </li>
        </ul>
      </section>
    </>
  );
};
