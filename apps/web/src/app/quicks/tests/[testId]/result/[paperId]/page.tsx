"use client";

import { Badge } from "@gb/ui/src/components/ui/badge";
import { Button } from "@gb/ui/src/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@gb/ui/src/components/ui/card";
import {
	ArrowLeft,
	ChevronDown,
	ChevronRight,
	Download,
	ExternalLink,
	Loader2,
	Maximize2,
	Minimize2,
	Moon,
	PieChart,
	Sun,
	ThumbsDown,
	ThumbsUp,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	type AnswerPaper,
	getAnswerPapersByAcademicTest,
} from "@/lib/answer-papers-api";

// --- UTILITIES ---
const cn = (...classes: (string | undefined)[]) =>
	classes.filter(Boolean).join(" ");

// --- TYPES ---

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

// --- VISUALIZATION COMPONENTS (SVG) ---

const MarksChart = ({ questions }: { questions: QuestionEvaluation[] }) => {
	const height = 200;
	const width = 600;
	const margin = { top: 20, right: 20, bottom: 40, left: 40 };
	const chartWidth = width - margin.left - margin.right;
	const chartHeight = height - margin.top - margin.bottom;

	const maxMarks = Math.max(...questions.map((q) => q.marks_total), 10);
	const barWidth = Math.min(40, chartWidth / questions.length - 10);

	return (
		<div className="w-full overflow-x-auto">
			<svg
				viewBox={`0 0 ${width} ${height}`}
				className="w-full min-w-[500px]"
				preserveAspectRatio="xMidYMid meet"
				role="img"
				aria-label="Chart visualization"
			>
				{/* Background Grid */}
				<g transform={`translate(${margin.left}, ${margin.top})`}>
					{[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
						const y = chartHeight * (1 - tick);
						return (
							<g key={i}>
								<line
									x1={0}
									y1={y}
									x2={chartWidth}
									y2={y}
									stroke="currentColor"
									className="text-border"
									strokeDasharray="4 4"
									strokeWidth="1"
									opacity={0.3}
								/>
								<text
									x={-10}
									y={y + 4}
									className="fill-muted-foreground text-[10px]"
									textAnchor="end"
								>
									{Math.round(maxMarks * tick)}
								</text>
							</g>
						);
					})}

					{/* Bars */}
					{questions.map((q, i) => {
						const x =
							i * (chartWidth / questions.length) +
							(chartWidth / questions.length - barWidth) / 2;
						const barHeight = (q.marks_awarded / maxMarks) * chartHeight;
						const totalHeight = (q.marks_total / maxMarks) * chartHeight;

						return (
							<g key={i} className="group">
								{/* Total Marks Background Bar */}
								<rect
									x={x}
									y={chartHeight - totalHeight}
									width={barWidth}
									height={totalHeight}
									className="fill-muted/20"
									rx={4}
								/>
								{/* Awarded Marks Bar */}
								<rect
									x={x}
									y={chartHeight - barHeight}
									width={barWidth}
									height={barHeight}
									className={cn(
										"transition-all duration-300",
										q.percentage >= 50 ? "fill-emerald-500" : "fill-rose-500",
										"group-hover:opacity-80",
									)}
									rx={4}
								/>
								{/* Values */}
								<text
									x={x + barWidth / 2}
									y={chartHeight - barHeight - 6}
									textAnchor="middle"
									className="fill-foreground font-bold text-[10px] opacity-0 transition-opacity group-hover:opacity-100"
								>
									{q.marks_awarded}
								</text>
								{/* Labels */}
								<text
									x={x + barWidth / 2}
									y={chartHeight + 20}
									textAnchor="middle"
									className="fill-muted-foreground font-medium text-[10px]"
								>
									Q{q.question_number}
								</text>
							</g>
						);
					})}
				</g>
			</svg>
		</div>
	);
};

