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
	AlertTriangle,
	ArrowLeft,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfidenceBadge } from "@/components/evaluation/ConfidenceBadge";
import { StatsCard } from "@/components/evaluation/StatsCard";
import { useWebSocket } from "@/hooks/useWebSocket";
import {
	type AnswerPaper,
	annotateAnswerPaper,
	deleteAnswerPaper,
	evaluateAnswerPaper,
	getAnswerPapersByAcademicTest,
	getConfidenceScoreFromDocument,
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
	const [filterStatus, setFilterStatus] = useState<
		"all" | "needs-review" | "approved" | "manual"
	>("all");
	const [confidenceScores, setConfidenceScores] = useState<
		Record<string, number>
	>({});

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

	const getConfidenceScore = useCallback(
		(paper: AnswerPaper): number => {
			if (!paper.digitized_document_url) return 0;
			if (!paper.processed_document_url) return 0;
			// Use fetched confidence score from JSON document
			return confidenceScores[paper.id] ?? 0;
		},
		[confidenceScores],
	);

	// Fetch confidence scores from processed JSON documents
	useEffect(() => {
		const fetchConfidenceScores = async () => {
			const scores: Record<string, number> = {};

			for (const paper of answerPapers) {
				if (
					paper.processed_document_url &&
					confidenceScores[paper.id] === undefined
				) {
					const score = await getConfidenceScoreFromDocument(
						paper.processed_document_url,
					);
					if (score !== null) {
						scores[paper.id] = score;
					}
				}
			}

			if (Object.keys(scores).length > 0) {
				setConfidenceScores((prev) => ({ ...prev, ...scores }));
			}
		};

		fetchConfidenceScores();
	}, [answerPapers, confidenceScores]);
	const papersWithConfidence = useMemo(() => {
		return answerPapers.map((paper) => ({
			...paper,
			confidence: getConfidenceScore(paper),
		}));
	}, [answerPapers, getConfidenceScore]);

	const filteredPapers = useMemo(() => {
		if (filterStatus === "all") return papersWithConfidence;
		if (filterStatus === "needs-review") {
			return papersWithConfidence.filter(
				(p) => p.confidence < 70 && p.confidence >= 40,
			);
		}
		if (filterStatus === "manual") {
			return papersWithConfidence.filter((p) => p.confidence < 40);
		}
		return papersWithConfidence.filter((p) => p.confidence >= 70);
	}, [papersWithConfidence, filterStatus]);

	const needsReviewCount = papersWithConfidence.filter(
		(p) => p.confidence < 70 && p.confidence >= 40,
	).length;
	const approvedCount = papersWithConfidence.filter(
		(p) => p.confidence >= 70,
	).length;
	const manualCount = papersWithConfidence.filter(
		(p) => p.confidence < 40,
	).length;

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

	useWebSocket(testId, (message) => {
		if (message.type === "status_update") {
			fetchPapers();
		}
	});

	useEffect(() => {
		setAnswerPapers(initialAnswerPapers);
	}, [initialAnswerPapers]);

	useEffect(() => {
		if (!isAnyProcessing) return;
		const pollInterval = setInterval(fetchPapers, 10000);
		return () => clearInterval(pollInterval);
	}, [isAnyProcessing, fetchPapers]);

	const pickUncertainPaper = useCallback(
		(papers: AnswerPaper[], excludeId?: string) => {
			const candidates = papers.filter(
				(p) =>
					p.digitized_document_url !== null &&
					p.processed_document_url === null &&
					p.id !== excludeId,
			);
			if (candidates.length === 0) return null;

			const papersWithUncertainty = candidates.map((p) => ({
				paper: p,
				uncertainty: Math.random(),
			}));

			papersWithUncertainty.sort((a, b) => b.uncertainty - a.uncertainty);
			return papersWithUncertainty[0].paper;
		},
		[],
	);

	useEffect(() => {
		if (!isAllDigitized || hasAutoEvaluatedFirst || calibrationPaperId) return;

		// If some papers are already evaluated, skip calibration
		if (answerPapers.some((p) => p.processed_document_url !== null)) {
			setHasAutoEvaluatedFirst(true);
			// Check if calibration was already verified
			const wasVerified = localStorage.getItem(
				`calibration_verified_${testId}`,
			);
			if (wasVerified === "true") {
				setIsCalibrationVerified(true);
			}
			return;
		}

		const uncertainPaper = pickUncertainPaper(answerPapers);
		if (uncertainPaper) {
			setCalibrationPaperId(uncertainPaper.id);
			setHasAutoEvaluatedFirst(true);

			console.log(
				`🎯 Selected uncertain paper: ${uncertainPaper.student_name}`,
			);
			toast.info(`Smart calibration: ${uncertainPaper.student_name}...`);

			const calibrate = async () => {
				setEvaluatingPapers((prev) => new Set(prev).add(uncertainPaper.id));
				try {
					await evaluateAnswerPaper(
						uncertainPaper.id,
						uncertainPaper.student_id,
					);
					await annotateAnswerPaper(
						uncertainPaper.id,
						uncertainPaper.student_id,
					);
					toast.success(
						`Calibration paper ready: ${uncertainPaper.student_name}`,
					);
				} catch (error) {
					console.error(error);
					toast.error(`Failed to calibrate ${uncertainPaper.student_name}`);
				} finally {
					setEvaluatingPapers((prev) => {
						const newSet = new Set(prev);
						newSet.delete(uncertainPaper.id);
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
		pickUncertainPaper,
		testId,
		fetchPapers,
	]);
	const handleReshuffle = async () => {
		if (!calibrationPaperId) return;

		const newPaper = pickUncertainPaper(answerPapers, calibrationPaperId);
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
			localStorage.setItem(`calibration_verified_${testId}`, "true");
			toast.success(
				"Calibration paper verified! You can now automate the rest.",
			);
		}
		const query = calibrationPaperId ? `?paperId=${calibrationPaperId}` : "";
		router.push(`/quicks/tests/${testId}/verify${query}`);
	};

	return (
		<div className="container mx-auto max-w-7xl space-y-4 p-4 py-4 sm:space-y-6 sm:p-6 sm:py-8 md:space-y-8">
			{/* Header Section */}
			<Card className="shadow-sm">
				<CardHeader className="space-y-4 pb-6 sm:space-y-6 sm:pb-8">
					<div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="space-y-2 sm:space-y-3">
							<div className="flex items-center gap-3">
								<Button
									variant="outline"
									size="sm"
									onClick={() => router.push("/quicks")}
									className="group h-9 gap-2 rounded-lg border-muted-foreground/20 px-3 shadow-sm transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md"
								>
									<ArrowLeft className="group-hover:-translate-x-0.5 h-4 w-4 transition-transform" />
									<span className="hidden sm:inline">Back to Tests</span>
								</Button>
								<div className="h-8 w-px bg-border" />
								<h1 className="font-bold text-2xl tracking-tight sm:text-3xl lg:text-4xl">
									{testName}
								</h1>
							</div>
							<div className="flex flex-wrap items-center gap-2 sm:gap-4">
								<Badge
									variant={isAnyProcessing ? "secondary" : "default"}
									className="gap-2 px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm"
								>
									{isAnyProcessing ? (
										<Clock className="h-3 w-3 animate-pulse sm:h-3.5 sm:w-3.5" />
									) : (
										<CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
									)}
									{processingStatus}
								</Badge>
								<span className="font-medium text-muted-foreground text-sm sm:text-base">
									{processedCount} / {totalCount} papers digitized
								</span>
							</div>
						</div>{" "}
						<div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-3">
							{hasAnyEvaluated && !isAllEvaluated && isCalibrationVerified && (
								<Button
									variant="default"
									size="default"
									onClick={handleAutomateRest}
									disabled={isAutomating || evaluatingPapers.size > 0}
									className="w-full animate-pulse bg-green-600 font-bold shadow-lg hover:bg-green-700 sm:w-auto"
								>
									{isAutomating ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin sm:h-5 sm:w-5" />
											Processing...
										</>
									) : (
										<>
											<Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
											Automate Rest
										</>
									)}
								</Button>
							)}
							<Button
								variant="outline"
								size="default"
								onClick={handleRefresh}
								disabled={isRefreshing}
								className="w-full shadow-sm sm:w-auto"
							>
								<RefreshCw
									className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${
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
								className="w-full shadow-sm sm:w-auto"
							>
								<Upload className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
								Upload More
							</Button>
						</div>
					</div>

					{/* Progress Bar */}
					{totalCount > 0 && (
						<div className="space-y-2 pt-2 sm:space-y-3 sm:pt-4">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-muted-foreground text-sm sm:text-base">
									Digitization Progress
								</span>
								<div className="flex items-center gap-2">
									{!isAllDigitized && (
										<span className="text-muted-foreground text-xs">
											~{Math.ceil((totalCount - processedCount) * 0.5)}min
											remaining
										</span>
									)}
									<span className="font-bold text-base sm:text-lg">
										{Math.round(processingPercentage)}%
									</span>
								</div>
							</div>
							<Progress value={processingPercentage} className="h-2.5 sm:h-3" />
						</div>
					)}
				</CardHeader>
			</Card>
			{/* Stats Overview */}
			{hasAnyEvaluated && (
				<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
					<StatsCard
						icon={CheckCircle2}
						label="High Confidence"
						value={approvedCount}
						color="green"
					/>
					<StatsCard
						icon={AlertTriangle}
						label="Needs Review"
						value={needsReviewCount}
						color="amber"
					/>
					<StatsCard
						icon={AlertCircle}
						label="Manual Review"
						value={manualCount}
						color="red"
					/>
					<StatsCard
						icon={FileCheck}
						label="Total Evaluated"
						value={`${
							answerPapers.filter((p) => p.processed_document_url).length
						}/${totalCount}`}
						color="blue"
					/>
				</div>
			)}
			{/* Calibration Banner */}
			{calibrationPaperId && !isCalibrationVerified && hasAnyEvaluated && (
				<Card className="border-2 border-amber-500 bg-gradient-to-br from-amber-950 via-amber-900 to-orange-950 shadow-lg">
					<CardContent className="p-6">
						<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
							<div className="flex items-start gap-4">
								<div className="animate-pulse rounded-full bg-amber-700 p-3 shadow-lg">
									<AlertCircle className="h-6 w-6 text-amber-100" />
								</div>
								<div className="space-y-2">
									<div className="flex flex-wrap items-center gap-2">
										<h3 className="font-bold text-amber-50 text-lg">
											🎯 Smart Calibration Active
										</h3>
										<Badge
											variant="outline"
											className="border-amber-300 bg-amber-800/50 font-semibold text-amber-100"
										>
											Step 1/2
										</Badge>
									</div>
									<p className="max-w-2xl text-amber-100 text-sm leading-relaxed">
										AI selected{" "}
										<span className="font-bold text-amber-50">
											{
												answerPapers.find((p) => p.id === calibrationPaperId)
													?.student_name
											}
										</span>{" "}
										(highest uncertainty) for calibration. Review this paper to
										teach the AI your grading standards, then automate the rest.
									</p>
								</div>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row">
								<Button
									variant="outline"
									onClick={handleReshuffle}
									disabled={isAutomating || evaluatingPapers.size > 0}
									className="border-amber-300 bg-amber-800/30 text-amber-100 hover:bg-amber-700 hover:text-amber-50"
								>
									<Dices className="mr-2 h-4 w-4" />
									Pick Different Paper
								</Button>
								<Button
									variant="default"
									onClick={handleVerifyClick}
									className="bg-amber-600 font-semibold text-white shadow-md hover:bg-amber-500"
								>
									<CheckCircle2 className="mr-2 h-4 w-4" />
									Verify Calibration
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
			{/* Answer Papers List */}
			<Card className="shadow-sm">
				<CardHeader className="pb-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<h2 className="font-bold text-2xl">Answer Papers</h2>
							<p className="text-base text-muted-foreground">
								Click on a digitized paper to view and verify details
							</p>
						</div>
						{hasAnyEvaluated && (
							<div className="flex flex-wrap gap-2">
								<Button
									variant={filterStatus === "all" ? "default" : "outline"}
									size="sm"
									onClick={() => setFilterStatus("all")}
								>
									All ({totalCount})
								</Button>
								<Button
									variant={filterStatus === "approved" ? "default" : "outline"}
									size="sm"
									onClick={() => setFilterStatus("approved")}
									className={
										filterStatus === "approved"
											? "bg-green-600 hover:bg-green-700"
											: ""
									}
								>
									✅ High Confidence ({approvedCount})
								</Button>
								<Button
									variant={
										filterStatus === "needs-review" ? "default" : "outline"
									}
									size="sm"
									onClick={() => setFilterStatus("needs-review")}
									className={
										filterStatus === "needs-review"
											? "bg-amber-600 hover:bg-amber-700"
											: ""
									}
								>
									⚠️ Needs Review ({needsReviewCount})
								</Button>
								{manualCount > 0 && (
									<Button
										variant={filterStatus === "manual" ? "default" : "outline"}
										size="sm"
										onClick={() => setFilterStatus("manual")}
										className={
											filterStatus === "manual"
												? "bg-red-600 hover:bg-red-700"
												: "border-red-600 text-red-600 hover:bg-red-50"
										}
									>
										🚨 Manual Review ({manualCount})
									</Button>
								)}
							</div>
						)}
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
										<TableHead className="text-center">Confidence</TableHead>
										<TableHead className="text-center">Status</TableHead>
										<TableHead className="text-center">Digitized</TableHead>
										<TableHead className="text-center">Evaluated</TableHead>
										<TableHead className="text-center">Annotated</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredPapers.map((paper, index) => {
										const isEvaluating = evaluatingPapers.has(paper.id);
										const isDigitized = paper.digitized_document_url !== null;
										const isEvaluated = paper.processed_document_url !== null;
										const isAnnotated = paper.annotated_document_url !== null;

										const isCalibrationTarget = paper.id === calibrationPaperId;

										return (
											<TableRow
												key={paper.id}
												className={`transition-all ${
													isDigitized
														? "cursor-pointer hover:bg-muted/50"
														: "opacity-60"
												} ${isEvaluating ? "bg-blue-950/20" : ""} ${
													isCalibrationTarget
														? "border-l-4 border-l-amber-500 bg-amber-950/40 shadow-md"
														: ""
												} ${
													isEvaluated && paper.confidence >= 70
														? "border-l-2 border-l-green-600/30"
														: ""
												} ${
													isEvaluated && paper.confidence < 40
														? "border-l-2 border-l-red-600/30"
														: ""
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
															className="ml-2 border-amber-600 bg-amber-950 text-amber-200"
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
													{isEvaluated && (
														<ConfidenceBadge confidence={paper.confidence} />
													)}
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
			{/* Info Banners */}
			{!isAllDigitized && totalCount > 0 && (
				<Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-950 to-blue-900 shadow-md">
					<CardContent className="flex items-start gap-3 py-4 sm:gap-4">
						<div className="animate-pulse rounded-full bg-blue-700 p-2">
							<AlertCircle className="h-5 w-5 text-blue-100" />
						</div>
						<div className="flex-1 text-sm">
							<p className="font-semibold text-blue-50">
								🔄 Background Processing Active
							</p>
							<p className="text-blue-100">
								Digitizing {totalCount - processedCount} remaining papers.
								Auto-refresh every 10s.
							</p>
						</div>
					</CardContent>
				</Card>
			)}{" "}
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
