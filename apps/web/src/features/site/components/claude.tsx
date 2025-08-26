import { useState } from "react";

import { Button } from "@gb/ui/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/ui/src/components/ui/card";
import {
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  Lightbulb,
  Mail,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

const GradeBenchWebsite = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const HomePage = () => (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            Grade in Seconds. Teach for Hours.
          </h1>
          <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-slate-600 md:text-2xl">
            GradeBench automates 95% of your grading workload, delivering fair,
            instant, and personalized feedback so your educators can get back to
            teaching.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-indigo-600 px-8 py-3 text-lg text-white hover:bg-indigo-700"
            >
              See GradeBench in Action
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-indigo-600 px-8 py-3 text-lg text-indigo-600 hover:bg-indigo-50"
            >
              Explore the Features
            </Button>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl lg:text-5xl">
              Don't Let Grading Overwhelm Your Institution
            </h2>
            <p className="mx-auto max-w-4xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Manual grading is more than just a task; it's a significant
              operational drain. It consumes thousands of hours, inflates costs,
              and delays the crucial feedback students need to succeed.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader className="pb-4 text-center">
                <Clock className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <CardTitle className="text-xl font-bold text-slate-900">
                  Time Sink
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  Educators lose over{" "}
                  <span className="font-bold text-slate-900">
                    200+ hours annually
                  </span>{" "}
                  to grading—time that could be spent on lesson planning and
                  student mentorship.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader className="pb-4 text-center">
                <DollarSign className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <CardTitle className="text-xl font-bold text-slate-900">
                  Budget Drain
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  This lost time costs your institution nearly{" "}
                  <span className="font-bold text-slate-900">
                    25% of an educator's salary
                  </span>
                  , directly impacting your bottom line.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader className="pb-4 text-center">
                <Target className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <CardTitle className="text-xl font-bold text-slate-900">
                  Missed Opportunity
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  <span className="font-bold text-slate-900">
                    82% of students
                  </span>{" "}
                  confirm that faster, personalized feedback would have
                  dramatically improved their learning outcomes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl lg:text-5xl">
              The Future of Evaluation is Here
            </h2>
            <p className="mx-auto max-w-4xl text-lg leading-relaxed text-slate-600 md:text-xl">
              GradeBench is the all-in-one solution designed to make your
              evaluation process lightning-fast, remarkably affordable, and
              perfectly fair.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="pb-4">
                <Zap className="mb-3 h-10 w-10 text-teal-500" />
                <CardTitle className="text-xl font-bold text-slate-900">
                  Work 95% Faster
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Go from a 48-hour manual grading marathon to a{" "}
                  <span className="font-bold text-slate-900">
                    30-second automated sprint
                  </span>{" "}
                  per answer sheet.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="pb-4">
                <DollarSign className="mb-3 h-10 w-10 text-green-500" />
                <CardTitle className="text-xl font-bold text-slate-900">
                  Cut Costs by 70%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Slash your evaluation expenses. Our process is{" "}
                  <span className="font-bold text-slate-900">
                    70% more affordable
                  </span>{" "}
                  than traditional methods, freeing up your budget.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="pb-4">
                <Shield className="mb-3 h-10 w-10 text-blue-500" />
                <CardTitle className="text-xl font-bold text-slate-900">
                  Ensure 100% Fairness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Deliver{" "}
                  <span className="font-bold text-slate-900">
                    unbiased, standardized evaluations
                  </span>{" "}
                  every time, free from human fatigue and subjectivity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="pb-4">
                <Lightbulb className="mb-3 h-10 w-10 text-yellow-500" />
                <CardTitle className="text-xl font-bold text-slate-900">
                  Deliver Powerful Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Empower your educators to provide{" "}
                  <span className="font-bold text-slate-900">
                    customized, high-quality feedback
                  </span>{" "}
                  that helps every student achieve their full potential.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl lg:col-span-2">
              <CardHeader className="pb-4">
                <Users className="mb-3 h-10 w-10 text-purple-500" />
                <CardTitle className="text-xl font-bold text-slate-900">
                  Provide Human-Like Annotation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Offer insightful, natural annotations directly on the answer
                  sheet, guiding students with the clarity of a dedicated
                  teacher.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Traction Section */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
            Trusted by Leaders in Competitive Exam Coaching
          </h2>
          <p className="mx-auto mb-12 max-w-4xl text-lg text-slate-600 md:text-xl">
            Our technology is already delivering results. We are proud to be
            working with{" "}
            <span className="font-bold text-slate-900">
              Samkalp IAS in Delhi
            </span>{" "}
            and{" "}
            <span className="font-bold text-slate-900">
              Primus IAS in Bengaluru
            </span>
            , helping them streamline their evaluation process and provide
            superior feedback to their students.
          </p>

          <div className="flex items-center justify-center space-x-12 opacity-70">
            <div className="rounded-lg bg-white px-8 py-4 shadow-md">
              <span className="text-2xl font-bold text-slate-700">
                Samkalp IAS
              </span>
            </div>
            <div className="rounded-lg bg-white px-8 py-4 shadow-md">
              <span className="text-2xl font-bold text-slate-700">
                Primus IAS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Ready to Revolutionize Your Grading?
          </h2>
          <p className="mb-8 text-lg text-indigo-100 md:text-xl">
            Reclaim countless hours and empower your educators with the market's
            leading evaluation platform.
          </p>
          <Button
            size="lg"
            className="bg-white px-8 py-3 text-lg font-semibold text-indigo-600 hover:bg-gray-100"
          >
            Request Your Free Demo
          </Button>
        </div>
      </section>
    </main>
  );

  const AboutPage = () => (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            We're on a Mission to Empower Educators
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 md:text-xl">
            GradeBench was founded on a single, powerful idea: technology should
            reduce the cognitive load on educators, not add to it. We are
            dedicated to making academic evaluations quick, fair, and profoundly
            meaningful.
          </p>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl lg:text-5xl">
            A World Where Every Evaluation Fuels Growth
          </h2>
          <p className="text-lg leading-relaxed text-slate-600 md:text-xl">
            We envision an educational landscape where feedback is instant,
            learning is continuous, and educators are free to inspire. By
            automating the mechanics of grading, we empower institutions to
            deliver the timely, unbiased, and personalized guidance that allows
            every student to thrive.
          </p>
        </div>
      </section>

      {/* Meet the Founders Section */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 text-center text-3xl font-bold text-slate-900 md:text-4xl">
            The Team Building the Future of Evaluation
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader className="pb-6 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500">
                  <span className="text-2xl font-bold text-white">YG</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Yash Goyal
                </CardTitle>
                <p className="font-semibold text-indigo-600">
                  Co-Founder (Business & Finance)
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="leading-relaxed text-slate-600">
                  Leveraging his experience from the YC W22 fintech company
                  Aspora and his education from NMIMS Mumbai, Yash architects
                  our business strategy for sustainable growth.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader className="pb-6 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-green-500">
                  <span className="text-2xl font-bold text-white">RH</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Rishi Harti
                </CardTitle>
                <p className="font-semibold text-teal-600">
                  Co-Founder (Lead Technologist & Product)
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="leading-relaxed text-slate-600">
                  A passionate builder with a portfolio of successful real-world
                  applications, Rishi leads the technological development of the
                  GradeBench platform.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader className="pb-6 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <span className="text-2xl font-bold text-white">SK</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Sameer Khan S
                </CardTitle>
                <p className="font-semibold text-purple-600">
                  Co-Founder (Technology & Operations)
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="leading-relaxed text-slate-600">
                  As an experienced Tech Lead and Hackathon Winner, Sameer
                  masterfully blends deep technical expertise with strategic
                  development to drive our operations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );

  const FeaturesPage = () => (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            The Most Powerful Toolkit for Effortless Evaluation
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 md:text-xl">
            Explore the intelligent features that make GradeBench the smartest
            way to grade.
          </p>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-24">
            {/* Feature 1 */}
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-6 flex items-center">
                  <Zap className="mr-4 h-12 w-12 text-indigo-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">
                      Grade in Seconds, Not Days
                    </h3>
                    <p className="text-lg font-semibold text-indigo-600">
                      AI-Powered Automated Grading
                    </p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-slate-600">
                  Upload handwritten or typed answer sheets and watch our AI
                  grade them with incredible accuracy in as little as 30
                  seconds. Eliminate manual data entry and processing forever.
                </p>
              </div>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 p-6 text-center text-white">
                    <Clock className="mx-auto mb-4 h-16 w-16" />
                    <p className="text-2xl font-bold">30 seconds</p>
                    <p className="text-indigo-100">per answer sheet</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature 2 */}
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Card className="border-0 shadow-xl lg:order-1">
                <CardContent className="p-8">
                  <div className="rounded-lg bg-gradient-to-br from-teal-500 to-green-500 p-6 text-center text-white">
                    <TrendingUp className="mx-auto mb-4 h-16 w-16" />
                    <p className="text-lg font-semibold">Dynamic Reports</p>
                    <p className="text-teal-100">
                      Actionable insights for every student
                    </p>
                  </div>
                </CardContent>
              </Card>
              <div className="lg:order-2">
                <div className="mb-6 flex items-center">
                  <Target className="mr-4 h-12 w-12 text-teal-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">
                      Deliver Feedback That Drives Improvement
                    </h3>
                    <p className="text-lg font-semibold text-teal-600">
                      Dynamic & Personalized Feedback
                    </p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-slate-600">
                  Our platform does more than just score—it teaches. Generate
                  detailed feedback reports identifying errors, recognizing key
                  concepts, and offering actionable advice aligned with your
                  curriculum.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-6 flex items-center">
                  <Users className="mr-4 h-12 w-12 text-purple-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">
                      The Personal Touch, Scaled
                    </h3>
                    <p className="text-lg font-semibold text-purple-600">
                      Human-Like Digital Annotation
                    </p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-slate-600">
                  Go beyond simple checkmarks. Our AI provides nuanced,
                  handwritten-style feedback and annotations directly on the
                  answer sheet, guiding students with the clarity and personal
                  touch of an experienced educator.
                </p>
              </div>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-center text-white">
                    <Award className="mx-auto mb-4 h-16 w-16" />
                    <p className="text-lg font-semibold">
                      Personal Annotations
                    </p>
                    <p className="text-purple-100">
                      Just like a dedicated teacher
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature 4 */}
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Card className="border-0 shadow-xl lg:order-1">
                <CardContent className="p-8">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 p-6 text-center text-white">
                    <BarChart3 className="mx-auto mb-4 h-16 w-16" />
                    <p className="text-lg font-semibold">
                      Performance Analytics
                    </p>
                    <p className="text-blue-100">
                      Data-driven insights dashboard
                    </p>
                  </div>
                </CardContent>
              </Card>
              <div className="lg:order-2">
                <div className="mb-6 flex items-center">
                  <BarChart3 className="mr-4 h-12 w-12 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">
                      Turn Data into Strategy
                    </h3>
                    <p className="text-lg font-semibold text-blue-600">
                      In-Depth Performance Analytics
                    </p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-slate-600">
                  Access a comprehensive dashboard to track student and cohort
                  performance. Instantly identify knowledge gaps and learning
                  trends to make data-driven decisions that improve teaching
                  effectiveness.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-6 flex items-center">
                  <Shield className="mr-4 h-12 w-12 text-green-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">
                      Achieve Perfect Consistency
                    </h3>
                    <p className="text-lg font-semibold text-green-600">
                      Bias-Free & Standardized Evaluation
                    </p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-slate-600">
                  Guarantee every student a fair assessment. Our technology
                  evaluates every answer against your chosen rubric with zero
                  subjectivity, ensuring consistency across thousands of papers.
                </p>
              </div>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="rounded-lg bg-gradient-to-br from-green-500 to-teal-500 p-6 text-center text-white">
                    <CheckCircle className="mx-auto mb-4 h-16 w-16" />
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-green-100">Fair & Consistent</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );

  const SolutionsPage = () => (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            A Scalable Solution, Tailor-Made for You
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 md:text-xl">
            From high-stakes exam preparation to university-wide assessments,
            GradeBench is engineered to meet the demands of any educational
            institution.
          </p>
        </div>
      </section>

      {/* Targeted Solution: For UPSC Coaching Institutes */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">
              The Winning Edge for UPSC-CSE Coaching
            </h2>
          </div>

          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Card className="border-l-4 border-l-red-500 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    The Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-slate-600">
                    Top-tier UPSC institutes must evaluate thousands of
                    subjective answer sheets with speed and precision—a
                    logistical bottleneck that limits growth and delays student
                    progress.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-l-4 border-l-green-500 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    The GradeBench Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-lg leading-relaxed text-slate-600">
                    We offer a proven platform to eliminate this bottleneck.{" "}
                    <span className="font-bold text-slate-900">
                      As demonstrated with Samkalp IAS and Primus IAS
                    </span>
                    , GradeBench allows you to drastically reduce turnaround
                    times, deliver higher-quality feedback, and scale your
                    operations without increasing faculty costs.
                  </p>
                  <div className="mt-6 flex items-center space-x-4">
                    <div className="rounded-lg border bg-white px-4 py-2 shadow">
                      <span className="text-sm font-semibold text-slate-700">
                        Samkalp IAS
                      </span>
                    </div>
                    <div className="rounded-lg border bg-white px-4 py-2 shadow">
                      <span className="text-sm font-semibold text-slate-700">
                        Primus IAS
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Future Roadmap Section */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
              Expanding to Serve the Entire Education Ecosystem
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-slate-600 md:text-xl">
              We are leveraging our success in the UPSC-CSE segment to build a
              playbook for institutions everywhere.
            </p>
          </div>

          <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader className="text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-blue-500" />
                <CardTitle className="text-xl font-bold text-slate-900">
                  K-12 Schools
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  Comprehensive grading solutions for primary and secondary
                  education institutions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader className="text-center">
                <Target className="mx-auto mb-4 h-12 w-12 text-green-500" />
                <CardTitle className="text-xl font-bold text-slate-900">
                  Undergraduate & Postgraduate Colleges
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  Advanced evaluation systems for higher education institutions
                  and universities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader className="text-center">
                <Award className="mx-auto mb-4 h-12 w-12 text-purple-500" />
                <CardTitle className="text-xl font-bold text-slate-900">
                  Professional Institutes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  Specialized solutions for CA, CS, LLB, and other professional
                  certification programs.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-lg">
            <CardHeader className="text-center">
              <Globe className="mx-auto mb-4 h-12 w-12 text-indigo-500" />
              <CardTitle className="text-2xl font-bold text-slate-900">
                Growing with India
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg leading-relaxed text-slate-600">
                We are developing robust multilingual support for Hindi,
                Marathi, Kannada, and many more languages to serve institutions
                across the nation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );

  const PricingPage = () => (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            Simple, Transparent Plans for Every Budget
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 md:text-xl">
            Find the perfect pricing model for your institution and start
            grading smarter today.
          </p>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Plan 1: Pay-As-You-Use */}
            <Card className="border-2 border-slate-200 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl">
              <CardHeader className="pb-4 text-center">
                <Zap className="mx-auto mb-4 h-12 w-12 text-indigo-500" />
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Pay-As-You-Use
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">₹25</span>
                  <span className="ml-2 text-slate-600">Per Answer Sheet</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-slate-600">
                  <span className="font-semibold text-slate-900">
                    Best For:
                  </span>{" "}
                  Flexible needs and trying out the platform.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                    <span className="text-slate-600">
                      No monthly commitment
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                    <span className="text-slate-600">Perfect for trials</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                    <span className="text-slate-600">Instant grading</span>
                  </div>
                </div>
                <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                  Start with Pay-As-You-Use
                </Button>
              </CardContent>
            </Card>

            {/* Plan 2: Unlimited */}
            <Card className="relative border-2 border-indigo-500 transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                <span className="rounded-full bg-indigo-500 px-4 py-1 text-sm font-semibold text-white">
                  Most Popular
                </span>
              </div>
              <CardHeader className="pb-4 text-center">
                <TrendingUp className="mx-auto mb-4 h-12 w-12 text-indigo-500" />
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Unlimited
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">
                    ₹3,000
                  </span>
                  <span className="ml-2 text-slate-600">
                    Per Student, Per Year
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-slate-600">
                  <span className="font-semibold text-slate-900">
                    Best For:
                  </span>{" "}
                  Predictable, high-volume usage.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                    <span className="text-slate-600">Unlimited grading</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                    <span className="text-slate-600">
                      Best value for regular use
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                    <span className="text-slate-600">Priority support</span>
                  </div>
                </div>
                <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                  Choose Unlimited
                </Button>
              </CardContent>
            </Card>

            {/* Plan 3: Enterprise */}
            <Card className="border-2 border-slate-200 transition-all duration-300 hover:border-purple-300 hover:shadow-xl">
              <CardHeader className="pb-4 text-center">
                <Award className="mx-auto mb-4 h-12 w-12 text-purple-500" />
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Enterprise
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">
                    ₹2,00,000
                  </span>
                  <span className="ml-2 text-slate-600">
                    For 100 Students, Per Year
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-slate-600">
                  <span className="font-semibold text-slate-900">
                    Includes:
                  </span>{" "}
                  Unlimited grading plus exclusive access to our AI-powered
                  Annual Analytics Dashboard for deep institutional insights.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                    <span className="text-slate-600">
                      Everything in Unlimited
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                    <span className="text-slate-600">
                      Advanced analytics dashboard
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                    <span className="text-slate-600">
                      Dedicated account manager
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  Talk to Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Value Section */}
          <div className="mt-20 text-center">
            <Card className="mx-auto max-w-4xl border-0 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-lg">
              <CardContent className="p-8">
                <h3 className="mb-4 text-2xl font-bold text-slate-900">
                  Not sure which plan is right for you?
                </h3>
                <p className="mb-6 text-lg text-slate-600">
                  Our team will help you choose the perfect plan based on your
                  institution's needs and budget.
                </p>
                <Button
                  size="lg"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Get Personalized Recommendation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );

  const ContactPage = () => (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            Let's Connect
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 md:text-xl">
            See how GradeBench can transform your institution. Reach out today
            for a personalized demo or to speak with our team.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    Request Your Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Work Email
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder="your.email@institution.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your institution name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Tell us about your grading needs..."
                    />
                  </div>

                  <Button className="w-full bg-indigo-600 py-3 text-lg text-white hover:bg-indigo-700">
                    Request My Demo
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Details */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center">
                    <Mail className="mr-4 h-8 w-8 text-indigo-600" />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Email Us
                      </h3>
                      <p className="text-slate-600">Get in touch via email</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-indigo-600">
                    info@gradebench.com
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center">
                    <Globe className="mr-4 h-8 w-8 text-indigo-600" />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Visit Our Website
                      </h3>
                      <p className="text-slate-600">
                        Learn more about our platform
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-indigo-600">
                    www.gradebench.com
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    Why Choose GradeBench?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                      <span className="text-slate-600">
                        95% faster grading process
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                      <span className="text-slate-600">70% cost reduction</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                      <span className="text-slate-600">
                        100% fair and unbiased evaluation
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                      <span className="text-slate-600">
                        Human-like personalized feedback
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );

  const Navigation = () => (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">
              GradeBench
            </span>
          </div>

          <div className="hidden space-x-8 md:flex">
            <button
              onClick={() => setCurrentPage("home")}
              className={`${currentPage === "home" ? "font-semibold text-indigo-600" : "text-slate-600 hover:text-slate-900"} transition-colors`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className={`${currentPage === "about" ? "font-semibold text-indigo-600" : "text-slate-600 hover:text-slate-900"} transition-colors`}
            >
              About
            </button>
            <button
              onClick={() => setCurrentPage("features")}
              className={`${currentPage === "features" ? "font-semibold text-indigo-600" : "text-slate-600 hover:text-slate-900"} transition-colors`}
            >
              Features
            </button>
            <button
              onClick={() => setCurrentPage("solutions")}
              className={`${currentPage === "solutions" ? "font-semibold text-indigo-600" : "text-slate-600 hover:text-slate-900"} transition-colors`}
            >
              Solutions
            </button>
            <button
              onClick={() => setCurrentPage("pricing")}
              className={`${currentPage === "pricing" ? "font-semibold text-indigo-600" : "text-slate-600 hover:text-slate-900"} transition-colors`}
            >
              Pricing
            </button>
            <button
              onClick={() => setCurrentPage("contact")}
              className={`${currentPage === "contact" ? "font-semibold text-indigo-600" : "text-slate-600 hover:text-slate-900"} transition-colors`}
            >
              Contact
            </button>
          </div>

          <div className="md:hidden">
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="home">Home</option>
              <option value="about">About</option>
              <option value="features">Features</option>
              <option value="solutions">Solutions</option>
              <option value="pricing">Pricing</option>
              <option value="contact">Contact</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "about":
        return <AboutPage />;
      case "features":
        return <FeaturesPage />;
      case "solutions":
        return <SolutionsPage />;
      case "pricing":
        return <PricingPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {renderCurrentPage()}
    </div>
  );
};

export default GradeBenchWebsite;
