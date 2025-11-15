"use client";

import { Button } from "@gb/ui/src/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
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
	const router = useRouter();
	const testId = params?.testId as string;

	const [test, setTest] = useState<AcademicTest | null>(null);
	const [answerPapers, setAnswerPapers] = useState<AnswerPaper[]>([]);
	const [loading, setLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchAnswerPapers = useCallback(async () => {
		try {
			const papers = await getAnswerPapers(testId);
			setAnswerPapers(papers);
			return papers;
		} catch (error) {
			console.error("Error fetching answer papers:", error);
			return [];
		}
	}, [testId]);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);

			const testResponse = await fetch(
				`${API_BASE_URL}/academic-tests/${testId}`,
			);
			if (testResponse.ok) {
				const testData = await testResponse.json();
				setTest(testData.data || testData);
			}

			await fetchAnswerPapers();
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	}, [testId, fetchAnswerPapers]);

	useEffect(() => {
		if (testId) fetchData();
	}, [testId, fetchData]);

	useEffect(() => {
		if (answerPapers.length === 0) return;

		const interval = setInterval(() => {
			fetchAnswerPapers();
		}, 3000);

		return () => clearInterval(interval);
	}, [fetchAnswerPapers, answerPapers.length]);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			await fetchAnswerPapers();
			toast.success("Papers refreshed successfully");
		} finally {
			setIsRefreshing(false);
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
					<p className="text-muted-foreground">Loading test data...</p>
				</div>
			</div>
		);
	}

	if (answerPapers.length === 0) {
		return (
			<div className="space-y-6">
				<div className="border-b bg-background p-6">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => router.push("/quicks")}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Dashboard
					</Button>
				</div>

				<div className="container mx-auto p-6">
					<div className="mb-6">
						<h1 className="font-semibold text-3xl">Upload Answer Papers</h1>
						<p className="text-muted-foreground text-sm">
							Select and upload PDF files for evaluation
						</p>
					</div>
					<UploadPanel testId={testId} onUploadComplete={() => fetchData()} />
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="border-b bg-background p-6">
				<div className="flex items-center justify-between">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => router.push("/quicks")}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Dashboard
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleRefresh}
						disabled={isRefreshing}
					>
						<RefreshCw
							className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
						/>
						{isRefreshing ? "Refreshing..." : "Refresh"}
					</Button>
				</div>
			</div>

			<EvaluationDashboard
				testId={testId}
				testName={test?.test_name || "Academic Test"}
				initialAnswerPapers={answerPapers}
				onRefresh={handleRefresh}
			/>
		</div>
	);
}
