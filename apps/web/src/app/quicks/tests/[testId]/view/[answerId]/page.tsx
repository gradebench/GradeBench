"use client";

import { Badge } from "@gb/ui/src/components/ui/badge";
import { Button } from "@gb/ui/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@gb/ui/src/components/ui/card";
import { Progress } from "@gb/ui/src/components/ui/progress";
import { Separator } from "@gb/ui/src/components/ui/separator";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@gb/ui/src/components/ui/tabs";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import {
	AlertCircleIcon,
	AwardIcon,
	CheckCircle2Icon,
	CheckCircleIcon,
	ClockIcon,
	DownloadIcon,
	EditIcon,
	FileTextIcon,
	Loader2Icon,
	TrendingUpIcon,
	UserIcon,
	XCircleIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { GRADE_API_BASE as API_BASE_URL } from "@/lib/api";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Annotation {
	annotation_id: string;
	page_number: number;
	annotation_type: "checkmark" | "circle" | "underline" | "highlight";
	coordinates: Array<{ x: number; y: number }>;
	text_content: string;
	color: string;
	correctness_indicator: "correct" | "incorrect" | "partial";
}

interface QuestionFeedback {
	summary: string;
	tone: string;
	strengths: string[];
	weaknesses: string[];
	suggestions: string[];
}

interface QuestionEvaluation {
	question_number: string;
	marks_awarded: number;
	marks_total: number;
	percentage: number;
	feedback: QuestionFeedback;
	annotations: Annotation[];
}

interface OverallScore {
	total_marks_awarded: number;
	total_marks_possible: number;
	grade: string;
	percentage: number;
}

interface OverallFeedback {
	summary: string;
	key_strengths: string[];
	areas_for_improvement: string[];
}

interface EvaluationResult {
	evaluation_id: string;
	evaluation_timestamp: string;
	evaluation_status: "completed" | "processing" | "failed";
	student_id?: string;
	paper_id: string;
	overall_score: OverallScore;
	overall_feedback: OverallFeedback;
	question_evaluations: QuestionEvaluation[];
}

// ============================================================================
// Constants
// ============================================================================

