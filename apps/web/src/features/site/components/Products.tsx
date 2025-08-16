import { GradeBench } from "@/components/anim/GradeBench1";
import { H1, H2, Lead, P } from "@gb/ui/src/components/ui/typography";

export const ProductOverView = () => {
  return (
    <section>
      <H1>Product OverView</H1>
      <Lead>Uncover Deeper Insights with GradeBench.</Lead>
      <P>
        Our product is a powerful tool designed to provide detailed feedback on
        student answer sheets, identifying strengths, weaknesses, and areas for
        improvement.
      </P>
    </section>
  );
};

export const ProductsHowItWorks = () => {
  return (
    <section>
      <H2>How it Works</H2>
      <GradeBench className="w-sm" />
      <P>
        Intuitive Dashboard: Get a clear overview of your progress with metrics
        like &apos;Tests Completed&apos; (e.g., 12+) and &apos;Available Credits&apos; (e.g., 500).
      </P>
      <GradeBench className="w-sm" />
      <P>
        Track Your Tests: View a list of your tests with their status (e.g.,
        &apos;Not Started&apos;) and timestamps.
      </P>
      <GradeBench className="w-sm" />
      <P>
        Comprehensive Analysis: Our system provides a detailed breakdown of
        performance for each question, identifying key concepts and pinpointing
        errors categorized by severity (Minor, Moderate, Critical).
      </P>
    </section>
  );
};

export const ProductsPricing = () => {
  return (
    <section>
      <H2>Pricing</H2>
      <Lead>Flexible Plans for Every Need.</Lead>
      <ul>
        <li>Pay-as-you-use: &apos;₹25 per answer sheet graded.&apos;</li>
        <li>Unlimited Usage Plan: &apos;A flat rate of ₹3,000 per student.&apos;</li>
        <li>
          Annual Analytics Dashboard: &apos;For ₹2,00,000, get AI-powered insights on
          individual student performance for every 100 students.&apos;
        </li>
      </ul>
    </section>
  );
};

export const ProductsRoadmap = () => {
  return (
    <section>
      <H2>Roadmap</H2>
      <Lead>Our Vision for the Future.</Lead>
      <ul>
        <li>
          Multilingual Support: &apos;We are developing our tool to comprehend
          multiple languages, starting with regional Indian languages like
          Hindi, Marathi, Gujarati, and Tamil, as LLMs advance.&apos;
        </li>
        <li>
          Product Enhancements: &apos;We are continuously investing in R&D to improve
          our feedback mechanisms and product capabilities.&apos;
        </li>
        <li>
          Team Expansion: &apos;We are recruiting top talent in AI, education, and
          business development to strengthen our team.&apos;
        </li>
      </ul>
    </section>
  );
};
