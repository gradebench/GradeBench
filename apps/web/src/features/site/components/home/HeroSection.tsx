import { Button } from "@gb/ui/src/components/ui/button";
import { Separator } from "@gb/ui/src/components/ui/separator";
import { H1, Large, P } from "@gb/ui/src/components/ui/typography";
import { HeroGlob } from "./Anim";

export const HomeHeroSection = () => {
  return (
    <>
      <section className="bg-background relative flex min-h-screen flex-col-reverse md:flex-row">
        <article className="flex flex-7 flex-col items-center justify-center gap-12 p-8 md:items-start">
          <H1 className="text-center md:text-left" data-testid="hero-headline">
            <span className="text-primary">Grade</span>
            <span> in Seconds. </span>
            <span className="text-primary">Teach</span>
            <span> for Hours. </span>
          </H1>
          <Large
            className="text-center md:text-left"
            data-testid="hero-sub-headline"
          >
            GradeBench automates 95% of your grading workload, delivering fair,
            instant, and personalized feedback so your educators can get back to
            teaching.
          </Large>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <P className="flex-1">See GradeBench in Action</P>
              <Separator orientation="vertical" />
              <Button className="group" disabled data-testid="hero-primary-cta">
                Coming Soon
              </Button>
            </div>
            <div className="flex gap-4">
              <P className="flex-1">Explore the Features</P>
              <Separator orientation="vertical" />
              <Button
                className="group"
                variant={"outline"}
                data-testid="hero-secondary-cta"
              >
                Features
              </Button>
            </div>
          </div>
        </article>
        <aside className="grid flex-5 place-items-center overflow-hidden p-8">
          <HeroGlob />
        </aside>
      </section>
    </>
  );
};
