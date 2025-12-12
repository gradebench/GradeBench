"use client";

import { Badge } from "@gb/ui/src/components/ui/badge";
import { Button } from "@gb/ui/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/ui/src/components/ui/card";
import {
  ArrowLeft,
  Edit2,
  ExternalLink,
  Loader2,
  MessageSquare,
  Target,
  ThumbsDown,
  ThumbsUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  type AnswerPaper,
  getAnswerPapersByAcademicTest,
} from "@/lib/answer-papers-api";

interface Annotation {
  text_content: string;
  page_number: number;
  color: string;
  annotation_type: string;
  correctness_indicator: string;
  annotation_id: string;
  coordinates: { x: number; y: number }[];
}

interface QuestionEvaluation {
  percentage: number;
  marks_total: number;
  question_number: string;
  feedback: {
    strengths: string[];
    summary: string;
    weaknesses: string[];
    tone?: string;
    suggestions?: string[];
  };
  marks_awarded: number;
  annotations?: Annotation[];
}

interface EvaluationData {
  evaluation_id: string;
  question_evaluations: QuestionEvaluation[];
  overall_feedback: {
    summary: string;
    key_strengths: string[];
    areas_for_improvement: string[];
  };
  overall_score: {
    percentage: number;
    total_marks_awarded: number;
    grade: string;
    total_marks_possible: number;
  };
}

const StatsOverview = ({
  evaluation,
  questions,
}: {
  evaluation: EvaluationData;
  questions: QuestionEvaluation[];
}) => {
  const { total_marks_awarded, total_marks_possible, percentage } =
    evaluation.overall_score;

  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-3 sm:gap-4">
      <div className="rounded-xl border bg-card p-3 shadow-sm sm:p-4">
        <div className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Score
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-bold text-2xl sm:text-3xl">
            {total_marks_awarded}
          </span>
          <span className="text-muted-foreground text-sm">
            / {total_marks_possible}
          </span>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-3 shadow-sm sm:p-4">
        <div className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Percentage
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span
            className={`font-bold text-2xl sm:text-3xl ${
              percentage >= 80
                ? "text-green-500"
                : percentage >= 50
                ? "text-amber-500"
                : "text-red-500"
            }`}
          >
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-3 shadow-sm sm:p-4">
        <div className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Questions
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-bold text-2xl sm:text-3xl">
            {questions.length}
          </span>
          <span className="text-muted-foreground text-sm">Total</span>
        </div>
      </div>
    </div>
  );
};

