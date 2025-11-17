"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@gb/ui/src/components/ui/alert-dialog";
import { Badge } from "@gb/ui/src/components/ui/badge";
import { Button } from "@gb/ui/src/components/ui/button";
import { Card, CardContent } from "@gb/ui/src/components/ui/card";
import { Progress } from "@gb/ui/src/components/ui/progress";
import {
	BarChart3,
	CheckCircle2,
	Clock,
	RefreshCw,
	Upload,
	X,
	Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { AcademicTest } from "@/lib/academic-tests-api";
import {
	generateDynamicRubric,
	getAcademicTest,
	pollForDynamicRubric,
} from "@/lib/academic-tests-api";
import type { AnswerPaper } from "@/lib/answer-papers-api";
import {
	deleteAnswerPaper,
	getAnswerPapers,
	startEvaluation,
} from "@/lib/answer-papers-api";

interface EvaluationDashboardProps {
	testId: string;
	testName: string;
	initialAnswerPapers: AnswerPaper[];
	onUploadMore: () => void;
}

export function EvaluationDashboard({
	testId,
	testName,
	initialAnswerPapers,
	onUploadMore,
}: EvaluationDashboardProps) {
	const router = useRouter();
	const [answerPapers, setAnswerPapers] =
		useState<AnswerPaper[]>(initialAnswerPapers);
	const [academicTest, setAcademicTest] = useState<AcademicTest | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isAutomating, setIsAutomating] = useState(false);

	const isAnyProcessing = answerPapers.some(
		(p) => p.processed_document_url === null,
	);
	const isAllProcessed =
		answerPapers.length > 0 &&
		answerPapers.every((p) => p.processed_document_url !== null);

	const processingStatus = isAnyProcessing ? "Processing" : "Processed";
	const processedCount = answerPapers.filter(
		(p) => p.processed_document_url !== null,
	).length;
	const totalCount = answerPapers.length;
	const processingPercentage =
		totalCount > 0 ? (processedCount / totalCount) * 100 : 0;

	const fetchPapers = useCallback(async () => {
		try {
			const updated = await getAnswerPapers(testId);
			setAnswerPapers(updated);
			return updated;
		} catch (error) {
			console.error("Error fetching answer papers:", error);
			toast.error("Failed to refresh answer papers.");
			return [];
		}
	}, [testId]);

	useEffect(() => {
		setAnswerPapers(initialAnswerPapers);
	}, [initialAnswerPapers]);

	useEffect(() => {
		if (isAnyProcessing) {
			const pollInterval = setInterval(fetchPapers, 5000); // Poll every 5s
			return () => clearInterval(pollInterval);
		}
		return () => {};
	}, [isAnyProcessing, fetchPapers]);

	useEffect(() => {
		const fetchTest = async () => {
			try {
				const test = await getAcademicTest(testId);
				setAcademicTest(test);
				if (!test.dynamic_rubric) {
					toast.info("Generating dynamic rubric...");
					await generateDynamicRubric(testId);
					const updatedTest = await pollForDynamicRubric(testId);
					setAcademicTest(updatedTest);
					toast.success("Dynamic rubric generated successfully.");
				}
			} catch (error) {
				console.error("Error fetching academic test:", error);
				toast.error("Failed to fetch academic test details.");
			}
		};

		fetchTest();
	}, [testId]);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		await fetchPapers();
		setIsRefreshing(false);
		toast.success("Answer papers have been updated.");
	};

	const handleDeleteClick = useCallback((paperId: string) => {
		setDeleteConfirm(paperId);
	}, []);

	const handleConfirmDelete = useCallback(async (paperId: string) => {
		setIsDeleting(true);
		try {
			await deleteAnswerPaper(paperId);
			setAnswerPapers((prev) => prev.filter((p) => p.id !== paperId));
			toast.success("Answer paper deleted successfully");
		} catch (error) {
			console.error("Error deleting answer paper:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to delete paper",
			);
		} finally {
			setIsDeleting(false);
			setDeleteConfirm(null);
		}
	}, []);

	const handleAutomateClick = async () => {
		setIsAutomating(true);
		toast.info("Starting automated evaluation for all processed papers...");
		try {
			await startEvaluation(testId);
			toast.success(
				"Automated evaluation started. Grades will appear as they are completed.",
			);
			// Trigger a refresh to get latest status
			setTimeout(handleRefresh, 2000);
		} catch (error) {
			console.error("Error starting automated evaluation:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to start automated evaluation.",
			);
		} finally {
			setIsAutomating(false);
		}
	};

	const handlePaperClick = useCallback(
		(paper: AnswerPaper) => {
			if (paper.processed_document_url) {
				router.push(`/quicks/tests/${testId}/view/${paper.id}`);
			} else {
				toast.info("This paper is still processing and cannot be viewed yet.");
			}
		},
		[testId, router],
	);

	return (
		<div className="container mx-auto space-y-6 p-6">
			{/* Header */}
			<div className="-mx-6 -mt-6 sticky top-0 z-10 space-y-4 border-b bg-background p-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-semibold text-3xl">{testName}</h1>
						<div className="mt-2 flex items-center gap-2">
							<Badge
								variant={isAnyProcessing ? "secondary" : "default"}
								className="gap-1"
							>
								{isAnyProcessing ? (
									<Clock className="h-3 w-3 animate-spin" />
								) : (
									<CheckCircle2 className="h-3 w-3" />
								)}
								{processingStatus}
							</Badge>
							<span className="text-muted-foreground text-sm">
								{processedCount}/{totalCount} papers processed
							</span>
						</div>
					</div>

					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleRefresh}
							disabled={isRefreshing || isAnyProcessing}
						>
							<RefreshCw
								className={`mr-2 h-4 w-4 ${
									isRefreshing || isAnyProcessing ? "animate-spin" : ""
								}`}
							/>
							{isRefreshing || isAnyProcessing ? "Refreshing..." : "Refresh"}
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onUploadMore}
							disabled={isAutomating}
						>
							<Upload className="mr-2 h-4 w-4" />
							Upload More
						</Button>
						<Button
							size="sm"
							onClick={handleAutomateClick}
							disabled={
								!isAllProcessed ||
								isAutomating ||
								isAnyProcessing ||
								!academicTest?.dynamic_rubric
							}
						>
							<Zap className="mr-2 h-4 w-4" />
							{isAutomating ? "Evaluating..." : "Automate Evaluation"}
						</Button>
						{isAllProcessed && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => router.push(`/quicks/tests/${testId}/report`)}
							>
								<BarChart3 className="mr-2 h-4 w-4" />
								View Report
							</Button>
						)}
					</div>
				</div>

				{totalCount > 0 && (
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">
								Digitization Progress
							</span>
							<span className="font-medium">
								{processedCount}/{totalCount}
							</span>
						</div>
						<Progress value={processingPercentage} className="h-2" />
					</div>
				)}
			</div>

			{/* Papers List */}
			<div className="space-y-4">
				<div>
					<h2 className="font-semibold text-lg">Answer Papers</h2>
					<p className="text-muted-foreground text-sm">
						Click on a processed paper to view details. Status is updated in
						real-time.
					</p>
				</div>

				{answerPapers.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-16 text-center">
							<div className="mb-4 text-5xl">📝</div>
							<h3 className="mb-2 font-semibold text-lg">
								No Answer Papers Yet
							</h3>
							<p className="mb-6 text-muted-foreground text-sm">
								Upload answer papers to begin the evaluation process.
							</p>
							<Button onClick={onUploadMore}>
								<Upload className="mr-2 h-4 w-4" />
								Upload Papers
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
						{answerPapers.map((paper) => (
							<Card
								key={paper.id}
								className={`border-primary/50 transition-all ${
									paper.processed_document_url
										? "cursor-pointer hover:shadow-md"
										: "cursor-not-allowed opacity-70"
								}`}
								onClick={() => handlePaperClick(paper)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										handlePaperClick(paper);
									}
								}}
								role="button"
								tabIndex={paper.processed_document_url ? 0 : -1}
							>
								<CardContent className="flex flex-col justify-between p-4">
									<div className="flex w-full items-start justify-between">
										<div className="flex-1">
											<p className="truncate font-medium">
												{paper.student_name}
											</p>
											<p className="text-muted-foreground text-xs">
												ID: {paper.id.slice(0, 8)}...
											</p>
										</div>
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteClick(paper.id);
											}}
											className="rounded p-1 hover:bg-destructive/10"
											title="Delete paper"
										>
											<X className="h-4 w-4 text-destructive" />
										</button>
									</div>

									<div className="mt-4 flex items-end justify-between">
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												{paper.processed_document_url === null ? (
													<div className="flex items-center gap-1">
														<div className="h-2 w-2 animate-spin rounded-full border-2 border-current border-r-transparent" />
														<span className="text-muted-foreground text-xs">
															Processing
														</span>
													</div>
												) : (
													<div className="flex items-center gap-1 text-green-600">
														<CheckCircle2 className="h-4 w-4" />
														<span className="text-xs">Processed</span>
													</div>
												)}
											</div>
											{paper.grade && (
												<Badge variant="secondary">{paper.grade}</Badge>
											)}
										</div>
										<div className="text-right">
											<p className="font-bold text-lg">
												{paper.total_score ?? "N/A"}
											</p>
											<p className="text-muted-foreground text-xs">
												/ {paper.max_score || 0} pts
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>

			{/* Delete Confirmation */}
			<AlertDialog
				open={deleteConfirm !== null}
				onOpenChange={(open) => !open && setDeleteConfirm(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Answer Paper</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this answer paper? This action
							cannot be undone and will remove all associated data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex justify-end gap-2 pt-4">
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								deleteConfirm && handleConfirmDelete(deleteConfirm)
							}
							disabled={isDeleting}
							className="bg-destructive hover:bg-destructive/90"
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