// Mock data for testing/development
const MOCK_EVALUATION: EvaluationResult = {
	evaluation_timestamp: "2024-07-29T12:34:56.789Z",
	evaluation_id: "c12ed9e3-a2c8-4122-8cc4-0c8aad4572e7",
	evaluation_status: "completed",
	student_id: "student123",
	paper_id: "c12ed9e3-a2c8-4122-8cc4-0c8aad4572e7",
	overall_score: {
		total_marks_awarded: 7.5,
		total_marks_possible: 15,
		grade: "C",
		percentage: 50,
	},
	overall_feedback: {
		summary:
			"The answer demonstrates a basic understanding of the urban planning of the Indus Valley Civilization. The student has mentioned some key features but has not elaborated on them in detail. The analysis of the uniqueness of the IVC urban planning is weak and lacks specific examples.",
		key_strengths: [
			"Good introductory paragraph.",
			"Correctly identified the grid pattern and drainage system.",
			"Mentioned the importance of privacy.",
		],
		areas_for_improvement: [
			"Provide more detailed explanations of the features of urban planning.",
			"Strengthen the analysis of the uniqueness of IVC urban planning with more specific examples.",
			"Include a discussion on the social and political organization of the IVC as reflected in its urban planning.",
		],
	},
	question_evaluations: [
		{
			question_number: "Q2",
			marks_awarded: 7.5,
			marks_total: 15,
			percentage: 50,
			feedback: {
				summary:
					"The answer provides a fair overview of the urban planning and architecture of the Indus Valley Civilization. It correctly identifies key features like the grid pattern, drainage system, and the use of baked bricks. However, it lacks depth in explaining the uniqueness and significance of these features. The comparison with modern urban planning is weak and not well-substantiated.",
				tone: "strict",
				strengths: [
					"Good introduction to the IVC and its timeline.",
					"Correctly mentions the grid pattern and drainage system.",
					"Highlights the importance of privacy in IVC architecture.",
				],
				weaknesses: [
					"The explanation of the grid pattern is superficial and misses key details.",
					"The comparison with modern urban planning is not well-developed.",
					"The significance of the Citadel and Lower Town division is not discussed.",
				],
				suggestions: [
					"Provide more specific details about the grid system, such as the intersection of roads at right angles.",
					"Elaborate on the significance of the advanced drainage system in the context of public health and hygiene.",
					"Include a discussion on the social and political implications of the Citadel and Lower Town division.",
				],
			},
			annotations: [
				{
					annotation_id: "c12ed9e3-a2c8-4122-8cc4-0c8aad4572e7-1",
					page_number: 1,
					annotation_type: "checkmark",
					coordinates: [
						{ x: 0.14158238470554352, y: 0.15090374648571014 },
						{ y: 0.15090374648571014, x: 0.8477097153663635 },
						{ x: 0.8477097153663635, y: 0.19924338161945343 },
						{ y: 0.19924338161945343, x: 0.14158238470554352 },
					],
					text_content: "Good introductory point.",
					color: "#00FF00",
					correctness_indicator: "correct",
				},
				{
					annotation_id: "c12ed9e3-a2c8-4122-8cc4-0c8aad4572e7-2",
					page_number: 1,
					annotation_type: "circle",
					coordinates: [
						{ x: 0.1427721530199051, y: 0.26565784215927124 },
						{ x: 0.8762641549110413, y: 0.26565784215927124 },
						{ y: 0.40016815066337585, x: 0.8762641549110413 },
						{ x: 0.1427721530199051, y: 0.40016815066337585 },
					],
					text_content:
						"The information is correct, but the sentence structure is poor and contains grammatical errors. To improve, try to write in a clearer and more concise manner.",
					color: "#FF0000",
					correctness_indicator: "incorrect",
				},
				{
					annotation_id: "c12ed9e3-a2c8-4122-8cc4-0c8aad4572e7-3",
					page_number: 1,
					annotation_type: "underline",
					coordinates: [
						{ x: 0.1463414579629898, y: 0.48423707485198975 },
						{ x: 0.8227245807647705, y: 0.48423707485198975 },
						{ y: 0.5128205418586731, x: 0.8227245807647705 },
						{ x: 0.1463414579629898, y: 0.5128205418586731 },
					],
					text_content:
						"You have correctly identified the grid pattern, but your explanation is incomplete. To improve, elaborate on how the streets intersected at right angles and the hierarchy of the road network.",
					color: "#FFA500",
					correctness_indicator: "partial",
				},
				{
					annotation_id: "c12ed9e3-a2c8-4122-8cc4-0c8aad4572e7-4",
					page_number: 2,
					annotation_type: "checkmark",
					coordinates: [
						{ x: 0.1546698361635208, y: 0.13787305355072021 },
						{ y: 0.13787305355072021, x: 0.7334919571876526 },
						{ y: 0.20933164656162262, x: 0.7334919571876526 },
						{ y: 0.20933164656162262, x: 0.1546698361635208 },
					],
					text_content:
						"Good point about the separate drains for waste and storm water.",
					color: "#00FF00",
					correctness_indicator: "correct",
				},
				{
					annotation_id: "c12ed9e3-a2c8-4122-8cc4-0c8aad4572e7-5",
					page_number: 2,
					annotation_type: "circle",
					coordinates: [
						{ x: 0.1427721530199051, y: 0.24085749685764313 },
						{ x: 0.8673408627510071, y: 0.24085749685764313 },
						{ x: 0.8673408627510071, y: 0.3224043846130371 },
						{ x: 0.1427721530199051, y: 0.3224043846130371 },
					],
					text_content:
						"It was stone slabs not clay. Please review the material used in the IVC drainage system. For example, the Great Bath at Mohenjo-daro used bitumen for waterproofing.",
					color: "#FF0000",
					correctness_indicator: "incorrect",
				},
				{
					annotation_id: "c12ed9e3-a2c8-4122-8cc4-0c8aad4572e7-6",
					page_number: 2,
					annotation_type: "underline",
					coordinates: [
						{ y: 0.3501471281051636, x: 0.13087448477745056 },
						{ x: 0.8709101676940918, y: 0.3501471281051636 },
						{ x: 0.8709101676940918, y: 0.569987416267395 },
						{ y: 0.569987416267395, x: 0.13087448477745056 },
					],
					text_content:
						"You have mentioned the dockyard at Lothal, which is correct, but your explanation is unclear. To improve, clearly state the purpose of the dockyard, which was for trade and maritime activities.",
					color: "#FFA500",
					correctness_indicator: "partial",
				},
				{
					annotation_id: "c12ed9e3-a2c8-4122-8cc4-0c8aad4572e7-7",
					page_number: 3,
					annotation_type: "checkmark",
					coordinates: [
						{ x: 0.1427721530199051, y: 0.6149642467498779 },
						{ x: 0.7465794086456299, y: 0.6149642467498779 },
						{ x: 0.7465794086456299, y: 0.6897855997085571 },
						{ y: 0.6897855997085571, x: 0.1427721530199051 },
					],
					text_content:
						"Good conclusion, highlighting the uniqueness of IVC urban planning.",
					color: "#00FF00",
					correctness_indicator: "correct",
				},
				{
					annotation_id: "c12ed9e3-a2c8-4122-8cc4-0c8aad4572e7-8",
					page_number: 3,
					annotation_type: "circle",
					coordinates: [
						{ x: 0.13622844219207764, y: 0.8280790448188782 },
						{ y: 0.8280790448188782, x: 0.8964901566505432 },
						{ x: 0.8964901566505432, y: 0.8575031757354736 },
						{ y: 0.8575031757354736, x: 0.13622844219207764 },
					],
					text_content:
						"This comparison to modern times is too general and not well-supported. To improve, provide specific examples of how IVC planning principles are still relevant or have influenced modern urban design.",
					color: "#FF0000",
					correctness_indicator: "incorrect",
				},
				{
					annotation_id: "c12ed9e3-a2c8-4122-8cc4-0c8aad4572e7-9",
					page_number: 3,
					annotation_type: "underline",
					coordinates: [
						{ x: 0.3355145752429962, y: 0.6490122079849243 },
						{ x: 0.8649613261222839, y: 0.6490122079849243 },
						{ x: 0.8649613261222839, y: 0.7797393798828125 },
						{ x: 0.3355145752429962, y: 0.7797393798828125 },
					],
					text_content:
						"While it is true that IVC was a pre-European civilization, your explanation of its foundational ideas is too vague. To improve, specify the concepts and technologies that were advanced for its time.",
					color: "#FFA500",
					correctness_indicator: "partial",
				},
			],
		},
	],
};

