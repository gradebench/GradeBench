"use client";

import { Badge } from "@gb/ui/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gb/ui/src/components/ui/card";
import { Separator } from "@gb/ui/src/components/ui/separator";
import { Skeleton } from "@gb/ui/src/components/ui/skeleton";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  FileTextIcon,
  KeyIcon,
  ListChecksIcon,
  SparklesIcon,
  TagIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AnswerComponent {
  component_id: string;
  component_type: string;
  description: string;
  marks: number;
  keywords: string[];
  evaluation_criteria: string;
}

interface QuestionAnswer {
  question_id: string;
  question_number: string;
  question_type: string;
  marks_allocated: number;
  answer_components: AnswerComponent[];
}

interface ModelAnswerData {
  model_answer_id: string;
  question_paper_id: string;
  question_answers: QuestionAnswer[];
}

interface AcademicTest {
  id: string;
  question_paper_id: string;
  evaluator_configuration_id: string;
  test_name: string;
  key_answers_url: string | null;
  dynamic_rubrics_url: string | null;
  updated_at: Record<string, unknown> | null;
  created_at: Record<string, unknown>;
}

const API_BASE_URL = "http://localhost:8083/grade/v1";

export default function ModelAnswerPage() {
  const params = useParams();
  const testId = params?.testId as string;

  const [academicTest, setAcademicTest] = useState<AcademicTest | null>(null);
  const [modelAnswer, setModelAnswer] = useState<ModelAnswerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestData = async () => {
      if (!testId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch academic test details
        const testResponse = await fetch(
          `${API_BASE_URL}/academic-tests/${testId}`
        );

        if (!testResponse.ok) {
          throw new Error("Failed to fetch test details");
        }

        const testData = await testResponse.json();

        if (testData.success && testData.data?.academic_tests) {
          const test = testData.data.academic_tests;
          setAcademicTest(test);

          // Fetch model answer if key_answers_url exists
          if (test.key_answers_url) {
            const modelAnswerResponse = await fetch(test.key_answers_url);

            if (!modelAnswerResponse.ok) {
              throw new Error("Failed to fetch model answer");
            }

            const modelAnswerData = await modelAnswerResponse.json();
            setModelAnswer(modelAnswerData);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load test data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId]);

  if (loading) {
    return (
      <DashboardLayout title="Model Answer">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !academicTest) {
    return (
      <DashboardLayout title="Model Answer">
        <Card className="border-red-500/20 bg-red-950/20">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <AlertCircleIcon className="mb-4 h-16 w-16 text-red-400" />
            <h3 className="mb-2 font-semibold text-red-300 text-xl">
              Error Loading Test
            </h3>
            <p className="text-center text-red-200">
              {error || "Test not found"}
            </p>
            <Link href="/quicks">
              <button
                type="button"
                className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Dashboard
              </button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const hasModelAnswer = modelAnswer && modelAnswer.question_answers.length > 0;

  return (
    <DashboardLayout title="">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/quicks">
              <button
                type="button"
                className="mb-2 flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Dashboard
              </button>
            </Link>
            <h1 className="font-bold text-3xl">{academicTest.test_name}</h1>
            <p className="text-muted-foreground">
              Academic Test Model Answer & Rubrics
            </p>
          </div>
        </div>

        {/* Test Information Card */}
        <Card className="border-blue-600/20 bg-gradient-to-br from-slate-950/80 to-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <FileTextIcon className="h-5 w-5" />
              Test Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground text-sm">Test ID</Label>
              <p className="font-mono text-sm">{academicTest.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">
                Question Paper ID
              </Label>
              <p className="font-mono text-sm">
                {academicTest.question_paper_id}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">
                Evaluator Config ID
              </Label>
              <p className="font-mono text-sm">
                {academicTest.evaluator_configuration_id}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Status</Label>
              <div className="mt-1 flex gap-2">
                {academicTest.key_answers_url && (
                  <Badge className="bg-green-600/20 text-green-400">
                    <CheckCircle2Icon className="mr-1 h-3 w-3" />
                    Key Answers
                  </Badge>
                )}
                {academicTest.dynamic_rubrics_url && (
                  <Badge className="bg-blue-600/20 text-blue-400">
                    <CheckCircle2Icon className="mr-1 h-3 w-3" />
                    Rubrics
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Answer Section */}
        {!hasModelAnswer ? (
          <Card className="border-yellow-500/20 bg-yellow-950/20">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <KeyIcon className="mb-4 h-16 w-16 text-yellow-400" />
              <h3 className="mb-2 font-semibold text-xl text-yellow-300">
                No Model Answer Available
              </h3>
              <p className="text-center text-yellow-200">
                Model answers have not been generated for this test yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="border-purple-600/20 bg-gradient-to-br from-purple-950/30 to-slate-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <SparklesIcon className="h-5 w-5" />
                  Model Answer Summary
                </CardTitle>
                <CardDescription>
                  Total {modelAnswer.question_answers.length} question(s) with
                  detailed answer components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-purple-600/20 bg-purple-950/20 p-4">
                    <div className="font-bold text-2xl text-purple-400">
                      {modelAnswer.question_answers.length}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Total Questions
                    </div>
                  </div>
                  <div className="rounded-lg border border-blue-600/20 bg-blue-950/20 p-4">
                    <div className="font-bold text-2xl text-blue-400">
                      {modelAnswer.question_answers.reduce(
                        (sum, q) => sum + q.answer_components.length,
                        0
                      )}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Answer Components
                    </div>
                  </div>
                  <div className="rounded-lg border border-green-600/20 bg-green-950/20 p-4">
                    <div className="font-bold text-2xl text-green-400">
                      {modelAnswer.question_answers.reduce(
                        (sum, q) => sum + q.marks_allocated,
                        0
                      )}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Total Marks
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions List */}
            {modelAnswer.question_answers.map((question, _qIndex) => (
              <Card
                key={question.question_id}
                className="border-blue-600/20 bg-slate-950"
              >
                <CardHeader className="bg-gradient-to-r from-blue-950/50 to-transparent">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-blue-400 text-xl">
                        <BookOpenIcon className="h-5 w-5" />
                        {question.question_number}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Question ID: {question.question_id}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className="border-blue-500/30 bg-blue-500/10 text-blue-300"
                      >
                        {question.question_type.replace(/_/g, " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-500/30 bg-green-500/10 text-green-300"
                      >
                        {question.marks_allocated} Marks
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <ListChecksIcon className="h-4 w-4" />
                    {question.answer_components.length} Answer Components
                  </div>

                  <div className="space-y-4">
                    {question.answer_components.map((component, _cIndex) => (
                      <div
                        key={component.component_id}
                        className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-slate-800 font-mono text-xs"
                            >
                              {component.component_id}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs"
                            >
                              {component.component_type}
                            </Badge>
                          </div>
                          <Badge className="bg-green-600/20 text-green-400">
                            {component.marks}{" "}
                            {component.marks === 1 ? "Mark" : "Marks"}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="mb-1 font-semibold text-slate-200 text-sm">
                              Description
                            </h4>
                            <p className="text-slate-300 text-sm">
                              {component.description}
                            </p>
                          </div>

                          <Separator className="bg-slate-800" />

                          <div>
                            <h4 className="mb-2 flex items-center gap-2 font-semibold text-slate-200 text-sm">
                              <TagIcon className="h-4 w-4 text-yellow-400" />
                              Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {component.keywords.map((keyword, kIndex) => (
                                <Badge
                                  key={`${component.component_id}-keyword-${kIndex}`}
                                  variant="outline"
                                  className="border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Separator className="bg-slate-800" />

                          <div>
                            <h4 className="mb-1 flex items-center gap-2 font-semibold text-slate-200 text-sm">
                              <CheckCircle2Icon className="h-4 w-4 text-green-400" />
                              Evaluation Criteria
                            </h4>
                            <p className="text-slate-400 text-sm">
                              {component.evaluation_criteria}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`font-medium text-sm ${className}`}>{children}</div>;
}
