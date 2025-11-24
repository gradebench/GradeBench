"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EvaluationDashboard } from "@/components/evaluation/EvaluationDashboard";
import { UploadPanel } from "@/components/evaluation/UploadPanel";
import type { AnswerPaper } from "@/lib/answer-papers-api";
import {
  getAnswerPapers,
  getAnswerPapersByAcademicTest,
} from "@/lib/answer-papers-api";
import { GRADE_API_BASE as API_BASE_URL } from "@/lib/api";

interface AcademicTest {
  id: string;
  test_name: string;
  question_paper_id: string;
  evaluator_configuration_id: string;
  key_answers_url: string | null;
  dynamic_rubrics_url: string | null;
  created_at: string;
}

interface AcademicTestResp {
  success?: boolean;
  status_code?: number;
  status_message?: string;
  data?: { academic_tests?: AcademicTest } | AcademicTest;
  metadata?: unknown;
}

export default function EvaluatePage() {
  const params = useParams();
  const _router = useRouter();
  const testId = params?.testId as string;

  const [test, setTest] = useState<AcademicTest | null>(null);
  const [answerPapers, setAnswerPapers] = useState<AnswerPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"loading" | "upload" | "dashboard">(
    "loading"
  );

  const [isRubricGenerating, setIsRubricGenerating] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!testId || hasInitialized.current) return;
    hasInitialized.current = true;

    const ensureRubricsAndPrepare = async () => {
      setLoading(true);
      setIsRubricGenerating(true);
      try {
        // GET academic test details
        const resp = await fetch(`${API_BASE_URL}/academic-tests/${testId}`);
        let parsed: AcademicTestResp | null = null;
        try {
          parsed = await resp.json();
        } catch (_) {
          // ignore parse errors
        }

        if (!resp.ok) {
          console.warn("Failed to fetch academic test", resp.status);
          toast.error("Failed to load test details");
          setViewMode("upload");
          return;
        }

        const extractAcademicTest = (data: unknown): AcademicTest | null => {
          if (!data) return null;
          if (typeof data !== "object") return null;
          const obj = data as Record<string, unknown>;
          if (
            "academic_tests" in obj &&
            obj.academic_tests &&
            typeof obj.academic_tests === "object"
          ) {
            return obj.academic_tests as AcademicTest;
          }
          return obj as unknown as AcademicTest;
        };

        const fetchedTest = extractAcademicTest(parsed?.data);
        if (fetchedTest) setTest(fetchedTest);

        // Check if dynamic rubrics exist
        if (fetchedTest?.dynamic_rubrics_url) {
          try {
            // Prefer the academic-test specific endpoint, fallback to legacy
            let papers = await getAnswerPapersByAcademicTest(testId);
            if (!Array.isArray(papers) || papers.length === 0) {
              papers = await getAnswerPapers(testId);
            }
            setAnswerPapers(papers);
            setViewMode(papers.length > 0 ? "dashboard" : "upload");
          } catch (err) {
            console.warn("Failed to load answer papers", err);
            try {
              const papers = await getAnswerPapers(testId);
              setAnswerPapers(papers);
              setViewMode(papers.length > 0 ? "dashboard" : "upload");
            } catch (err2) {
              console.warn("Fallback also failed", err2);
              setViewMode("upload");
            }
          }
          return;
        }

        // No rubrics found - notify user
        console.warn("Dynamic rubrics not found for this test");

        // Fetch answer papers anyway to show upload panel
        // Allow user to upload while generation proceeds; fetch answer papers
        try {
          let papers = await getAnswerPapersByAcademicTest(testId);
          if (!Array.isArray(papers) || papers.length === 0) {
            papers = await getAnswerPapers(testId);
          }
          setAnswerPapers(papers);
          setViewMode(papers.length > 0 ? "dashboard" : "upload");
        } catch (err) {
          console.warn(
            "Failed to load answer papers after generation start",
            err
          );
          try {
            const papers = await getAnswerPapers(testId);
            setAnswerPapers(papers);
            setViewMode(papers.length > 0 ? "dashboard" : "upload");
          } catch (err2) {
            console.warn("Fallback also failed", err2);
            setViewMode("upload");
          }
        }
      } catch (err) {
        console.error("Error during setup:", err);
        toast.error(err instanceof Error ? err.message : "Unexpected error");
        setViewMode("upload");
      } finally {
        setIsRubricGenerating(false);
        setLoading(false);
      }
    };

    ensureRubricsAndPrepare();
  }, [testId]);

  const handleUploadComplete = useCallback(async () => {
    try {
      toast.info("Fetching updated answer papers...");
      let papers = await getAnswerPapersByAcademicTest(testId);
      if (!Array.isArray(papers) || papers.length === 0) {
        papers = await getAnswerPapers(testId);
      }
      setAnswerPapers(papers);
      setViewMode("dashboard");
      toast.success("Dashboard is ready.");
    } catch (_error) {
      // final fallback
      try {
        const papers = await getAnswerPapers(testId);
        setAnswerPapers(papers);
        setViewMode("dashboard");
        toast.success("Dashboard is ready.");
      } catch (__err) {
        toast.error("Failed to fetch answer papers after upload.");
      }
    }
  }, [testId]);

  if (loading || viewMode === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-muted-foreground">Loading test data...</p>
        </div>
      </div>
    );
  }

  if (isRubricGenerating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-muted-foreground">Generating dynamic rubrics...</p>
        </div>
      </div>
    );
  }

  if (viewMode === "upload") {
    return (
      <UploadPanel testId={testId} onUploadComplete={handleUploadComplete} />
    );
  }

  return (
    <EvaluationDashboard
      testId={testId}
      testName={test?.test_name || "Academic Test"}
      initialAnswerPapers={answerPapers}
      onUploadMore={() => setViewMode("upload")}
    />
  );
}
