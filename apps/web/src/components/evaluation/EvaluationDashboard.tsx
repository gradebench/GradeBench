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
import { BarChart3, CheckCircle2, Clock, FileText, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { AnswerPaper } from "@/lib/answer-papers-api";
import { deleteAnswerPaper, getAnswerPapers } from "@/lib/answer-papers-api";

interface EvaluationDashboardProps {
	testId: string;
	testName: string;
	initialAnswerPapers: AnswerPaper[];
	onRefresh?: () => Promise<void>;
}

export function EvaluationDashboard({
	testId,
	testName,
	initialAnswerPapers,
}: EvaluationDashboardProps) {
	const router = useRouter();
	const [answerPapers, setAnswerPapers] =
		useState<AnswerPaper[]>(initialAnswerPapers);
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Determine processing status
	const isAnyProcessing = answerPapers.some(
		(p) => p.processed_document_url === null,
	);
	const isAllProcessed = answerPapers.every(
		(p) => p.processed_document_url !== null,
	);

	const processingStatus = isAnyProcessing ? "Processing" : "Processed";
	const processedCount = answerPapers.filter(
		(p) => p.processed_document_url !== null,
	).length;
	const totalCount = answerPapers.length;
	const processingPercentage =
		totalCount > 0 ? (processedCount / totalCount) * 100 : 0;

	// Poll for updates every 3 seconds
	useEffect(() => {
		const pollInterval = setInterval(async () => {
			try {
				const updated = await getAnswerPapers(testId);
				setAnswerPapers(updated);
			} catch (error) {
				console.error("Error polling answer papers:", error);
			}
		}, 3000);

		return () => clearInterval(pollInterval);
	}, [testId]);

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

	const handlePaperClick = useCallback(
		(paperId: string) => {
			router.push(`/quicks/tests/${testId}/view/${paperId}`);
		},
		[testId, router],
	);

	return (
		<div className="container mx-auto space-y-6 p-6">
			{/* Header with Status and Action Buttons */}
			<div className="-mx-6 -mt-6 sticky top-0 z-10 space-y-4 bg-background p-6 shadow-sm">
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

					{/* Action Buttons */}
					<div className="flex gap-2">
						<Button variant="outline">
							<CheckCircle2 className="mr-2 h-4 w-4" />
							Verify
						</Button>
						<Button variant="outline">
							<Zap className="mr-2 h-4 w-4" />
							Automate
						</Button>
						{isAllProcessed && (
							<Button variant="outline">
								<BarChart3 className="mr-2 h-4 w-4" />
								Report
							</Button>
						)}
					</div>
				</div>

				{/* Progress Bar */}
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Processing Progress</span>
						<span className="font-medium">
							{processedCount}/{totalCount}
						</span>
					</div>
					<Progress value={processingPercentage} className="h-2" />
				</div>
			</div>

			{/* Answer Papers List */}
			<div className="space-y-4">
				<div>
					<h2 className="font-semibold text-lg">Answer Papers</h2>
					<p className="text-muted-foreground text-sm">
						Click on a paper to view details. Processing status is updated in
						real-time.
					</p>
				</div>

				{answerPapers.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<div className="mb-4 text-5xl">📝</div>
							<h3 className="mb-2 font-semibold text-lg">No answer papers</h3>
							<p className="text-muted-foreground text-sm">
								There are no answer papers for this test yet.
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-2">
						{answerPapers.map((paper) => (
							<Card
								key={paper.id}
								className="cursor-pointer border-primary/50 transition-all hover:shadow-md"
								onClick={() => handlePaperClick(paper.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										handlePaperClick(paper.id);
									}
								}}
								role="button"
								tabIndex={0}
							>
								<CardContent className="flex items-center justify-between p-4">
									<div className="flex flex-1 items-center gap-4">
										<FileText className="h-5 w-5 text-muted-foreground" />
										<div className="flex-1">
											<p className="font-medium">{paper.student_name}</p>
											<p className="text-muted-foreground text-xs">
												{new Date(paper.created_at).toLocaleDateString()} •{" "}
												{paper.total_score || 0} / {paper.max_score || 0} points
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										{/* Processing Status */}
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

										{/* Grade Badge */}
										{paper.grade && (
											<Badge variant="secondary">{paper.grade}</Badge>
										)}

										{/* Delete Button */}
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
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={deleteConfirm !== null}
				onOpenChange={(open) => {
					if (!open) {
						setDeleteConfirm(null);
					}
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Answer Paper</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this answer paper? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="rounded-lg bg-destructive/10 p-3 text-sm">
						<p className="font-medium text-destructive">
							This will permanently remove the paper and all associated data.
						</p>
					</div>
					<div className="flex justify-end gap-2">
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (deleteConfirm) {
									handleConfirmDelete(deleteConfirm);
								}
							}}
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
