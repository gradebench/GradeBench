import { H1, Lead } from "@gb/ui/src/components/ui/typography";

export const ProductsHero = () => {
  return (
    <>
      <section className="from-primary/20 via-background to-primary/20 grid min-h-screen place-items-center bg-gradient-to-br px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <H1 className="mb-8" data-testid="headline">
            The Future of <span className="text-primary">Teaching </span>
            and <span className="text-primary">Learning </span> in One Platform
          </H1>
          <Lead className="leading-relaxed" data-testid="text">
            Empower educators with AI-driven grading, smarter assessments,
            actionable insights, and seamless class management—all with
            GradeBench.
          </Lead>
        </div>
      </section>
    </>
  );
};