const PerformanceChart = ({
	questions,
}: {
	questions: QuestionEvaluation[];
}) => {
	const height = 200;
	const width = 600;
	const margin = { top: 20, right: 40, bottom: 40, left: 40 };
	const chartWidth = width - margin.left - margin.right;
	const chartHeight = height - margin.top - margin.bottom;

	// Calculate points for Percentage Line
	const getX = (i: number) => i * (chartWidth / (questions.length - 1 || 1));
	const getY = (val: number) => chartHeight * (1 - val / 100);

	const linePoints = questions
		.map((q, i) => `${getX(i)},${getY(q.percentage)}`)
		.join(" ");

	// Find max errors for scaling secondary axis
	const maxErrors = Math.max(
		...questions.map((q) => q.feedback.weaknesses.length),
		5,
	);

	return (
		<div className="w-full overflow-x-auto">
			<svg
				viewBox={`0 0 ${width} ${height}`}
				className="w-full min-w-[500px]"
				preserveAspectRatio="xMidYMid meet"
				role="img"
				aria-label="Chart visualization"
			>
				{/* Background Grid */}
				<g transform={`translate(${margin.left}, ${margin.top})`}>
					<defs>
						<linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
							<stop
								offset="0%"
								stopColor="currentColor"
								className="text-primary"
								stopOpacity="0.2"
							/>
							<stop
								offset="100%"
								stopColor="currentColor"
								className="text-primary"
								stopOpacity="0"
							/>
						</linearGradient>
					</defs>

					{[0, 25, 50, 75, 100].map((val, i) => {
						const y = getY(val);
						return (
							<g key={i}>
								<line
									x1={0}
									y1={y}
									x2={chartWidth}
									y2={y}
									stroke="currentColor"
									className="text-border"
									strokeDasharray="4 4"
									strokeWidth="1"
									opacity={0.3}
								/>
								<text
									x={-10}
									y={y + 4}
									className="fill-muted-foreground text-[10px]"
									textAnchor="end"
								>
									{val}%
								</text>
							</g>
						);
					})}

					{/* Right Axis (Errors) */}
					<g transform={`translate(${chartWidth}, 0)`}>
						<text
							x={25}
							y={-10}
							textAnchor="middle"
							className="fill-rose-500 font-bold text-[10px]"
						>
							Errors
						</text>
						{[0, Math.floor(maxErrors / 2), maxErrors].map((val, i) => (
							<text
								key={i}
								x={10}
								y={chartHeight * (1 - val / maxErrors) + 4}
								className="fill-muted-foreground text-[10px]"
								textAnchor="start"
							>
								{val}
							</text>
						))}
					</g>

					{/* Area under line */}
					<path
						d={`M0,${chartHeight} ${questions.map((q, i) => `L${getX(i)},${getY(q.percentage)}`).join(" ")} L${chartWidth},${chartHeight} Z`}
						fill="url(#line-gradient)"
					/>

					{/* Percentage Line */}
					<polyline
						points={linePoints}
						fill="none"
						stroke="currentColor"
						className="text-primary"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Data Points (Circles) */}
					{questions.map((q, i) => (
						<g key={i} className="group">
							{/* Error Bars (Secondary Axis) */}
							<rect
								x={getX(i) - 6}
								y={chartHeight * (1 - q.feedback.weaknesses.length / maxErrors)}
								width={12}
								height={
									chartHeight * (q.feedback.weaknesses.length / maxErrors)
								}
								className="fill-rose-500/20 transition-all hover:fill-rose-500/40"
								rx={2}
							/>
							{/* Percentage Dot */}
							<circle
								cx={getX(i)}
								cy={getY(q.percentage)}
								r={4}
								className="group-hover:r-6 fill-background stroke-2 stroke-primary transition-all"
							/>
							{/* Tooltip */}
							<g className="opacity-0 transition-opacity group-hover:opacity-100">
								<rect
									x={getX(i) - 30}
									y={getY(q.percentage) - 35}
									width={60}
									height={28}
									rx={4}
									className="fill-popover stroke-border"
									strokeWidth="1"
								/>
								<text
									x={getX(i)}
									y={getY(q.percentage) - 18}
									textAnchor="middle"
									className="fill-popover-foreground font-bold text-[10px]"
								>
									{q.percentage}% | {q.feedback.weaknesses.length}E
								</text>
							</g>
							{/* X Axis Label */}
							<text
								x={getX(i)}
								y={chartHeight + 20}
								textAnchor="middle"
								className="fill-muted-foreground font-medium text-[10px]"
							>
								Q{q.question_number}
							</text>
						</g>
					))}
				</g>
			</svg>
		</div>
	);
};

// --- SUB-COMPONENTS ---