const QuestionGrid = ({ questions }: { questions: QuestionEvaluation[] }) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-xs sm:text-sm">
          Question Performance
        </h3>
        <div className="flex gap-1 text-[9px] text-muted-foreground sm:gap-2 sm:text-[10px]">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full border border-green-500/50 bg-green-500/20" />{" "}
            High
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full border border-amber-500/50 bg-amber-500/20" />{" "}
            Avg
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full border border-red-500/50 bg-red-500/20" />{" "}
            Low
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
        {questions.map((q, i) => {
          const colorClass =
            q.percentage >= 80
              ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/20"
              : q.percentage >= 50
              ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
              : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20";

          return (
            <div
              key={i}
              className={`group relative flex cursor-default flex-col items-center justify-center rounded-md border p-2 transition-all ${colorClass}`}
            >
              <span className="font-medium text-[10px] opacity-70">
                Q{q.question_number}
              </span>
              <span className="font-bold text-sm">{q.marks_awarded}</span>

              {/* Tooltip */}
              <div className="-translate-x-1/2 absolute bottom-full left-1/2 z-50 mb-2 hidden w-max flex-col items-center rounded-md border bg-popover px-2 py-1 shadow-md group-hover:flex">
                <span className="whitespace-nowrap font-semibold text-[10px]">
                  {q.marks_awarded} / {q.marks_total} Marks
                </span>
                <div className="-bottom-1 -translate-x-1/2 absolute left-1/2 h-2 w-2 rotate-45 border-r border-b bg-popover" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params?.testId as string;
  const paperId = params?.paperId as string;

  const [paper, setPaper] = useState<AnswerPaper | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [questions, setQuestions] = useState<QuestionEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!testId || !paperId) {
        setError("Missing test ID or paper ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const papers = await getAnswerPapersByAcademicTest(testId);
        const foundPaper = papers.find((p) => p.id === paperId);

        if (!foundPaper) {
          setError("Paper not found.");
          return;
        }

        setPaper(foundPaper);

        if (foundPaper.processed_document_url) {
          const res = await fetch(foundPaper.processed_document_url);
          if (!res.ok) throw new Error("Failed to fetch evaluation data");
          const data: EvaluationData = await res.json();

          setEvaluation(data);
          setQuestions(data.question_evaluations || []);
        } else {
          setError("Evaluation data not available yet");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load result data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [testId, paperId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !paper || !evaluation) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error || "Failed to load data"}</p>
        <Button onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 flex-col items-start justify-between gap-2 border-b px-3 py-2 sm:h-16 sm:flex-row sm:items-center sm:px-6 sm:py-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}
          >
            <ArrowLeft className="mr-1 h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="hidden h-6 w-px bg-border sm:block" />
          <div>
            <h1 className="font-semibold text-base sm:text-lg">
              Evaluation Result
            </h1>
            <p className="text-muted-foreground text-xs">
              Student: {paper.student_name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (paper.annotated_document_url) {
                if (paper.annotated_document_url)
                  window.open(paper.annotated_document_url, "_blank");
              }
            }}
            className="hidden sm:flex"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Annotation
          </Button>
          <Badge
            variant="outline"
            className="border-green-500 bg-green-500/10 text-green-700"
          >
            Completed
          </Badge>
        </div>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="hidden w-full flex-col border-r bg-muted/30 p-2 lg:flex lg:w-1/2 lg:p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-medium text-muted-foreground text-sm">
              Annotated Submission
            </h2>
            <Badge variant="secondary" className="text-xs">
              PDF
            </Badge>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg border bg-muted/50 shadow-sm">
            {paper.annotated_document_url ? (
              <>
                <iframe
                  src={paper.annotated_document_url}
                  title="Annotated Submission PDF"
                  width="100%"
                  height="800px"
                  style={{ border: "none" }}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 gap-2 shadow-lg"
                  onClick={() => {
                    if (paper.annotated_document_url) {
                      window.open(paper.annotated_document_url, "_blank");
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in New Tab
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Loading PDF...</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col bg-background lg:w-1/2">
          <div className="border-b bg-muted/10 p-3 shadow-sm sm:p-4 md:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="font-bold text-xl tracking-tight sm:text-2xl">
                Performance Report
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Comprehensive analysis of student performance
              </p>
            </div>

            <StatsOverview evaluation={evaluation} questions={questions} />
            <QuestionGrid questions={questions} />
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-l-4 border-l-primary shadow-sm transition-all hover:scale-[1.01] hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="h-4 w-4 text-primary" />
                    Overall Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-muted-foreground leading-relaxed">
                    {evaluation.overall_feedback.summary}
                  </p>
                  <div className="grid grid-cols-2 gap-6 rounded-lg bg-muted/30 p-4">
                    <div>
                      <p className="mb-2 flex items-center gap-2 font-semibold text-green-700 text-xs">
                        <ThumbsUp className="h-3 w-3" /> Key Strengths
                      </p>
                      <ul className="space-y-1">
                        {evaluation.overall_feedback.key_strengths.map(
                          (s, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-muted-foreground text-xs"
                            >
                              <span className="mt-1.5 h-1 w-1 rounded-full bg-green-500" />
                              {s}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 flex items-center gap-2 font-semibold text-amber-700 text-xs">
                        <Target className="h-3 w-3" /> Areas for Improvement
                      </p>
                      <ul className="space-y-1">
                        {evaluation.overall_feedback.areas_for_improvement.map(
                          (s, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-muted-foreground text-xs"
                            >
                              <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-500" />
                              {s}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Question Breakdown</h3>
              {questions.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden border-l-2 border-l-transparent transition-all hover:scale-[1.01] hover:border-l-primary hover:shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-muted/10 to-transparent px-4 py-3 pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="bg-background font-bold"
                          >
                            Q{q.question_number}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-muted shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${q.percentage}%` }}
                                transition={{
                                  duration: 0.6,
                                  delay: index * 0.1,
                                }}
                                className={`h-full rounded-full ${
                                  q.percentage >= 80
                                    ? "bg-gradient-to-r from-green-500 to-green-400"
                                    : q.percentage >= 50
                                    ? "bg-gradient-to-r from-amber-500 to-amber-400"
                                    : "bg-gradient-to-r from-red-500 to-red-400"
                                }`}
                              />
                            </div>
                            <span className="font-medium text-xs">
                              {q.marks_awarded} / {q.marks_total}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4 py-4">
                      <div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {q.feedback.summary}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {q.feedback.strengths &&
                          q.feedback.strengths.length > 0 && (
                            <div className="rounded-md border border-green-500/20 bg-green-500/10 p-3 shadow-sm transition-all hover:shadow-md">
                              <p className="mb-2 flex items-center gap-1.5 font-medium text-green-700 text-xs">
                                <ThumbsUp className="h-3 w-3" /> Strengths
                              </p>
                              <ul className="space-y-1">
                                {q.feedback.strengths.map((s, i) => (
                                  <li
                                    key={i}
                                    className="text-[11px] text-muted-foreground"
                                  >
                                    • {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {q.feedback.weaknesses &&
                          q.feedback.weaknesses.length > 0 && (
                            <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 shadow-sm transition-all hover:shadow-md">
                              <p className="mb-2 flex items-center gap-1.5 font-medium text-red-700 text-xs">
                                <ThumbsDown className="h-3 w-3" /> Weaknesses
                              </p>
                              <ul className="space-y-1">
                                {q.feedback.weaknesses.map((w, i) => (
                                  <li
                                    key={i}
                                    className="text-[11px] text-muted-foreground"
                                  >
                                    • {w}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>

                      {q.feedback.suggestions &&
                        q.feedback.suggestions.length > 0 && (
                          <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-3 shadow-sm transition-all hover:shadow-md">
                            <p className="mb-2 flex items-center gap-1.5 font-medium text-amber-700 text-xs">
                              <Edit2 className="h-3 w-3" /> Suggestions
                            </p>
                            <ul className="space-y-1">
                              {q.feedback.suggestions.map((s, i) => (
                                <li
                                  key={i}
                                  className="text-[11px] text-muted-foreground"
                                >
                                  • {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {q.annotations && q.annotations.length > 0 && (
                        <div className="mt-2 border-t pt-3">
                          <p className="mb-2 flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
                            <MessageSquare className="h-3 w-3" /> Specific
                            Comments
                          </p>
                          <div className="space-y-2">
                            {q.annotations.map((annot, i) => (
                              <div
                                key={i}
                                className="group/annot rounded-md border bg-muted/30 p-2 shadow-sm transition-all hover:bg-muted/50 hover:shadow-md"
                              >
                                <div className="mb-1 flex items-center justify-between">
                                  <Badge
                                    variant="outline"
                                    className="h-5 px-1 text-[10px] uppercase"
                                    style={{
                                      borderColor: annot.color,
                                      color: annot.color,
                                    }}
                                  >
                                    {annot.correctness_indicator}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground">
                                    Page {annot.page_number}
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-xs">
                                  {annot.text_content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
