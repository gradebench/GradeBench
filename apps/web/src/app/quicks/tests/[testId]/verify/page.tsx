"use client";

import { Badge } from "@gb/ui/src/components/ui/badge";
import { Button } from "@gb/ui/src/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@gb/ui/src/components/ui/card";
import { Input } from "@gb/ui/src/components/ui/input";
import { Textarea } from "@gb/ui/src/components/ui/textarea";
import { cn } from "@gb/ui/src/lib/utils";
import {
	ArrowLeft,
	CheckCircle2,
	Edit2,
	ExternalLink,
	Loader2,
	MessageSquare,
	ThumbsDown,
	ThumbsUp,
	Zap,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	type AnswerPaper,
	getAnswerPapersByAcademicTest,
} from "@/lib/answer-papers-api";
import { GRADE_API_BASE } from "@/lib/api";

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

export default function VerifyPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const router = useRouter();
	const testId = params?.testId as string;
	const paperId = searchParams?.get("paperId");

	const [paper, setPaper] = useState<AnswerPaper | null>(null);
	const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
	const [questions, setQuestions] = useState<QuestionEvaluation[]>([]);
	const [generalFeedback, setGeneralFeedback] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isVerifying, setIsVerifying] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadData = async () => {
			if (!testId) {
				setError("Missing test ID");
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				// 1. Fetch paper details
				const papers = await getAnswerPapersByAcademicTest(testId);

				let foundPaper: AnswerPaper | undefined;
				if (paperId) {
					foundPaper = papers.find((p) => p.id === paperId);
				} else {
					// Fallback: Find first evaluated paper
					foundPaper = papers.find((p) => p.processed_document_url);
				}

				if (!foundPaper) {
					setError("No suitable paper found for verification.");
					return;
				}

				setPaper(foundPaper);

				// 2. Fetch evaluation JSON
				if (foundPaper.processed_document_url) {
					const res = await fetch(foundPaper.processed_document_url);
					if (!res.ok) throw new Error("Failed to fetch evaluation data");
					const data: EvaluationData = await res.json();

					setEvaluation(data);
					setQuestions(data.question_evaluations || []);
					setGeneralFeedback("");
				} else {
					setError("Evaluation data not available yet");
				}
			} catch (err) {
				console.error(err);
				setError("Failed to load verification data");
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [testId, paperId]);

	const [manualTotalScore, setManualTotalScore] = useState<string>("");
	const [manualGrade, setManualGrade] = useState<string>("");

	useEffect(() => {
		if (evaluation) {
			setManualTotalScore(
				evaluation.overall_score.total_marks_awarded.toString(),
			);
			setManualGrade(evaluation.overall_score.grade);
		}
	}, [evaluation]);

	const handleScoreChange = (index: number, newScore: string) => {
		const score = parseFloat(newScore);
		if (Number.isNaN(score)) return;

		setQuestions((prev) => {
			const updated = prev.map((q, i) =>
				i === index ? { ...q, marks_awarded: score } : q,
			);
			// Update manual total score when individual questions change
			const newTotal = updated.reduce((sum, q) => sum + q.marks_awarded, 0);
			setManualTotalScore(newTotal.toString());
			return updated;
		});
	};

	const totalMarksAwarded = questions.reduce(
		(sum, q) => sum + q.marks_awarded,
		0,
	);

	const totalMarksPossible =
		evaluation?.overall_score?.total_marks_possible || 0;

	// Use manual total score for percentage calculation if valid number
	const currentTotalScore = parseFloat(manualTotalScore) || totalMarksAwarded;

	const percentage =
		totalMarksPossible > 0 ? (currentTotalScore / totalMarksPossible) * 100 : 0;

	const handleVerify = async () => {
		if (!paper?.id) {
			toast.error("No paper ID found");
			return;
		}

		setIsVerifying(true);

		try {
			const updatedMarksStr = questions
				.map((q) => `Q${q.question_number}: ${q.marks_awarded}`)
				.join(", ");

			const payload = {
				review_comment: `Updated Marks: ${updatedMarksStr} from the before marks and the updated Score: ${manualTotalScore} and Grade: ${manualGrade}. Feedback: ${generalFeedback}`,
			};

			const response = await fetch(
				`${GRADE_API_BASE}/evaluations/${paper.id}/review`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to submit review");
			}

			toast.success("Calibration verified! Starting batch automation...");

			// Mark calibration as verified in local storage so dashboard knows
			if (testId) {
				localStorage.setItem(`calibration_verified_${testId}`, "true");
			}

			setTimeout(() => {
				router.push(`/quicks/tests/${testId}/evaluate`);
			}, 1500);
		} catch (error) {
			console.error(error);
			toast.error("Failed to verify paper");
			setIsVerifying(false);
		}
	};

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
			{/* Header */}
			<header className="flex h-16 items-center justify-between border-border border-b bg-background px-6 shadow-sm">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}
						className="gap-2 text-muted-foreground hover:bg-muted hover:text-foreground"
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="hidden sm:inline">Back</span>
					</Button>
					<div className="hidden h-6 w-px bg-border sm:block" />
					<div>
						<h1 className="font-bold text-foreground text-lg leading-tight">
							Verification
						</h1>
						<div className="flex items-center gap-2 text-muted-foreground text-xs">
							<Badge
								variant="outline"
								className="border-primary/20 bg-primary/5 text-primary"
							>
								Verifying
							</Badge>
							<span className="text-muted-foreground/50">•</span>
							<span className="font-medium text-foreground">
								{paper.student_name}
							</span>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<Badge
						variant="outline"
						className="border-primary/30 bg-primary/10 px-3 py-1 font-medium text-primary shadow-sm"
					>
						<Zap className="mr-1.5 h-3.5 w-3.5 fill-primary/20" />
						<span className="hidden sm:inline">Calibration Active</span>
						<span className="sm:hidden">Active</span>
					</Badge>
				</div>
			</header>

			{/* Main Content - 3 Columns */}
			<main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
				{/* Left Column: Annotated PDF (45%) - Hidden on mobile */}
				<div className="hidden w-full flex-col border-border border-r bg-muted/40 p-4 lg:flex lg:w-[45%]">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
							Annotated Submission
						</h2>
						<Badge
							variant="secondary"
							className="bg-background text-muted-foreground text-xs shadow-sm"
						>
							PDF View
						</Badge>
					</div>
					<div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-sm">
						{paper.annotated_document_url ? (
							<>
								<iframe
									src={paper.annotated_document_url}
									title="Annotated Submission PDF"
									width="100%"
									height="100%"
									className="h-full w-full"
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

				{/* Middle Column: Evaluation Breakdown (30%) */}
				<div className="flex w-full flex-col border-border border-r bg-background lg:w-[30%]">
					<div className="border-border border-b bg-muted/10 p-4">
						<h2 className="font-bold text-base text-foreground">
							Evaluation Breakdown
						</h2>
						<p className="text-muted-foreground text-xs">
							Review and edit the AI's grading logic.
						</p>
					</div>
					<div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
						{questions.map((q, index) => (
							<Card
								key={index}
								className="overflow-hidden border-border border-l-4 border-l-primary shadow-sm transition-all hover:shadow-md"
							>
								<CardHeader className="border-border border-b bg-muted/30 px-4 py-3 pb-2">
									<div className="flex items-start justify-between">
										<Badge
											variant="outline"
											className="border-border bg-background font-bold text-muted-foreground shadow-sm"
										>
											Q{q.question_number}
										</Badge>
										<div className="flex items-center gap-2">
											<span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
												Marks:
											</span>
											<div className="flex items-center gap-1">
												<Input
													type="number"
													value={q.marks_awarded}
													onChange={(e) =>
														handleScoreChange(index, e.target.value)
													}
													className="h-7 w-16 border-border bg-background text-right font-bold focus-visible:ring-primary"
													max={q.marks_total}
													min={0}
												/>
												<span className="text-muted-foreground text-sm">
													/ {q.marks_total}
												</span>
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4 px-4 py-3">
									<div>
										<p className="mb-1.5 flex items-center gap-1.5 font-bold text-primary text-xs uppercase tracking-wide">
											<Zap className="h-3.5 w-3.5 fill-primary/20" /> AI Summary
										</p>
										<p className="text-foreground text-sm leading-relaxed">
											{q.feedback.summary}
										</p>
									</div>

									<div className="space-y-3 pt-2">
										{q.feedback.strengths &&
											q.feedback.strengths.length > 0 && (
												<div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-2.5">
													<p className="mb-1.5 flex items-center gap-1.5 font-bold text-emerald-600 text-xs uppercase dark:text-emerald-500">
														<ThumbsUp className="h-3.5 w-3.5" /> Strengths
													</p>
													<ul className="space-y-1">
														{q.feedback.strengths.map((s, i) => (
															<li
																key={i}
																className="flex gap-2 text-muted-foreground text-xs"
															>
																<span className="text-emerald-500">•</span>
																{s}
															</li>
														))}
													</ul>
												</div>
											)}
										{q.feedback.weaknesses &&
											q.feedback.weaknesses.length > 0 && (
												<div className="rounded-md border border-rose-500/20 bg-rose-500/5 p-2.5">
													<p className="mb-1.5 flex items-center gap-1.5 font-bold text-rose-600 text-xs uppercase dark:text-rose-500">
														<ThumbsDown className="h-3.5 w-3.5" /> Weaknesses
													</p>
													<ul className="space-y-1">
														{q.feedback.weaknesses.map((w, i) => (
															<li
																key={i}
																className="flex gap-2 text-muted-foreground text-xs"
															>
																<span className="text-rose-500">•</span>
																{w}
															</li>
														))}
													</ul>
												</div>
											)}
										{q.feedback.suggestions &&
											q.feedback.suggestions.length > 0 && (
												<div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-2.5">
													<p className="mb-1.5 flex items-center gap-1.5 font-bold text-amber-600 text-xs uppercase dark:text-amber-500">
														<Edit2 className="h-3.5 w-3.5" /> Suggestions
													</p>
													<ul className="space-y-1">
														{q.feedback.suggestions.map((s, i) => (
															<li
																key={i}
																className="flex gap-2 text-muted-foreground text-xs"
															>
																<span className="text-amber-500">•</span>
																{s}
															</li>
														))}
													</ul>
												</div>
											)}
									</div>

									{/* Annotations / Specific Comments */}
									{q.annotations && q.annotations.length > 0 && (
										<div className="mt-4 border-t pt-3">
											<p className="mb-2 flex items-center gap-1 font-medium text-muted-foreground text-xs">
												<MessageSquare className="h-3 w-3" /> Specific Comments
											</p>
											<div className="space-y-2">
												{q.annotations.map((annot, i) => (
													<div
														key={i}
														className="rounded-md border bg-muted/30 p-2 text-xs"
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
														<p className="text-muted-foreground">
															{annot.text_content}
														</p>
													</div>
												))}
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Right Column: Summary & Controls (25%) */}
				<div className="flex w-full flex-col space-y-4 border-border border-l bg-muted/10 p-4 lg:w-[25%]">
					{/* Summary Card */}
					<Card className="border-border shadow-sm">
						<CardHeader className="border-border border-b bg-muted/20 px-4 py-3 pb-2">
							<CardTitle className="font-bold text-base text-foreground">
								Grading Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 p-4">
							<div className="flex items-end justify-between">
								<div>
									<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
										Total Score
									</p>
									<div className="flex items-baseline gap-2">
										<Input
											type="number"
											value={manualTotalScore}
											onChange={(e) => setManualTotalScore(e.target.value)}
											className="h-10 w-24 border-border bg-background font-black text-2xl focus-visible:ring-primary"
										/>
										<span className="font-medium text-muted-foreground text-sm">
											/ {totalMarksPossible}
										</span>
									</div>
								</div>
								<div
									className={cn(
										"font-black text-xl",
										percentage >= 80
											? "text-emerald-500"
											: percentage >= 50
												? "text-amber-500"
												: "text-rose-500",
									)}
								>
									{Math.round(percentage)}%
								</div>
							</div>

							<div className="border-border border-t pt-3">
								<div className="flex items-center justify-between">
									<span className="font-bold text-muted-foreground text-xs uppercase">
										Grade
									</span>
									<Input
										value={manualGrade}
										onChange={(e) => setManualGrade(e.target.value)}
										className="h-8 w-20 border-border bg-background text-center font-bold focus-visible:ring-primary"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* General Feedback */}
					<div className="flex flex-1 flex-col">
						<label
							htmlFor="general-feedback"
							className="mb-2 font-bold text-muted-foreground text-xs uppercase tracking-wide"
						>
							Evaluator Feedback
						</label>
						<Textarea
							id="general-feedback"
							placeholder="Enter your feedback manually..."
							className="flex-1 resize-none border-border bg-background focus-visible:ring-primary"
							value={generalFeedback}
							onChange={(e) => setGeneralFeedback(e.target.value)}
						/>
					</div>

					{/* Actions */}
					<div className="space-y-3 pt-2">
						<Button
							className="h-12 w-full bg-primary font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
							onClick={handleVerify}
							disabled={isVerifying}
						>
							{isVerifying ? (
								<>
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									Verifying...
								</>
							) : (
								<>
									<CheckCircle2 className="mr-2 h-5 w-5" />
									Verify & Save Calibration
								</>
							)}
						</Button>
						<div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-center">
							<p className="font-medium text-amber-600 text-xs dark:text-amber-500">
								Verifying this paper will lock the grading standard for the
								remaining batch.
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