// ============================================================================
// Main Component
// ============================================================================

export default function ViewEvaluationPage() {
	const router = useRouter();
	const params = useParams();
	const testId = params.testId as string;
	const answerId = params.answerId as string;

	// ============================================================================
	// State Management
	// ============================================================================

	const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// ============================================================================
	// Data Fetching
	// ============================================================================

	const fetchEvaluation = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch(
				`${API_BASE_URL}/answer-papers/${answerId}/evaluation`,
			);

			if (!response.ok) {
				throw new Error("Failed to fetch evaluation");
			}

			const data = await response.json();
			setEvaluation(data);
			setError(null);
			toast.success("Evaluation loaded successfully");
		} catch (err) {
			// Use mock data as fallback for development/testing
			console.warn("API call failed, using mock data:", err);
			setEvaluation(MOCK_EVALUATION);
			setError(null);
			toast.info("Loaded evaluation (demo data)");
		} finally {
			setLoading(false);
		}
	}, [answerId]);

	useEffect(() => {
		fetchEvaluation();
	}, [fetchEvaluation]);

	// ============================================================================
	// Helper Functions
	// ============================================================================

	const getGradeColor = (percentage: number) => {
		if (percentage >= 90) return "text-green-600";
		if (percentage >= 80) return "text-green-500";
		if (percentage >= 70) return "text-yellow-600";
		if (percentage >= 60) return "text-yellow-500";
		if (percentage >= 50) return "text-orange-500";
		return "text-red-600";
	};

	const getCorrectnessConfig = (indicator: string) => {
		const configs = {
			correct: {
				className: "border-green-500/20 bg-green-500/10 text-green-600",
				icon: CheckCircleIcon,
				label: "Correct",
			},
			partial: {
				className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-600",
				icon: AlertCircleIcon,
				label: "Partial",
			},
			incorrect: {
				className: "border-red-500/20 bg-red-500/10 text-red-600",
				icon: XCircleIcon,
				label: "Incorrect",
			},
		};

		return configs[indicator as keyof typeof configs] || configs.partial;
	};

	const getAnnotationTypeLabel = (type: string) => {
		const labels = {
			checkmark: "✓ Check",
			circle: "⭕ Circle",
			underline: "_ Underline",
			highlight: "■ Highlight",
		};

		return labels[type as keyof typeof labels] || type;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleExportPDF = () => {
		toast.info("PDF export functionality coming soon");
	};

	// ============================================================================
	// Render: Loading State
	// ============================================================================

	if (loading) {
		return (
			<DashboardLayout
				title="Evaluation Results"
				description="Loading evaluation results..."
			>
				<div className="flex h-64 items-center justify-center">
					<Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			</DashboardLayout>
		);
	}

	// ============================================================================
	// Render: Error State
	// ============================================================================

	if (error || !evaluation) {
		return (
			<DashboardLayout
				title="Evaluation Results"
				description="Error loading results"
			>
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<XCircleIcon className="mb-4 h-12 w-12 text-red-500" />
						<p className="mb-4 text-center text-muted-foreground">
							{error || "Evaluation not found"}
						</p>
						<Button
							onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}
						>
							Back to Evaluation Panel
						</Button>
					</CardContent>
				</Card>
			</DashboardLayout>
		);
	}

	// ============================================================================
	// Statistics Calculation
	// ============================================================================

	const correctAnnotations = evaluation.question_evaluations.reduce(
		(acc, q) =>
			acc +
			q.annotations.filter((a) => a.correctness_indicator === "correct").length,
		0,
	);

	const partialAnnotations = evaluation.question_evaluations.reduce(
		(acc, q) =>
			acc +
			q.annotations.filter((a) => a.correctness_indicator === "partial").length,
		0,
	);

	const incorrectAnnotations = evaluation.question_evaluations.reduce(
		(acc, q) =>
			acc +
			q.annotations.filter((a) => a.correctness_indicator === "incorrect")
				.length,
		0,
	);

	// ============================================================================
	// Render: Main Content
	// ============================================================================

	return (
		<DashboardLayout
			title="Evaluation Results"
			description={`Detailed evaluation for ${
				evaluation.student_id || "answer sheet"
			}`}
			action={
				<div className="flex gap-2">
					<Button variant="outline" onClick={handleExportPDF}>
						<DownloadIcon className="mr-2 h-4 w-4" />
						Export PDF
					</Button>
					<Button
						onClick={() =>
							router.push(`/quicks/tests/${testId}/adapt/${answerId}`)
						}
					>
						<EditIcon className="mr-2 h-4 w-4" />
						Adapt & Adjust
					</Button>
				</div>
			}
		>
			<div className="space-y-6">
				{/* Evaluation Metadata */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="flex items-center gap-2">
									<FileTextIcon className="h-5 w-5" />
									Evaluation Information
								</CardTitle>
								<CardDescription className="mt-1">
									{formatDate(evaluation.evaluation_timestamp)}
								</CardDescription>
							</div>
							<Badge
								variant="outline"
								className="border-green-500/20 bg-green-500/10 text-green-600"
							>
								<CheckCircle2Icon className="mr-1 h-3 w-3" />
								{evaluation.evaluation_status}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-3">
							{evaluation.student_id && (
								<div className="flex items-center gap-3">
									<UserIcon className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="text-muted-foreground text-xs">Student ID</p>
										<p className="font-medium">{evaluation.student_id}</p>
									</div>
								</div>
							)}
							<div className="flex items-center gap-3">
								<ClockIcon className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-muted-foreground text-xs">Evaluated</p>
									<p className="font-medium">
										{new Date(
											evaluation.evaluation_timestamp,
										).toLocaleDateString()}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<FileTextIcon className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-muted-foreground text-xs">Evaluation ID</p>
									<p className="truncate font-mono text-xs">
										{evaluation.evaluation_id}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Overall Score Card */}
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AwardIcon className="h-5 w-5" />
							Overall Score
						</CardTitle>
						<CardDescription>Summary of evaluation results</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-6 md:grid-cols-5">
							<div className="col-span-2">
								<p className="mb-2 text-muted-foreground text-sm">
									Total Score
								</p>
								<div className="flex items-baseline gap-2">
									<p className="font-bold text-5xl">
										{evaluation.overall_score.total_marks_awarded}
									</p>
									<p className="text-2xl text-muted-foreground">
										/{evaluation.overall_score.total_marks_possible}
									</p>
								</div>
								<div className="mt-4">
									<div className="mb-2 flex items-center justify-between">
										<span className="text-muted-foreground text-xs">
											Performance
										</span>
										<span
											className={`font-bold text-sm ${getGradeColor(
												evaluation.overall_score.percentage,
											)}`}
										>
											{evaluation.overall_score.percentage}%
										</span>
									</div>
									<Progress
										value={evaluation.overall_score.percentage}
										className="h-2"
									/>
								</div>
							</div>

							<div className="col-span-1">
								<p className="mb-2 text-muted-foreground text-sm">Grade</p>
								<div
									className={`inline-flex items-center justify-center rounded-lg border-2 px-6 py-4 font-bold text-4xl ${getGradeColor(
										evaluation.overall_score.percentage,
									)}`}
								>
									{evaluation.overall_score.grade}
								</div>
							</div>

							<div className="col-span-2 space-y-3">
								<div>
									<p className="mb-1 text-muted-foreground text-sm">
										Annotations
									</p>
									<div className="flex gap-4">
										<div className="flex items-center gap-2">
											<CheckCircleIcon className="h-4 w-4 text-green-600" />
											<span className="font-medium text-green-600">
												{correctAnnotations}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<AlertCircleIcon className="h-4 w-4 text-yellow-600" />
											<span className="font-medium text-yellow-600">
												{partialAnnotations}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<XCircleIcon className="h-4 w-4 text-red-600" />
											<span className="font-medium text-red-600">
												{incorrectAnnotations}
											</span>
										</div>
									</div>
								</div>
								<div>
									<p className="mb-1 text-muted-foreground text-sm">
										Questions
									</p>
									<p className="font-medium">
										{evaluation.question_evaluations.length} question
										{evaluation.question_evaluations.length !== 1 ? "s" : ""}{" "}
										evaluated
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Overall Feedback Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUpIcon className="h-5 w-5" />
							Overall Feedback
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Summary */}
						<div>
							<h4 className="mb-2 font-semibold text-sm">Summary</h4>
							<p className="rounded-lg border bg-muted/50 p-4 text-sm leading-relaxed">
								{evaluation.overall_feedback.summary}
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							{/* Key Strengths */}
							<div>
								<h4 className="mb-3 flex items-center gap-2 font-semibold text-sm">
									<CheckCircleIcon className="h-4 w-4 text-green-600" />
									Key Strengths
								</h4>
								<ul className="space-y-2">
									{evaluation.overall_feedback.key_strengths.map(
										(strength, idx) => (
											<li key={idx} className="flex gap-2 text-sm">
												<span className="mt-0.5 text-green-600">✓</span>
												<span>{strength}</span>
											</li>
										),
									)}
								</ul>
							</div>

							{/* Areas for Improvement */}
							<div>
								<h4 className="mb-3 flex items-center gap-2 font-semibold text-sm">
									<TrendingUpIcon className="h-4 w-4 text-yellow-600" />
									Areas for Improvement
								</h4>
								<ul className="space-y-2">
									{evaluation.overall_feedback.areas_for_improvement.map(
										(area, idx) => (
											<li key={idx} className="flex gap-2 text-sm">
												<span className="mt-0.5 text-yellow-600">→</span>
												<span>{area}</span>
											</li>
										),
									)}
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Question-by-Question Evaluations */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="font-bold text-2xl">
							Question-by-Question Analysis
						</h2>
						<Badge variant="outline">
							{evaluation.question_evaluations.length} Question
							{evaluation.question_evaluations.length !== 1 ? "s" : ""}
						</Badge>
					</div>

					{evaluation.question_evaluations.map((question, idx) => {
						const config = getCorrectnessConfig(
							question.percentage >= 80
								? "correct"
								: question.percentage >= 50
									? "partial"
									: "incorrect",
						);
						const Icon = config.icon;

						return (
							<Card key={idx} className="overflow-hidden">
								<CardHeader className="bg-muted/30">
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1">
											<CardTitle className="text-lg">
												{question.question_number}
											</CardTitle>
											<CardDescription className="mt-1">
												{question.feedback.tone} evaluation tone
											</CardDescription>
										</div>
										<div className="flex items-center gap-4">
											<Badge variant="outline" className={config.className}>
												<Icon className="mr-1 h-3 w-3" />
												{question.percentage}%
											</Badge>
											<div className="text-right">
												<p className="text-muted-foreground text-xs">Score</p>
												<p className="font-bold text-xl">
													{question.marks_awarded}/{question.marks_total}
												</p>
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent className="pt-6">
									<Tabs defaultValue="feedback" className="w-full">
										<TabsList className="grid w-full grid-cols-2">
											<TabsTrigger value="feedback">Feedback</TabsTrigger>
											<TabsTrigger value="annotations">
												Annotations ({question.annotations.length})
											</TabsTrigger>
										</TabsList>

										<TabsContent value="feedback" className="mt-4 space-y-4">
											{/* Summary */}
											<div>
												<h4 className="mb-2 font-semibold text-sm">Summary</h4>
												<p className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 text-sm leading-relaxed">
													{question.feedback.summary}
												</p>
											</div>

											<Separator />

											<div className="grid gap-4 md:grid-cols-3">
												{/* Strengths */}
												<div>
													<h4 className="mb-3 flex items-center gap-2 font-semibold text-sm">
														<CheckCircleIcon className="h-4 w-4 text-green-600" />
														Strengths
													</h4>
													<ul className="space-y-2">
														{question.feedback.strengths.map(
															(strength, sidx) => (
																<li key={sidx} className="flex gap-2 text-sm">
																	<span className="mt-0.5 text-green-600">
																		✓
																	</span>
																	<span className="text-xs">{strength}</span>
																</li>
															),
														)}
													</ul>
												</div>

												{/* Weaknesses */}
												<div>
													<h4 className="mb-3 flex items-center gap-2 font-semibold text-sm">
														<XCircleIcon className="h-4 w-4 text-red-600" />
														Weaknesses
													</h4>
													<ul className="space-y-2">
														{question.feedback.weaknesses.map(
															(weakness, widx) => (
																<li key={widx} className="flex gap-2 text-sm">
																	<span className="mt-0.5 text-red-600">✗</span>
																	<span className="text-xs">{weakness}</span>
																</li>
															),
														)}
													</ul>
												</div>

												{/* Suggestions */}
												<div>
													<h4 className="mb-3 flex items-center gap-2 font-semibold text-sm">
														<TrendingUpIcon className="h-4 w-4 text-blue-600" />
														Suggestions
													</h4>
													<ul className="space-y-2">
														{question.feedback.suggestions.map(
															(suggestion, suidx) => (
																<li key={suidx} className="flex gap-2 text-sm">
																	<span className="mt-0.5 text-blue-600">
																		→
																	</span>
																	<span className="text-xs">{suggestion}</span>
																</li>
															),
														)}
													</ul>
												</div>
											</div>
										</TabsContent>

										<TabsContent value="annotations" className="mt-4 space-y-3">
											{question.annotations.length === 0 ? (
												<p className="py-8 text-center text-muted-foreground text-sm">
													No annotations for this question
												</p>
											) : (
												question.annotations.map((annotation, aidx) => {
													const annConfig = getCorrectnessConfig(
														annotation.correctness_indicator,
													);
													const AnnIcon = annConfig.icon;

													return (
														<div
															key={aidx}
															className="rounded-lg border p-4"
															style={{
																borderLeftWidth: "4px",
																borderLeftColor: annotation.color,
															}}
														>
															<div className="mb-2 flex items-start justify-between gap-3">
																<div className="flex items-center gap-2">
																	<Badge
																		variant="outline"
																		className={annConfig.className}
																		style={{ fontSize: "10px" }}
																	>
																		<AnnIcon className="mr-1 h-3 w-3" />
																		{annotation.correctness_indicator}
																	</Badge>
																	<Badge
																		variant="secondary"
																		style={{ fontSize: "10px" }}
																	>
																		{getAnnotationTypeLabel(
																			annotation.annotation_type,
																		)}
																	</Badge>
																</div>
																<span className="text-muted-foreground text-xs">
																	Page {annotation.page_number}
																</span>
															</div>
															<p className="text-sm leading-relaxed">
																{annotation.text_content}
															</p>
														</div>
													);
												})
											)}
										</TabsContent>
									</Tabs>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Action Buttons */}
				<div className="flex justify-between pt-4">
					<Button
						variant="outline"
						onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}
					>
						Back to Evaluation Panel
					</Button>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() =>
								router.push(`/quicks/tests/${testId}/view/${answerId}/report`)
							}
						>
							<FileTextIcon className="mr-2 h-4 w-4" />
							View Full Report
						</Button>
						<Button
							onClick={() =>
								router.push(`/quicks/tests/${testId}/adapt/${answerId}`)
							}
						>
							<EditIcon className="mr-2 h-4 w-4" />
							Adapt & Adjust Scores
						</Button>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
