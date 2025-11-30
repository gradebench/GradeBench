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
import { Card, CardContent, CardHeader } from "@gb/ui/src/components/ui/card";
import { Progress } from "@gb/ui/src/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@gb/ui/src/components/ui/table";
import {
	AlertCircle,
	BarChart3,
	CheckCircle2,
	Clock,
	Dices,
	Eye,
	FileCheck,
	FileText,
	Loader2,
	RefreshCw,
	Upload,
	X,
	Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	type AnswerPaper,
	annotateAnswerPaper,
	deleteAnswerPaper,
	evaluateAnswerPaper,
	getAnswerPapersByAcademicTest,
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
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isAutomating, setIsAutomating] = useState(false);
	const [evaluatingPapers, setEvaluatingPapers] = useState<Set<string>>(
		new Set(),
	);
	const [hasAutoEvaluatedFirst, setHasAutoEvaluatedFirst] = useState(false);
	const [calibrationPaperId, setCalibrationPaperId] = useState<string | null>(
		null,
	);
	const [isCalibrationVerified, setIsCalibrationVerified] = useState(false);

	const isAnyProcessing = answerPapers.some(
		(p) => p.digitized_document_url === null,
	);
	const isAllDigitized =
		answerPapers.length > 0 &&
		answerPapers.every((p) => p.digitized_document_url !== null);
	const hasAnyEvaluated = answerPapers.some(
		(p) => p.processed_document_url !== null,
	);
	const isAllEvaluated =
		answerPapers.length > 0 &&
		answerPapers.every((p) => p.processed_document_url !== null);

	const processingStatus = isAnyProcessing ? "Processing" : "Digitized";
	const processedCount = answerPapers.filter(
		(p) => p.digitized_document_url !== null,
	).length;
	const totalCount = answerPapers.length;
	const processingPercentage =
		totalCount > 0 ? (processedCount / totalCount) * 100 : 0;

	const fetchPapers = useCallback(async () => {
		try {
			const updated = await getAnswerPapersByAcademicTest(testId);
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
		if (!isAnyProcessing) return;
		const pollInterval = setInterval(fetchPapers, 10000);
		return () => clearInterval(pollInterval);
	}, [isAnyProcessing, fetchPapers]);

	const pickRandomPaper = useCallback(
		(papers: AnswerPaper[], excludeId?: string) => {
			const candidates = papers.filter(
				(p) =>
					p.digitized_document_url !== null &&
					p.processed_document_url === null && // Not yet evaluated
					p.id !== excludeId,
			);
			if (candidates.length === 0) return null;
			const randomIndex = Math.floor(Math.random() * candidates.length);
			return candidates[randomIndex];
		},
		[],
	);

	useEffect(() => {
		if (!isAllDigitized || hasAutoEvaluatedFirst || calibrationPaperId) return;

		// If some papers are already evaluated, skip calibration
		if (answerPapers.some((p) => p.processed_document_url !== null)) {
			setHasAutoEvaluatedFirst(true);
			return;
		}

		const randomPaper = pickRandomPaper(answerPapers);
		if (randomPaper) {
			setCalibrationPaperId(randomPaper.id);
			setHasAutoEvaluatedFirst(true);

			console.log(`🎲 Selected random paper: ${randomPaper.student_name}`);
			toast.info(`Calibrating with ${randomPaper.student_name}...`);

			const calibrate = async () => {
				setEvaluatingPapers((prev) => new Set(prev).add(randomPaper.id));
				try {
					await evaluateAnswerPaper(randomPaper.id, randomPaper.student_id);
					await annotateAnswerPaper(randomPaper.id, randomPaper.student_id);
					toast.success(`Calibration paper ready: ${randomPaper.student_name}`);
				} catch (error) {
					console.error(error);
					toast.error(`Failed to calibrate ${randomPaper.student_name}`);
				} finally {
					setEvaluatingPapers((prev) => {
						const newSet = new Set(prev);
						newSet.delete(randomPaper.id);
						return newSet;
					});
					fetchPapers();
				}
			};
			calibrate();
		}
	}, [
		isAllDigitized,
		hasAutoEvaluatedFirst,
		calibrationPaperId,
		answerPapers,
		pickRandomPaper,
		fetchPapers,
	]);

	const handleReshuffle = async () => {
		if (!calibrationPaperId) return;

		const newPaper = pickRandomPaper(answerPapers, calibrationPaperId);
		if (!newPaper) {
			toast.error("No other pending papers available to shuffle.");
			return;
		}

		setCalibrationPaperId(newPaper.id);
		setIsCalibrationVerified(false); // Reset verification

		toast.info(`Reshuffling... New candidate: ${newPaper.student_name}`);
		setEvaluatingPapers((prev) => new Set(prev).add(newPaper.id));

		try {
			await evaluateAnswerPaper(newPaper.id, newPaper.student_id);
			await annotateAnswerPaper(newPaper.id, newPaper.student_id);
			toast.success(`Now calibrating: ${newPaper.student_name}`);
		} catch (error) {
			console.error(error);
			toast.error("Failed to evaluate new calibration paper");
		} finally {
			setEvaluatingPapers((prev) => {
				const newSet = new Set(prev);
				newSet.delete(newPaper.id);
				return newSet;
			});
			fetchPapers();
		}
	};

	const handleAutomateRest = async () => {
		setIsAutomating(true);
		const pendingPapers = answerPapers.filter(
			(p) =>
				p.digitized_document_url !== null &&
				p.processed_document_url === null &&
				p.id !== calibrationPaperId,
		);

		if (pendingPapers.length === 0) {
			toast.info("No pending papers to automate.");
			setIsAutomating(false);
			return;
		}

		toast.info(
			`Starting batch evaluation for ${pendingPapers.length} papers...`,
		);

		let successCount = 0;
		let failureCount = 0;

		for (const paper of pendingPapers) {
			setEvaluatingPapers((prev) => new Set(prev).add(paper.id));
			try {
				if (paper.processed_document_url === null) {
					await evaluateAnswerPaper(paper.id, paper.student_id);
				}
				if (paper.annotated_document_url === null) {
					await annotateAnswerPaper(paper.id, paper.student_id);
				}
				successCount++;
			} catch (error) {
				failureCount++;
				console.error(`❌ Error processing ${paper.student_name}:`, error);
			} finally {
				setEvaluatingPapers((prev) => {
					const newSet = new Set(prev);
					newSet.delete(paper.id);
					return newSet;
				});
			}
			// Small delay to prevent overwhelming the server
			await new Promise((resolve) => setTimeout(resolve, 500));
		}

		if (successCount > 0) {
			toast.success(`Batch complete: ${successCount} processed.`);
		}
		if (failureCount > 0) {
			toast.warning(`${failureCount} papers failed to process.`);
		}

		setIsAutomating(false);
		fetchPapers();
	};

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

	const handleVerifyClick = () => {
		// If we are in calibration mode, mark as verified
		if (calibrationPaperId && !isCalibrationVerified) {
			setIsCalibrationVerified(true);
			toast.success(
				"Calibration paper verified! You can now automate the rest.",
			);
		}
		const query = calibrationPaperId ? `?paperId=${calibrationPaperId}` : "";
		router.push(`/quicks/tests/${testId}/verify${query}`);
	};

	return (
		<div className="container mx-auto max-w-7xl space-y-8 p-6 py-8">
			{/* Header Section */}
			<Card className="shadow-sm">
				<CardHeader className="space-y-6 pb-8">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="space-y-3">
							<h1 className="font-bold text-4xl tracking-tight">{testName}</h1>
							<div className="flex flex-wrap items-center gap-4">
								<Badge
									variant={isAnyProcessing ? "secondary" : "default"}
									className="gap-2 px-3 py-1.5 text-sm"
								>
									{isAnyProcessing ? (
										<Clock className="h-3.5 w-3.5 animate-pulse" />
									) : (
										<CheckCircle2 className="h-3.5 w-3.5" />
									)}
									{processingStatus}
								</Badge>
								<span className="font-medium text-base text-muted-foreground">
									{processedCount} / {totalCount} papers digitized
								</span>
							</div>
						</div>

						<div className="flex flex-wrap gap-3">
							{hasAnyEvaluated && !isAllEvaluated && (
								<Button
									variant="default"
									size="default"
									onClick={handleAutomateRest}
									disabled={isAutomating || evaluatingPapers.size > 0}
									className="bg-green-600 font-semibold shadow-sm hover:bg-green-700"
								>
									<Zap className="mr-2 h-5 w-5" />
									Automate Rest
								</Button>
							)}
							<Button
								variant="outline"
								size="default"
								onClick={handleRefresh}
								disabled={isRefreshing}
								className="shadow-sm"
							>
								<RefreshCw
									className={`mr-2 h-5 w-5 ${
										isRefreshing ? "animate-spin" : ""
									}`}
								/>
								Refresh
							</Button>
							<Button
								variant="outline"
								size="default"
								onClick={onUploadMore}
								disabled={isAutomating}
								className="shadow-sm"
							>
								<Upload className="mr-2 h-5 w-5" />
								Upload More
							</Button>
						</div>
					</div>

					{/* Progress Bar */}
					{totalCount > 0 && (
						<div className="space-y-3 pt-4">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-base text-muted-foreground">
									Digitization Progress
								</span>
								<span className="font-bold text-lg">
									{Math.round(processingPercentage)}%
								</span>
							</div>
							<Progress value={processingPercentage} className="h-3" />
						</div>
					)}
				</CardHeader>
			</Card>

			{/* Calibration Banner */}
			{calibrationPaperId && !isCalibrationVerified && hasAnyEvaluated && (
				<Card className="border-2 border-amber-300 bg-amber-50 shadow-md">
					<CardContent className="p-6">
						<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
							<div className="flex items-start gap-4">
								<div className="rounded-full bg-amber-100 p-3">
									<AlertCircle className="h-6 w-6 text-amber-600" />
								</div>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<h3 className="font-semibold text-amber-900 text-lg">
											Calibration Required
										</h3>
										<Badge
											variant="outline"
											className="border-amber-500 bg-amber-100 text-amber-700"
										>
											Step 1 of 2
										</Badge>
									</div>
									<p className="max-w-xl text-amber-800">
										We've selected a random paper (
										<span className="font-medium">
											{
												answerPapers.find((p) => p.id === calibrationPaperId)
													?.student_name
											}
										</span>
										) to calibrate the AI's grading standards. Please review and
										verify the grading for this paper before automating the
										rest.
									</p>
								</div>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row">
								<Button
									variant="outline"
									onClick={handleReshuffle}
									disabled={isAutomating || evaluatingPapers.size > 0}
									className="border-amber-300 bg-white text-amber-900 hover:bg-amber-50 hover:text-amber-900"
								>
									<Dices className="mr-2 h-4 w-4" />
									Reshuffle Paper
								</Button>
								<Button
									variant="default"
									onClick={() => {
										setIsCalibrationVerified(true);
										toast.success(
											"Calibration verified! Automate Rest button is now available.",
										);
									}}
									className="bg-amber-600 text-white hover:bg-amber-700"
								>
									<CheckCircle2 className="mr-2 h-4 w-4" />
									Verify & Save
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Answer Papers List */}
			<Card className="shadow-sm">
				<CardHeader className="pb-6">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h2 className="font-bold text-2xl">Answer Papers</h2>
							<p className="text-base text-muted-foreground">
								Click on a digitized paper to view and verify details
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{answerPapers.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="mb-4 rounded-full bg-muted p-6">
								<FileText className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="mb-2 font-semibold text-lg">
								No Answer Papers Yet
							</h3>
							<p className="mb-6 max-w-sm text-muted-foreground text-sm">
								Upload answer papers to begin the digitization and evaluation
								process.
							</p>
							<Button onClick={onUploadMore} size="lg">
								<Upload className="mr-2 h-4 w-4" />
								Upload Papers
							</Button>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-12">#</TableHead>
										<TableHead>Student Name</TableHead>
										<TableHead className="text-center">Status</TableHead>
										<TableHead className="text-center">Digitized</TableHead>
										<TableHead className="text-center">Evaluated</TableHead>
										<TableHead className="text-center">Annotated</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{answerPapers.map((paper, index) => {
										const isEvaluating = evaluatingPapers.has(paper.id);
										const isDigitized = paper.digitized_document_url !== null;
										const isEvaluated = paper.processed_document_url !== null;
										const isAnnotated = paper.annotated_document_url !== null;

										const isCalibrationTarget = paper.id === calibrationPaperId;

										return (
											<TableRow
												key={paper.id}
												className={`${
													isDigitized
														? "cursor-pointer hover:bg-muted/50"
														: "opacity-60"
												} ${isEvaluating ? "bg-blue-50" : ""} ${
													isCalibrationTarget ? "bg-amber-50" : ""
												}`}
												onClick={() => {
													if (isDigitized && !isEvaluating) {
														// If it's the calibration paper, clicking it should verify it
														if (isCalibrationTarget && !isCalibrationVerified) {
															handleVerifyClick();
														} else {
															router.push(
																`/quicks/tests/${testId}/result/${paper.id}`,
															);
														}
													}
												}}
											>
												<TableCell className="font-medium">
													{index + 1}
													{isCalibrationTarget && (
														<Badge
															variant="outline"
															className="ml-2 border-amber-500 text-amber-700"
														>
															Calibration
														</Badge>
													)}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-3">
														<div
															className={`flex h-10 w-10 items-center justify-center rounded-full ${
																isDigitized
																	? "bg-green-100 text-green-700"
																	: "bg-orange-100 text-orange-700"
															}`}
														>
															{paper.student_name.charAt(0).toUpperCase()}
														</div>
														<div>
															<div className="font-medium">
																{paper.student_name}
															</div>
															<div className="text-muted-foreground text-xs">
																ID: {paper.id.slice(0, 8)}...
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell className="text-center">
													{isEvaluating ? (
														<Badge
															variant="secondary"
															className="gap-1.5 bg-blue-100 text-blue-700"
														>
															<Loader2 className="h-3 w-3 animate-spin" />
															Evaluating
														</Badge>
													) : isEvaluated ? (
														<Badge
															variant="default"
															className="gap-1.5 bg-green-100 text-green-700"
														>
															<CheckCircle2 className="h-3 w-3" />
															Evaluated
														</Badge>
													) : isDigitized ? (
														<Badge variant="secondary" className="gap-1.5">
															<FileCheck className="h-3 w-3" />
															Ready
														</Badge>
													) : (
														<Badge
															variant="secondary"
															className="gap-1.5 bg-orange-100 text-orange-700"
														>
															<Clock className="h-3 w-3" />
															Processing
														</Badge>
													)}
												</TableCell>
												<TableCell className="text-center">
													{isDigitized ? (
														<CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
													) : (
														<div className="flex items-center justify-center gap-2">
															<div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
															<span className="text-muted-foreground text-xs">
																Digitizing...
															</span>
														</div>
													)}
												</TableCell>
												<TableCell className="text-center">
													{isEvaluated ? (
														<CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
													) : (
														<span className="text-muted-foreground">—</span>
													)}
												</TableCell>
												<TableCell className="text-center">
													{isAnnotated ? (
														<CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
													) : (
														<span className="text-muted-foreground">—</span>
													)}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-2">
														{isDigitized && (
															<Button
																variant="ghost"
																size="sm"
																onClick={(e) => {
																	e.stopPropagation();
																	router.push(
																		`/quicks/tests/${testId}/result/${paper.id}`,
																	);
																}}
															>
																<Eye className="h-4 w-4" />
															</Button>
														)}
														<Button
															variant="ghost"
															size="sm"
															onClick={(e) => {
																e.stopPropagation();
																handleDeleteClick(paper.id);
															}}
															className="text-red-600 hover:bg-red-50 hover:text-red-700"
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Action Buttons */}
			{totalCount > 0 && (
				<Card className="shadow-sm">
					<CardContent className="p-8">
						<div className="flex flex-col gap-4 sm:flex-row">
							<Button
								variant="default"
								size="lg"
								onClick={handleVerifyClick}
								disabled={!hasAnyEvaluated}
								className={`flex-1 py-6 font-semibold text-base shadow-md ${
									calibrationPaperId && !isCalibrationVerified
										? "bg-amber-600 hover:bg-amber-700"
										: ""
								}`}
							>
								<Eye className="mr-2 h-6 w-6" />
								{calibrationPaperId && !isCalibrationVerified
									? "Verify Calibration Paper"
									: "View Papers"}
							</Button>
							{hasAnyEvaluated && (
								<Button
									variant="outline"
									size="lg"
									onClick={() => router.push(`/quicks/tests/${testId}/report`)}
									className="flex-1 py-6 font-semibold text-base shadow-sm"
								>
									<BarChart3 className="mr-2 h-6 w-6" />
									View Report
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Info Banners */}
			{!isAllDigitized && totalCount > 0 && (
				<Card className="border-2 border-blue-200 bg-blue-50 shadow-sm">
					<CardContent className="flex items-start gap-3 py-4">
						<AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
						<div className="text-sm">
							<p className="font-medium text-blue-900">
								Papers are being digitized
							</p>
							<p className="text-blue-700">
								The page will automatically refresh. You can start evaluation
								once all papers are digitized.
							</p>
						</div>
					</CardContent>
				</Card>
			)}

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
