import { GradeBench } from "@/components/anim/GradeBench1";
import { Button } from "@gb/ui/src/components/ui/button";
import {
  BlockQuote,
  H1,
  H2,
  Lead,
  P,
} from "@gb/ui/src/components/ui/typography";
import { ArrowRight } from "lucide-react";

export const Home = () => {
  return (
    <>
      <HomeHero />
      <HomeChallenge />
      <HomeSolution />
    </>
  );
};

const HomeHero = () => {
  return (
    <>
      <section className="bg-background relative flex min-h-screen flex-col-reverse md:flex-row">
        <article className="flex flex-7 flex-col items-center justify-center gap-12 p-8 md:items-start">
          <H1 className="text-center md:text-left">
            Empowering Teachers, Elevating Education
          </H1>
          <Lead className="text-center md:text-left">
            We are transforming the evaluation space to reduce the cognitive
            burden on educators and enable them to focus on what matters most:
            teaching. By providing quick, fair, and meaningful feedback, we help
            every student grow.
          </Lead>
          <Button className="group">
            Learn More
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </article>
        <aside className="grid flex-5 place-items-center overflow-hidden p-8">
          <GradeBench className="w-full max-w-64" />
        </aside>
      </section>
    </>
  );
};

const HomeChallenge = () => {
  return (
    <>
      <section className="min-h-screen">
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

const HomeSolution = () => {
  return (
    <>
      <section className="min-h-screen">
        <H2>Our Solution</H2>
        <Lead>GradeBench: Redefining Evaluation</Lead>
        <P>
          GradeBench offers a revolutionary approach to evaluation that&apos;s
          fast, cost-effective, and provides personalized, meaningful feedback.
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
