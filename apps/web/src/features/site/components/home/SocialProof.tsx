import { H2, Large, Lead } from "@gb/ui/src/components/ui/typography";

export const SocialProof = () => {
  return (
    <>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <H2 className="mb-6">
            Trusted by Leaders in Competitive Exam Coaching
          </H2>
          <Lead className="mx-auto mb-12 max-w-4xl">
            Our technology is already delivering results. We are proud to be
            working with <span className="font-bold">Samkalp IAS in Delhi</span>{" "}
            and <span className="font-bold">Primus IAS in Bengaluru</span>,
            helping them streamline their evaluation process and provide
            superior feedback to their students.
          </Lead>

          <div className="flex items-center justify-center space-x-12">
            <div className="bg-primary/48 rounded-lg px-8 py-4 shadow-md">
              <Large>Samkalp IAS</Large>
            </div>
            <div className="bg-primary/48 rounded-lg px-8 py-4 shadow-md">
              <Large>Primus IAS</Large>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
