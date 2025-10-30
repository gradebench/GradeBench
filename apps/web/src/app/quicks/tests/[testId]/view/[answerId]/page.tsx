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
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import {
	AlertCircleIcon,
	CheckCircleIcon,
	DownloadIcon,
	EditIcon,
	XCircleIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface QuestionEvaluation {
	id: number;
	question: string;
	studentAnswer: string;
	modelAnswer: string;
	score: number;
	maxScore: number;
	feedback: string;
	evaluation: "correct" | "partial" | "incorrect";
}

const mockEvaluations: QuestionEvaluation[] = [
	{
		id: 1,
		question: "Explain Newton's First Law of Motion",
		studentAnswer:
			"An object at rest stays at rest unless acted upon by an external force.",
		modelAnswer:
			"Newton's First Law states that an object at rest stays at rest and an object in motion stays in motion with the same speed and direction unless acted upon by an external force. This is also known as the law of inertia.",
		score: 7,
		maxScore: 10,
		feedback:
			"Good understanding of the basic concept. However, the answer is incomplete as it doesn't mention objects in motion. Also, the term 'inertia' should be included.",
		evaluation: "partial",
	},
	{
		id: 2,
		question: "What is photosynthesis?",
		studentAnswer:
			"Process where plants convert sunlight into energy using chlorophyll.",
		modelAnswer:
			"Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar (glucose). This process primarily occurs in the chloroplasts using chlorophyll.",
		score: 9,
		maxScore: 10,
		feedback:
			"Excellent answer with key concepts covered. Minor improvement would be to mention CO2 and water as inputs, and oxygen as output.",
		evaluation: "correct",
	},
	{
		id: 3,
		question: "Define democracy",
		studentAnswer: "A system where people vote for leaders.",
		modelAnswer:
			"Democracy is a system of government where power is vested in the people, who exercise it directly or through elected representatives. It includes principles of majority rule with minority rights, free and fair elections, rule of law, and protection of basic human rights and freedoms.",
		score: 5,
		maxScore: 10,
		feedback:
			"The answer is oversimplified. While voting is a component of democracy, the definition is missing key aspects like representation, equal rights, rule of law, and protection of freedoms.",
		evaluation: "partial",
	},
	{
		id: 4,
		question: "Calculate the area of a circle with radius 5 cm",
		studentAnswer: "Area = πr² = π × 5² = 25π = 78.5 cm²",
		modelAnswer: "Area = πr² = π × 5² = 25π ≈ 78.54 cm² (using π ≈ 3.1416)",
		score: 10,
		maxScore: 10,
		feedback: "Perfect answer with correct formula and calculation.",
		evaluation: "correct",
	},
	{
		id: 5,
		question: "What is the speed of light?",
		studentAnswer: "300,000 km/s",
		modelAnswer: "The speed of light in vacuum is approximately 299,792 km/s.",
		score: 8,
		maxScore: 10,
		feedback:
			"Close approximation. The exact value is 299,792 km/s, but 300,000 km/s is commonly used for simplicity.",
		evaluation: "correct",
	},
];

export default function ViewEvaluationPage() {
	const router = useRouter();
	const params = useParams();
	const testId = params.testId as string;
	const answerId = params.answerId as string;

	const totalScore = mockEvaluations.reduce((acc, q) => acc + q.score, 0);
	const maxTotalScore = mockEvaluations.reduce((acc, q) => acc + q.maxScore, 0);
	const percentage = Math.round((totalScore / maxTotalScore) * 100);

	const correctCount = mockEvaluations.filter(
		(q) => q.evaluation === "correct",
	).length;
	const partialCount = mockEvaluations.filter(
		(q) => q.evaluation === "partial",
	).length;
	const incorrectCount = mockEvaluations.filter(
		(q) => q.evaluation === "incorrect",
	).length;

	const getEvaluationBadge = (evaluation: QuestionEvaluation["evaluation"]) => {
		const configs = {
			correct: {
				className: "border-green-500/20 bg-green-500/10 text-green-600",
				icon: CheckCircleIcon,
				label: "Correct",
			},
			partial: {
				className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-600",
				icon: AlertCircleIcon,
				label: "Partial Credit",
			},
			incorrect: {
				className: "border-red-500/20 bg-red-500/10 text-red-600",
				icon: XCircleIcon,
				label: "Incorrect",
			},
		};

		const config = configs[evaluation];
		const Icon = config.icon;

		return (
			<Badge className={config.className}>
				<Icon className="mr-1 h-3 w-3" />
				{config.label}
			</Badge>
		);
	};

	const handleExport = () => {
		console.log("Exporting evaluation...");
	};

	return (
		<DashboardLayout
			title="View Evaluation"
			description={`Detailed evaluation for answer sheet`}
			action={
				<div className="flex gap-2">
					<Button variant="outline" onClick={handleExport}>
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
				{/* Summary Card */}
				<Card>
					<CardHeader>
						<CardTitle>Evaluation Summary</CardTitle>
						<CardDescription>
							Overall performance and score breakdown
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-6 md:grid-cols-5">
							<div>
								<p className="text-muted-foreground text-sm">Total Score</p>
								<p className="font-bold text-3xl">
									{totalScore}/{maxTotalScore}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Percentage</p>
								<p
									className={`font-bold text-3xl ${
										percentage >= 80
											? "text-green-600"
											: percentage >= 60
												? "text-yellow-600"
												: "text-red-600"
									}`}
								>
									{percentage}%
								</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Correct</p>
								<p className="font-bold text-2xl text-green-600">
									{correctCount}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Partial</p>
								<p className="font-bold text-2xl text-yellow-600">
									{partialCount}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Incorrect</p>
								<p className="font-bold text-2xl text-red-600">
									{incorrectCount}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Question-by-Question Evaluation */}
				<div className="space-y-4">
					{mockEvaluations.map((evaluation) => (
						<Card key={evaluation.id}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<CardTitle className="text-lg">
											Question {evaluation.id}
										</CardTitle>
										<CardDescription className="mt-2">
											{evaluation.question}
										</CardDescription>
									</div>
									<div className="flex items-center gap-3">
										{getEvaluationBadge(evaluation.evaluation)}
										<div className="text-right">
											<p className="text-muted-foreground text-sm">Score</p>
											<p className="font-bold text-xl">
												{evaluation.score}/{evaluation.maxScore}
											</p>
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Student Answer */}
								<div>
									<p className="mb-2 font-medium text-sm">Student Answer:</p>
									<div className="rounded-md bg-blue-500/5 p-3">
										<p className="text-sm">{evaluation.studentAnswer}</p>
									</div>
								</div>

								{/* Model Answer */}
								<div>
									<p className="mb-2 font-medium text-sm">Model Answer:</p>
									<div className="rounded-md bg-green-500/5 p-3">
										<p className="text-sm">{evaluation.modelAnswer}</p>
									</div>
								</div>

								{/* Feedback */}
								<div>
									<p className="mb-2 font-medium text-sm">AI Feedback:</p>
									<div className="rounded-md border border-purple-500/20 bg-purple-500/5 p-3">
										<p className="text-sm">{evaluation.feedback}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Action Buttons */}
				<div className="flex justify-between">
					<Button
						variant="outline"
						onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}
					>
						Back to Evaluation Panel
					</Button>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => router.push(`/quicks/tests/${testId}/report`)}
						>
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
