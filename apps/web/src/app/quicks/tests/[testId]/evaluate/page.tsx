"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { EvaluationDashboard } from "@/components/evaluation/EvaluationDashboard";
import { UploadPanel } from "@/components/evaluation/UploadPanel";
import type { AnswerPaper } from "@/lib/answer-papers-api";
import { getAnswerPapers } from "@/lib/answer-papers-api";

interface AcademicTest {
	id: string;
	test_name: string;
	question_paper_id: string;
	evaluator_configuration_id: string;
	key_answers_url: string | null;
	dynamic_rubrics_url: string | null;
	created_at: string;
}

const API_BASE_URL = "http://localhost:8083/grade/v1";

export default function EvaluatePage() {
	const params = useParams();
	const _router = useRouter();
	const testId = params?.testId as string;

	const [test, setTest] = useState<AcademicTest | null>(null);
	const [answerPapers, setAnswerPapers] = useState<AnswerPaper[]>([]);
	const [loading, setLoading] = useState(true);
	const [viewMode, setViewMode] = useState<"loading" | "upload" | "dashboard">(
		"loading",
	);

	const [isRubricGenerating, setIsRubricGenerating] = useState(false);

	const fetchInitialData = useCallback(async () => {
		try {
			setLoading(true);

			// Fetch test details first
			const testResponse = await fetch(
				`${API_BASE_URL}/academic-tests/${testId}`,
			);
			if (testResponse.ok) {
				const testData = await testResponse.json();
				setTest(testData.data || testData);
			} else {
				throw new Error("Failed to load test details.");
			}

			// Then, check for existing answer papers
			const papers = await getAnswerPapers(testId);
			setAnswerPapers(papers);

			if (papers.length > 0) {
				setViewMode("dashboard");
			} else {
				setViewMode("upload");
			}
		} catch (error) {
			console.error("Error fetching initial data:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to load page.",
			);
			// Fallback to upload view on error
			setViewMode("upload");
		} finally {
			setLoading(false);
		}
	}, [testId]);

	useEffect(() => {
		if (test && !test.dynamic_rubrics_url) {
			const generateRubrics = async () => {
				setIsRubricGenerating(true);
				try {
					const response = await fetch(
						`${API_BASE_URL}/dynamic-rubrics/${testId}`,
						{
							method: "POST",
						},
					);
					if (!response.ok) {
						throw new Error("Failed to generate dynamic rubrics.");
					}
					await fetchInitialData();
				} catch (error) {
					console.error("Error generating dynamic rubrics:", error);
					toast.error(
						error instanceof Error
							? error.message
							: "Failed to generate dynamic rubrics.",
					);
				} finally {
					setIsRubricGenerating(false);
				}
			};
			generateRubrics();
		}
	}, [test, testId, fetchInitialData]);

	useEffect(() => {
		if (testId) {
			fetchInitialData();
		}
	}, [testId, fetchInitialData]);

	const handleUploadComplete = useCallback(async () => {
		try {
			toast.info("Fetching updated answer papers...");
			const papers = await getAnswerPapers(testId);
			setAnswerPapers(papers);
			setViewMode("dashboard");
			toast.success("Dashboard is ready.");
		} catch (_error) {
			toast.error("Failed to fetch answer papers after upload.");
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
					<p className="text-muted-foreground">
						Generating dynamic rubrics...
					</p>
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
