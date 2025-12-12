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
			<header className="flex h-14 items-center justify-between border-b px-3 sm:h-16 sm:px-6">
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
						<h1 className="font-semibold text-base sm:text-lg">Verification</h1>
						<p className="text-muted-foreground text-xs">
							<span className="hidden sm:inline">Verifying • </span>
							Student: {paper.student_name}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Badge
						variant="outline"
						className="border-blue-500 bg-blue-500/10 text-blue-600"
					>
						<span className="hidden sm:inline">Calibration Active</span>
						<span className="sm:hidden">Active</span>
					</Badge>
				</div>
			</header>

			{/* Main Content - 3 Columns */}
			<main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
				{/* Left Column: Annotated PDF (45%) - Hidden on mobile */}
				<div className="hidden w-full flex-col border-r bg-muted/30 p-2 lg:flex lg:w-[45%] lg:p-4">
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
							<div className="flex flex-col items-center gap-2 text-slate-500">
								<Loader2 className="h-8 w-8 animate-spin" />
								<p>Loading PDF...</p>
							</div>
						)}
					</div>
				</div>

				{/* Middle Column: Evaluation Breakdown (30%) */}
				<div className="flex w-full flex-col border-r bg-background lg:w-[30%]">
					<div className="border-b bg-muted/10 p-3 sm:p-4">
						<h2 className="font-semibold text-base sm:text-lg">
							Evaluation Breakdown
						</h2>
						<p className="text-muted-foreground text-xs">
							Review and edit the AI's grading logic.
						</p>
					</div>
					<div className="flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-4">
						{questions.map((q, index) => (
							<Card
								key={index}
								className="overflow-hidden border-l-4 border-l-blue-500"
							>
								<CardHeader className="bg-muted/5 px-4 py-3 pb-2">
									<div className="flex items-start justify-between">
										<Badge variant="outline" className="bg-background">
											Q{q.question_number}
										</Badge>
										<div className="flex items-center gap-2">
											<span className="text-muted-foreground text-xs">
												Marks:
											</span>
											<div className="flex items-center gap-1">
												<Input
													type="number"
													value={q.marks_awarded}
													onChange={(e) =>
														handleScoreChange(index, e.target.value)
													}
													className="h-7 w-16 text-right font-medium"
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
								<CardContent className="space-y-3 px-4 py-3">
									<div>
										<p className="mb-1 flex items-center gap-1 font-medium text-blue-600 text-xs">
											<Zap className="h-3 w-3" /> AI Summary
										</p>
										<p className="text-muted-foreground text-sm leading-relaxed">
											{q.feedback.summary}
										</p>
									</div>

									<div className="space-y-3 pt-2">
										{q.feedback.strengths &&
											q.feedback.strengths.length > 0 && (
												<div>
													<p className="mb-1 flex items-center gap-1 font-medium text-green-400 text-xs">
														<ThumbsUp className="h-3 w-3" /> Strengths
													</p>
													<ul className="list-inside list-disc text-blue-100 text-xs">
														{q.feedback.strengths.map((s, i) => (
															<li key={i}>{s}</li>
														))}
													</ul>
												</div>
											)}
										{q.feedback.weaknesses &&
											q.feedback.weaknesses.length > 0 && (
												<div>
													<p className="mb-1 flex items-center gap-1 font-medium text-red-400 text-xs">
														<ThumbsDown className="h-3 w-3" /> Weaknesses
													</p>
													<ul className="list-inside list-disc text-blue-100 text-xs">
														{q.feedback.weaknesses.map((w, i) => (
															<li key={i}>{w}</li>
														))}
													</ul>
												</div>
											)}
										{q.feedback.suggestions &&
											q.feedback.suggestions.length > 0 && (
												<div>
													<p className="mb-1 flex items-center gap-1 font-medium text-amber-400 text-xs">
														<Edit2 className="h-3 w-3" /> Suggestions
													</p>
													<ul className="list-inside list-disc text-blue-100 text-xs">
														{q.feedback.suggestions.map((s, i) => (
															<li key={i}>{s}</li>
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
				<div className="flex w-full flex-col space-y-3 bg-muted/10 p-3 sm:space-y-4 sm:p-4 lg:w-[25%]">
					{/* Summary Card */}
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm sm:text-base">
								Grading Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 sm:space-y-4">
							<div className="flex items-end justify-between">
								<div>
									<p className="text-muted-foreground text-sm">Total Score</p>
									<div className="flex items-baseline gap-2">
										<Input
											type="number"
											value={manualTotalScore}
											onChange={(e) => setManualTotalScore(e.target.value)}
											className="h-10 w-24 font-bold text-2xl"
										/>
										<span className="font-normal text-muted-foreground text-sm">
											/ {totalMarksPossible}
										</span>
									</div>
								</div>
								<div
									className={`font-bold text-xl ${
										percentage >= 80
											? "text-green-400"
											: percentage >= 50
												? "text-amber-400"
												: "text-red-400"
									}`}
								>
									{Math.round(percentage)}%
								</div>
							</div>

							<div className="border-t pt-2">
								<div className="mb-2 flex items-center justify-between">
									<span className="font-medium text-sm">Grade</span>
									<Input
										value={manualGrade}
										onChange={(e) => setManualGrade(e.target.value)}
										className="h-8 w-20 text-center font-bold"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* General Feedback */}
					<div className="flex flex-1 flex-col">
						<label
							htmlFor="general-feedback"
							className="mb-2 font-medium text-sm"
						>
							Evaluator Feedback
						</label>
						<Textarea
							id="general-feedback"
							placeholder="Enter your feedback manually..."
							className="flex-1 resize-none bg-white"
							value={generalFeedback}
							onChange={(e) => setGeneralFeedback(e.target.value)}
						/>
					</div>

					{/* Actions */}
					<div className="space-y-3 pt-2">
						<Button
							className="h-12 w-full bg-green-600 text-base hover:bg-green-700"
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
									Verify & Save
								</>
							)}
						</Button>
						<p className="px-2 text-center text-muted-foreground text-xs">
							Verifying this paper will lock the grading standard for the
							remaining batch.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
