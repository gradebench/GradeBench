import { H2, Lead } from "@gb/ui/src/components/ui/typography";
import Link from "next/link";
import Image from "next/image";

export const SocialProof = () => {
  return (
    <>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-16 text-center">
            <H2 className="mb-6" data-testid="headline">
              Trusted by Leaders in Competitive Exam Coaching
            </H2>
            <Lead className="mx-auto mb-12 max-w-4xl" data-testid="text">
              Our technology is already delivering results. We are proud to be
              working with{" "}
              <span className="font-bold">Samkalp IAS in Delhi</span> and{" "}
              <span className="font-bold">Primus IAS in Bengaluru</span>,
              helping them streamline their evaluation process and provide
              superior feedback to their students.
            </Lead>
          </div>

          <div className="md:height-full flex flex-col items-stretch justify-center space-y-8 md:flex-row md:space-y-0 md:space-x-6">
            <Link
              className="grid flex-1 place-items-center"
              href="https://samkalpias.com/"
              target="_blank"
            >
              <Image
                src={"/assets/socialproof/samkalpias.png"}
                alt={"Samkalp IAS Coaching logo"}
                width={150}
                height={150}
              />
            </Link>
            <Link
              className="grid flex-1 place-items-center"
              href="https://primusias.com/"
              target="_blank"
            >
              <Image
                src={"/assets/socialproof/primus.png"}
                alt={"Primus IAS Coaching logo"}
                width={150}
                height={150}
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