const QuestionGrid = ({
	questions,
	onSelectQuestion,
	selectedQuestionId,
}: {
	questions: QuestionEvaluation[];
	onSelectQuestion: (id: string) => void;
	selectedQuestionId: string;
}) => {
	return (
		<div className="mb-6">
			<h3 className="mb-3 font-bold text-muted-foreground text-xs uppercase tracking-wide">
				Question Map
			</h3>
			<div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8">
				{questions.map((q, i) => {
					// Use index as fallback ID since API q.question_number might not be unique globally but unique locally
					const qId = `q-${i}`;
					const isSelected = selectedQuestionId === qId;

					let colorClass = "";
					if (q.percentage >= 60) {
						colorClass = isSelected
							? "bg-emerald-900/40 text-emerald-400 border-emerald-500 ring-2 ring-emerald-500"
							: "bg-emerald-950/30 text-emerald-500 border-emerald-900/50 hover:border-emerald-700";
					} else if (q.percentage >= 40) {
						colorClass = isSelected
							? "bg-amber-900/40 text-amber-400 border-amber-500 ring-2 ring-amber-500"
							: "bg-amber-950/30 text-amber-500 border-amber-900/50 hover:border-amber-700";
					} else {
						colorClass = isSelected
							? "bg-rose-900/40 text-rose-400 border-rose-500 ring-2 ring-rose-500"
							: "bg-rose-950/30 text-rose-500 border-rose-900/50 hover:border-rose-700";
					}

					return (
						<button
							type="button"
							key={i}
							onClick={() => onSelectQuestion(qId)}
							className={cn(
								"relative flex flex-col items-center justify-center rounded-lg border p-2 transition-all duration-200",
								colorClass,
								isSelected
									? "z-10 scale-105 shadow-md"
									: "opacity-90 hover:opacity-100",
							)}
						>
							<span className="font-bold text-[10px]">
								Q{q.question_number}
							</span>
							<span className="font-black text-xs">{q.marks_awarded}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

const QuoteIcon = ({ className }: { className: string }) => (
	<svg
		className={className}
		fill="currentColor"
		viewBox="0 0 24 24"
		role="img"
		aria-label="Quote icon"
	>
		<path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
	</svg>
);

// --- MAIN PAGE ---

export default function ResultPage() {
	const params = useParams();
	const router = useRouter();
	const testId = params?.testId as string;
	const paperId = params?.paperId as string;

	const [paper, setPaper] = useState<AnswerPaper | null>(null);
	const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
	const [questions, setQuestions] = useState<QuestionEvaluation[]>([]);
	const [selectedQuestionId, setSelectedQuestionId] = useState<string>("q-0");
	const [activeTab, setActiveTab] = useState<"overview" | "analysis">(
		"overview",
	);
	const [focusMode, setFocusMode] = useState(false);
	const [showOriginalPdf, setShowOriginalPdf] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// --- LOAD DATA ---
	useEffect(() => {
		const loadData = async () => {
			if (!testId || !paperId) {
				setError("Missing test ID or paper ID");
				setIsLoading(false);
				return;
			}
			try {
				setIsLoading(true);
				const papers = await getAnswerPapersByAcademicTest(testId);
				const foundPaper = papers.find((p) => p.id === paperId);
				if (!foundPaper) {
					setError("Paper not found.");
					return;
				}
				setPaper(foundPaper);
				if (foundPaper.processed_document_url) {
					const res = await fetch(foundPaper.processed_document_url);
					if (!res.ok) throw new Error("Failed to fetch evaluation data");
					const data: EvaluationData = await res.json();
					setEvaluation(data);
					setQuestions(data.question_evaluations || []);
				} else {
					setError("Evaluation data not available yet");
				}
			} catch (err) {
				console.error(err);
				setError("Failed to load result data");
			} finally {
				setIsLoading(false);
			}
		};
		loadData();
	}, [testId, paperId]);

	const handleQuestionSelect = (id: string) => {
		setSelectedQuestionId(id);
		if (activeTab === "overview") setActiveTab("analysis");
		setTimeout(() => {
			const element = document.getElementById(id);
			if (element)
				element.scrollIntoView({ behavior: "smooth", block: "start" });
		}, 100);
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center bg-background">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error || !paper || !evaluation) {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
				<p className="text-destructive">{error || "Failed to load data"}</p>
				<Button
					onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}
					variant="outline"
					className="border-border bg-background text-foreground hover:bg-muted"
				>
					Back to Dashboard
				</Button>
			</div>
		);
	}

	// Mock data for visualizations

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary">
			{/* HEADER */}
			{!focusMode && (
				<header className="z-30 flex h-16 flex-shrink-0 items-center justify-between border-border border-b bg-background px-6 shadow-sm">
					<div className="flex items-center gap-6 print:hidden">
						<Button
							variant="ghost"
							size="sm"
							className="-ml-2 gap-2 text-muted-foreground hover:bg-muted hover:text-foreground"
							onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}
						>
							<ArrowLeft className="h-4 w-4" /> Back
						</Button>
						<div>
							<h1 className="font-bold text-foreground text-lg leading-tight">
								Evaluation Result
							</h1>
							<div className="mt-0.5 flex items-center gap-3">
								<span className="font-medium text-muted-foreground text-xs">
									{paper.student_name}
								</span>
								<span className="text-muted-foreground/50">•</span>
								<span className="font-medium text-muted-foreground text-xs">
									ID: {paper.id.slice(0, 6)}
								</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="mr-4 hidden items-center gap-4 rounded-lg border border-border bg-card px-3 py-1.5 md:flex print:hidden">
							<div className="flex flex-col items-end">
								<span className="font-bold text-[10px] text-muted-foreground uppercase">
									Percentile
								</span>
								<span className="font-bold text-foreground text-sm">88.5</span>
							</div>
						</div>
						<Button
							size="sm"
							onClick={() => window.print()}
							className="gap-2 bg-foreground text-background shadow-md transition-all hover:bg-foreground/90 hover:shadow-lg print:hidden"
						>
							<Download className="h-4 w-4" /> Report
						</Button>
					</div>
				</header>
			)}

			<main className="relative flex flex-1 overflow-hidden">
				{/* LEFT: PDF Viewer */}
				<div
					className={cn(
						"relative flex-col border-border border-r bg-muted/40 transition-all duration-300 print:hidden",
						focusMode ? "flex w-full" : "hidden w-1/2 lg:flex",
					)}
				>
					{focusMode && (
						<div className="absolute top-4 left-4 z-50">
							<Button
								variant="secondary"
								size="sm"
								onClick={() => setFocusMode(false)}
								className="border border-slate-700 bg-slate-800 text-slate-200 shadow-lg hover:bg-slate-700"
							>
								<Minimize2 className="mr-2 h-3 w-3" /> Exit Focus
							</Button>
						</div>
					)}

					{/* PDF Toolbar */}
					<div className="z-20 flex h-12 shrink-0 items-center justify-between border-border border-b bg-background px-4 shadow-sm">
						<div className="flex items-center gap-2">
							<Badge
								variant="secondary"
								className="hidden bg-secondary font-normal text-muted-foreground text-xs hover:bg-secondary/80 sm:flex"
							>
								Annotated PDF
							</Badge>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:bg-muted hover:text-foreground"
								onClick={() => setShowOriginalPdf(!showOriginalPdf)}
								title={
									showOriginalPdf ? "Switch to Dark Mode" : "Show Original"
								}
							>
								{showOriginalPdf ? <Moon size={16} /> : <Sun size={16} />}
							</Button>
							<div className="mx-1 h-4 w-px bg-border" />
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:bg-muted hover:text-foreground"
								onClick={() => {
									if (paper.annotated_document_url)
										window.open(paper.annotated_document_url, "_blank");
								}}
								title="Open in New Tab"
							>
								<ExternalLink size={16} />
							</Button>
							<div className="mx-1 h-4 w-px bg-border" />
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:bg-muted hover:text-foreground"
								onClick={() => setFocusMode(!focusMode)}
								title={focusMode ? "Exit Focus" : "Focus Mode"}
							>
								{focusMode ? (
									<Minimize2 size={16} className="text-primary" />
								) : (
									<Maximize2 size={16} />
								)}
							</Button>
						</div>
					</div>

					{/* PDF Frame */}
					<div className="flex-1 overflow-hidden bg-muted/20">
						{paper.annotated_document_url ? (
							<iframe
								src={paper.annotated_document_url}
								title="Annotated Submission PDF"
								width="100%"
								height="100%"
								className={cn(
									"h-full w-full border-none",
									!showOriginalPdf
										? "brightness-110 contrast-90 hue-rotate-180 invert-[.93]"
										: undefined,
								)}
								// Note: simple CSS invert for PDF dark mode simulation
							/>
						) : (
							<div className="flex h-full flex-col items-center justify-center gap-2 text-slate-600">
								<Loader2 className="h-8 w-8 animate-spin" />
								<p>Loading PDF...</p>
							</div>
						)}
					</div>
				</div>

				{/* RIGHT: Dashboard */}
				{!focusMode && (
					<div className="flex w-full flex-col overflow-hidden border-border border-l bg-background lg:w-1/2 print:w-full print:overflow-visible print:border-none">
						{/* Mock Tabs */}
						<div className="z-10 border-border border-b bg-background/95 px-6 py-3 backdrop-blur-sm print:hidden">
							<div className="grid w-full grid-cols-2 rounded-lg bg-muted p-1 text-muted-foreground">
								<button
									type="button"
									onClick={() => setActiveTab("overview")}
									className={cn(
										"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
										activeTab === "overview"
											? "bg-background text-foreground shadow-sm"
											: "hover:bg-background/50 hover:text-foreground",
									)}
								>
									Overview & Analytics
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("analysis")}
									className={cn(
										"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
										activeTab === "analysis"
											? "bg-background text-foreground shadow-sm"
											: "hover:bg-background/50 hover:text-foreground",
									)}
								>
									Detailed Analysis
								</button>
							</div>
						</div>

						<div className="custom-scrollbar flex-1 overflow-y-auto scroll-smooth p-6 pb-24 print:h-auto print:overflow-visible print:pb-0">
							{/* TAB: OVERVIEW */}
							<div
								className={cn(
									activeTab === "overview" ? "block" : "hidden print:block",
								)}
							>
								<div className="fade-in slide-in-from-right-4 animate-in space-y-6 duration-300">
									{/* Score Cards */}
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
										<Card className="border-border bg-card/50">
											<CardContent className="flex flex-col items-center justify-center p-4 text-center">
												<span className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
													Total Score
												</span>
												<div className="flex items-baseline gap-1 font-black text-3xl text-foreground">
													{evaluation.overall_score.total_marks_awarded}{" "}
													<span className="font-medium text-muted-foreground text-sm">
														/ {evaluation.overall_score.total_marks_possible}
													</span>
												</div>
											</CardContent>
										</Card>
										<Card className="border-border bg-card/50">
											<CardContent className="flex flex-col items-center justify-center p-4 text-center">
												<span className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
													Grade
												</span>
												<div className="flex items-baseline gap-2 font-black text-3xl text-rose-500">
													{evaluation.overall_score.grade}
												</div>
											</CardContent>
										</Card>
										<Card className="border-border bg-card/50">
											<CardContent className="flex flex-col items-center justify-center p-4 text-center">
												<span className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
													Questions
												</span>
												<div className="flex items-baseline gap-2 font-black text-3xl text-foreground">
													{questions.length}
												</div>
											</CardContent>
										</Card>
									</div>

									{/* Charts Row */}
									<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
										<Card className="border-border bg-card">
											<CardHeader className="border-border border-b bg-muted/20 px-5 py-3">
												<CardTitle className="flex items-center gap-2 font-bold text-muted-foreground text-xs uppercase">
													<TrendingUp size={14} /> Points Distribution
												</CardTitle>
											</CardHeader>
											<CardContent className="p-4">
												<MarksChart questions={questions} />
											</CardContent>
										</Card>

										<Card className="border-border bg-card">
											<CardHeader className="border-border border-b bg-muted/20 px-5 py-3">
												<CardTitle className="flex items-center gap-2 font-bold text-muted-foreground text-xs uppercase">
													<PieChart size={14} /> Performance & Errors
												</CardTitle>
											</CardHeader>
											<CardContent className="p-4">
												<PerformanceChart questions={questions} />
											</CardContent>
										</Card>
									</div>

									{/* Overall Feedback */}
									<Card className="border-border border-t border-r border-b border-l-4 border-l-primary bg-card shadow-sm">
										<CardContent className="p-5">
											<h4 className="mb-3 flex items-center gap-2 font-bold text-foreground text-sm">
												<Zap size={16} className="text-amber-500" /> Mentor's
												Summary
											</h4>
											<p className="mb-4 font-medium text-muted-foreground text-sm leading-relaxed">
												{evaluation.overall_feedback.summary}
											</p>
											<div className="flex flex-wrap gap-2">
												{evaluation.overall_feedback.areas_for_improvement
													.slice(0, 3)
													.map((area, i) => (
														<Badge
															key={i}
															variant="outline"
															className="border-amber-900 bg-amber-950/50 py-1 text-amber-500 hover:bg-amber-900/50"
														>
															Needs Focus: {area}
														</Badge>
													))}
											</div>
										</CardContent>
									</Card>
								</div>
							</div>

							{/* TAB: ANALYSIS */}
							<div
								className={cn(
									activeTab === "analysis"
										? "block"
										: "hidden print:mt-8 print:block",
								)}
							>
								{/* Force break before analysis in print */}
								<div className="fade-in slide-in-from-right-4 animate-in break-before-page space-y-6 duration-300">
									<QuestionGrid
										questions={questions}
										onSelectQuestion={handleQuestionSelect}
										selectedQuestionId={selectedQuestionId}
									/>

									<div className="space-y-4">
										{questions.map((q, index) => {
											const qId = `q-${index}`;
											const isSelected = selectedQuestionId === qId;
											return (
												<div key={index} id={qId} className="scroll-mt-4">
													<Card
														onClick={() => handleQuestionSelect(qId)}
														className={cn(
															"group cursor-pointer overflow-hidden border-border border-y border-r border-l-4 bg-card transition-all duration-300 hover:shadow-lg",
															isSelected
																? "scale-[1.01] border-l-primary shadow-md ring-1 ring-primary/20"
																: "border-l-transparent hover:border-l-border",
														)}
													>
														<div
															className={cn(
																"flex flex-row items-center justify-between px-5 py-4 transition-colors",
																isSelected ? "bg-primary/5" : "bg-card",
															)}
														>
															<div className="flex items-center gap-4">
																<div className="flex flex-col items-center">
																	<Badge
																		variant="outline"
																		className="h-6 min-w-[2.5rem] justify-center border-border bg-muted/50 font-bold text-muted-foreground shadow-sm"
																	>
																		Q{q.question_number}
																	</Badge>
																	{isSelected && (
																		<div className="mt-1 h-8 w-px bg-primary" />
																	)}
																</div>
																<div className="flex flex-col gap-1">
																	<span className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
																		Assessment
																	</span>
																	<span className="line-clamp-1 max-w-[220px] font-medium text-foreground text-xs">
																		{q.feedback.summary.slice(0, 60)}...
																	</span>
																</div>
															</div>
															<div className="flex items-center gap-4">
																<div className="text-right">
																	<span
																		className={cn(
																			"block font-bold text-sm",
																			q.percentage >= 50
																				? "text-emerald-500"
																				: "text-rose-500",
																		)}
																	>
																		{q.marks_awarded}{" "}
																		<span className="font-normal text-muted-foreground text-xs">
																			/ {q.marks_total}
																		</span>
																	</span>
																</div>
																{isSelected ? (
																	<ChevronDown className="h-4 w-4 text-primary" />
																) : (
																	<ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
																)}
															</div>
														</div>

														<div
															className={cn(
																"overflow-hidden bg-card transition-all duration-500 ease-in-out",
																isSelected
																	? "max-h-[1200px] opacity-100"
																	: "max-h-0 opacity-0",
															)}
														>
															<div className="space-y-5 px-5 pt-0 pb-5">
																<div className="relative rounded-lg border border-border bg-muted/30 p-4 font-medium text-foreground text-sm leading-relaxed">
																	<QuoteIcon className="absolute top-2 left-2 h-6 w-6 text-muted-foreground/20" />
																	<span className="relative z-10">
																		{q.feedback.summary}
																	</span>
																</div>

																<div className="grid gap-3 sm:grid-cols-2">
																	{q.feedback.strengths?.length > 0 && (
																		<div className="rounded-lg border border-emerald-900/30 bg-emerald-950/30 p-3">
																			<p className="mb-2 flex items-center gap-1.5 font-bold text-[10px] text-emerald-500 uppercase">
																				<ThumbsUp size={12} /> Strengths
																			</p>
																			<ul className="space-y-1">
																				{q.feedback.strengths.map((s, i) => (
																					<li
																						key={i}
																						className="flex gap-2 text-muted-foreground text-xs"
																					>
																						<span className="text-emerald-500">
																							•
																						</span>
																						{s}
																					</li>
																				))}
																			</ul>
																		</div>
																	)}
																	{q.feedback.weaknesses?.length > 0 && (
																		<div className="rounded-lg border border-rose-900/30 bg-rose-950/30 p-3">
																			<p className="mb-2 flex items-center gap-1.5 font-bold text-[10px] text-rose-500 uppercase">
																				<ThumbsDown size={12} /> Weaknesses
																			</p>
																			<ul className="space-y-1">
																				{q.feedback.weaknesses.map((s, i) => (
																					<li
																						key={i}
																						className="flex gap-2 text-muted-foreground text-xs"
																					>
																						<span className="text-rose-500">
																							•
																						</span>
																						{s}
																					</li>
																				))}
																			</ul>
																		</div>
																	)}
																</div>
															</div>
														</div>
													</Card>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
