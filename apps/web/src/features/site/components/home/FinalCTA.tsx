import { Button } from "@gb/ui/src/components/ui/button";
import { H2, P } from "@gb/ui/src/components/ui/typography";

export const FinalCTA = () => {
  return (
    <>
      <section className="from-primary bg-gradient-to-r to-blue-500/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <H2 className="mb-6">Ready to Revolutionize Your Grading?</H2>
          <P className="mb-8">
            Reclaim countless hours and empower your educators with the market&apos;s
            leading evaluation platform.
          </P>
          <Button
            size="lg"
            className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 px-8 py-3"
          >
            Request Your Free Demo
          </Button>
        </div>
      </section>
    </>
  );
};
