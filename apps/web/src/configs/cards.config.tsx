import { P } from "@gb/design-system/components/ui/typography";
import {
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Lightbulb,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export const heroProblemCards = [
  {
    icon: (
      <Clock className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-destructive/16 p-2 text-destructive" />
    ),
    title: "Time Sink",
    content: (
      <P>
        Educators lose over
        <span className="font-bold"> 200+ hours annually</span> to grading—time
        that could be spent on lesson planning and student mentorship.
      </P>
    ),
  },
  {
    icon: (
      <DollarSign className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-destructive/16 p-2 text-destructive" />
    ),
    title: "Budget Drain",
    content: (
      <P>
        This lost time costs your institution nearly
        <span className="font-bold"> 25% of an educator&apos;s salary</span>,
        directly impacting your bottom line.
      </P>
    ),
  },
  {
    icon: (
      <Target className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-destructive/16 p-2 text-destructive" />
    ),
    title: "Missed Opportunity",
    content: (
      <P>
        <span className="font-bold">82% of students </span>
        confirm that faster, personalized feedback would have dramatically
        improved their learning outcomes.
      </P>
    ),
  },
];

export const heroSolutionCards = [
  {
    icon: (
      <Zap className="mb-3 h-16 w-16 rounded-2xl bg-primary/16 p-2 text-primary" />
    ),
    title: "Work 95% Faster",
    content: (
      <P>
        Go from a 48-hour manual grading marathon to a{" "}
        <span className="font-bold">30-second automated sprint</span> per answer
        sheet.
      </P>
    ),
  },
  {
    icon: (
      <DollarSign className="mb-3 h-16 w-16 rounded-2xl bg-primary/16 p-2 text-primary" />
    ),
    title: "Cut Costs by 70%",
    content: (
      <P>
        Slash your evaluation expenses. Our process is{" "}
        <span className="font-bold">70% more affordable</span> than traditional
        methods, freeing up your budget.
      </P>
    ),
  },
  {
    icon: (
      <Shield className="mb-3 h-16 w-16 rounded-2xl bg-primary/16 p-2 text-primary" />
    ),
    title: "Ensure 100% Fairness",
    content: (
      <P>
        Deliver{" "}
        <span className="font-bold">unbiased, standardized evaluations</span>{" "}
        every time, free from human fatigue and subjectivity.
      </P>
    ),
  },
  {
    icon: (
      <Lightbulb className="mb-3 h-16 w-16 rounded-2xl bg-primary/16 p-2 text-primary" />
    ),
    title: "Deliver Powerful Feedback",
    content: (
      <P>
        Empower your educators to provide{" "}
        <span className="font-bold">customized, high-quality feedback</span>{" "}
        that helps every student achieve their full potential.
      </P>
    ),
  },
  {
    icon: (
      <Users className="mb-3 h-16 w-16 rounded-2xl bg-primary/16 p-2 text-primary" />
    ),
    title: "Provide Human-Like Annotation",
    content: (
      <P>
        Offer insightful, natural annotations directly on the answer sheet,
        guiding students with the clarity of a dedicated teacher.
      </P>
    ),
  },
];

export const aboutTeamInfo = [
  {
    name: "Yash Goyal",
    fallback: "YG",
    role: "Co-Founder",
    expertise: "Business & Finance",
    description:
      "Leveraging his experience from the YC W22 FinTech company Aspora and his education from NMIMS Mumbai, Yash architects our business strategy for sustainable growth.",
  },
  {
    name: "Rishi Harti",
    fallback: "RH",
    role: "Co-Founder",
    expertise: "Lead Technologist & Product",
    description:
      "A passionate builder with a portfolio of successful real-world applications, Rishi leads the technological development of the GradeBench platform.",
  },
  {
    name: "Sameer Khan S",
    fallback: "SKS",
    role: "Co-Founder",
    expertise: "Technology & Operations",
    description:
      "As an experienced Tech Lead and Hackathon Winner, Sameer masterfully blends deep technical expertise with strategic development to drive our operations.",
  },
];

export const featuresDetailInfo = [
  {
    icon: (
      <Zap className="mr-4 h-16 w-16 rounded-2xl bg-primary/20 p-2 text-primary" />
    ),
    title: "Grade in Seconds, Not Days",
    subtitle: "AI-Powered Automated Grading",
    description:
      "Upload handwritten or typed answer sheets and watch our AI grade them with incredible accuracy in as little as 30 seconds. Eliminate manual data entry and processing forever.",
    card: {
      icon: <Clock className="mx-auto mb-4 h-16 w-16" />,
      title: "30 seconds",
      subtitle: "per answer sheet",
    },
  },
  {
    icon: (
      <Target className="mr-4 h-16 w-16 rounded-2xl bg-primary/20 p-2 text-primary" />
    ),
    title: "Deliver Feedback That Drives Improvement",
    subtitle: "Dynamic & Personalized Feedback",
    description:
      "Our platform does more than just score—it teaches. Generate detailed feedback reports identifying errors, recognizing key concepts, and offering actionable advice aligned with your curriculum.",
    card: {
      icon: <TrendingUp className="mx-auto mb-4 h-16 w-16" />,
      title: "Dynamic Reports",
      subtitle: "Actionable insights for every student",
    },
  },
  {
    icon: (
      <Users className="mr-4 h-16 w-16 rounded-2xl bg-primary/20 p-2 text-primary" />
    ),
    title: "The Personal Touch, Scaled",
    subtitle: "Human-Like Digital Annotation",
    description:
      "Go beyond simple check marks. Our AI provides nuanced, handwritten-style feedback and annotations directly on the answer sheet, guiding students with the clarity and personal touch of an experienced educator.",
    card: {
      icon: <Award className="mx-auto mb-4 h-16 w-16" />,
      title: "Personal Annotations",
      subtitle: "Just like a dedicated teacher",
    },
  },
  {
    icon: (
      <BarChart3 className="mr-4 h-16 w-16 rounded-2xl bg-primary/20 p-2 text-primary" />
    ),
    title: "Turn Data into Strategy",
    subtitle: "In-Depth Performance Analytics",
    description:
      "Access a comprehensive dashboard to track student and cohort performance. Instantly identify knowledge gaps and learning trends to make data-driven decisions that improve teaching effectiveness.",
    card: {
      icon: <BarChart3 className="mx-auto mb-4 h-16 w-16" />,
      title: "Performance Analytics",
      subtitle: "Data-driven insights dashboard",
    },
  },
  {
    icon: (
      <Shield className="mr-4 h-16 w-16 rounded-2xl bg-primary/20 p-2 text-primary" />
    ),
    title: "Achieve Perfect Consistency",
    subtitle: "Bias-Free & Standardized Evaluation",
    description:
      "Guarantee every student a fair assessment. Our technology evaluates every answer against your chosen rubric with zero subjectivity, ensuring consistency across thousands of papers.",
    card: {
      icon: <CheckCircle className="mx-auto mb-4 h-16 w-16" />,
      title: "100%",
      subtitle: "Fair & Consistent",
    },
  },
];

export const solutionRoadmap = [
  {
    icon: (
      <Users className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary/12 p-2 text-primary" />
    ),
    title: "K-12 Schools",
    description:
      "Comprehensive grading solutions for primary and secondary education institutions.",
  },
  {
    icon: (
      <Target className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary/12 p-2 text-primary" />
    ),
    title: "Undergraduate & Postgraduate Colleges",
    description:
      "Advanced evaluation systems for higher education institutions and universities.",
  },
  {
    icon: (
      <Award className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary/12 p-2 text-primary" />
    ),
    title: "Professional Institutes",
    description:
      "Specialized solutions for CA, CS, LLB, and other professional certification programs.",
  },
];
