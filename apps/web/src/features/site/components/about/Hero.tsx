import { H1, Lead } from "@gb/ui/src/components/ui/typography";

export const AboutHero = () => {
  return (
    <>
      <section className="from-primary/20 via-background to-primary/20 grid min-h-screen place-items-center bg-gradient-to-br px-4 py-20 sm:px-6 lg:px-8">
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
    </>
  );
};
