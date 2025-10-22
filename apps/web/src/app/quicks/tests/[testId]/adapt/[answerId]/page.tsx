"use client";

import { Badge } from "@gb/ui/components/ui/badge";
import { Button } from "@gb/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@gb/ui/components/ui/card";
import { Input } from "@gb/ui/components/ui/input";
import { Label } from "@gb/ui/components/ui/label";
import { Textarea } from "@gb/ui/components/ui/textarea";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import { FeatureGuard } from "@gb-element/quicks/components/FeatureGuard";
import {
	AlertTriangleIcon,
	CheckCircleIcon,
	InfoIcon,
	SaveIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface Question {
	id: number;
	question: string;
	studentAnswer: string;
	aiScore: number;
	maxScore: number;
	aiJustification: string;
	aiRecommendations: string[];
	humanVerified: boolean;
}

const mockQuestions: Question[] = [
	{
		id: 1,
		question: "Explain Newton's First Law of Motion",
		studentAnswer:
			"An object at rest stays at rest unless acted upon by an external force.",
		aiScore: 7,
		maxScore: 10,
		aiJustification:
			"Student demonstrates basic understanding of inertia concept. However, the answer lacks detail about objects in motion and the complete statement of the law.",
		aiRecommendations: [
			"Include the second part: 'An object in motion stays in motion with the same speed and direction'",
			"Mention the term 'inertia' explicitly",
			"Provide a real-world example",
		],
		humanVerified: false,
	},
	{
		id: 2,
		question: "What is photosynthesis?",
		studentAnswer:
			"Process where plants convert sunlight into energy using chlorophyll.",
		aiScore: 9,
		maxScore: 10,
		aiJustification:
			"Excellent answer covering the main components. Minor improvement would be to mention CO2 and water as inputs.",
		aiRecommendations: [
			"Add information about carbon dioxide and water as reactants",
			"Mention oxygen as a byproduct",
		],
		humanVerified: true,
	},
	{
		id: 3,
		question: "Define democracy",
		studentAnswer: "A system where people vote for leaders.",
		aiScore: 5,
		maxScore: 10,
		aiJustification:
			"Basic understanding shown but oversimplified. Missing key aspects like representation, equal rights, and rule of law.",
		aiRecommendations: [
			"Elaborate on the concept of representation",
			"Mention equal rights and freedoms",
			"Include the importance of rule of law",
			"Discuss the role of institutions",
		],
		humanVerified: false,
	},
];

export default function AdaptationPanelPage() {
	const router = useRouter();
	const params = useParams();
	const testId = params.testId as string;
	const answerId = params.answerId as string;

	const [questions, setQuestions] = useState<Question[]>(mockQuestions);
	const [editingId, setEditingId] = useState<number | null>(null);

	const handleScoreChange = (id: number, newScore: number) => {
		setQuestions(
			questions.map((q) =>
				q.id === id ? { ...q, aiScore: Math.min(newScore, q.maxScore) } : q,
			),
		);
	};

	const handleJustificationChange = (id: number, newJustification: string) => {
		setQuestions(
			questions.map((q) =>
				q.id === id ? { ...q, aiJustification: newJustification } : q,
			),
		);
	};

	const handleVerify = (id: number) => {
		setQuestions(
			questions.map((q) => (q.id === id ? { ...q, humanVerified: true } : q)),
		);
		setEditingId(null);
	};

	const handleSaveAll = () => {
		// Save all changes and navigate back
		router.push(`/quicks/tests/${testId}/evaluate`);
	};

	const verifiedCount = questions.filter((q) => q.humanVerified).length;
	const averageScore = Math.round(
		(questions.reduce((acc, q) => acc + q.aiScore, 0) /
			questions.reduce((acc, q) => acc + q.maxScore, 0)) *
			100,
	);

	return (
		<FeatureGuard>
			<DashboardLayout
				title="Adaptation Panel"
				description={`Human verification and adjustment for Student Answer`}
				action={
					<Button onClick={handleSaveAll}>
						<SaveIcon className="mr-2 h-4 w-4" />
						Save & Finalize
					</Button>
				}
			>
				<div className="space-y-6">
					{/* Summary Card */}
					<Card>
						<CardHeader>
							<CardTitle>Evaluation Summary</CardTitle>
							<CardDescription>
								Overview of AI evaluation and human verification status
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
								<div>
									<p className="text-muted-foreground text-sm">
										Total Questions
									</p>
									<p className="font-bold text-2xl">{questions.length}</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Average Score</p>
									<p className="font-bold text-2xl text-blue-600">
										{averageScore}%
									</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">
										Human Verified
									</p>
									<p className="font-bold text-2xl text-green-600">
										{verifiedCount}/{questions.length}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">
										Pending Review
									</p>
									<p className="font-bold text-2xl text-yellow-600">
										{questions.length - verifiedCount}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Questions Review */}
					<div className="space-y-4">
						{questions.map((question) => (
							<Card
								key={question.id}
								className={
									question.humanVerified ? "border-green-500/50" : undefined
								}
							>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<CardTitle className="text-lg">
													Question {question.id}
												</CardTitle>
												{question.humanVerified ? (
													<Badge className="border-green-500/20 bg-green-500/10 text-green-600">
														<CheckCircleIcon className="mr-1 h-3 w-3" />
														Verified
													</Badge>
												) : (
													<Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-600">
														<AlertTriangleIcon className="mr-1 h-3 w-3" />
														Needs Review
													</Badge>
												)}
											</div>
											<CardDescription className="mt-2">
												{question.question}
											</CardDescription>
										</div>
										<div className="text-right">
											<p className="text-muted-foreground text-sm">Score</p>
											<p className="font-bold text-xl">
												{question.aiScore}/{question.maxScore}
											</p>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Student Answer */}
									<div>
										<Label className="text-muted-foreground text-sm">
											Student Answer
										</Label>
										<div className="mt-1 rounded-md bg-muted p-3">
											<p className="text-sm">{question.studentAnswer}</p>
										</div>
									</div>

									{/* AI Evaluation */}
									<div className="space-y-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
										<div className="flex items-center gap-2">
											<InfoIcon className="h-4 w-4 text-blue-600" />
											<h4 className="font-semibold text-sm">AI Evaluation</h4>
										</div>

										{/* AI Justification */}
										<div>
											<Label className="text-muted-foreground text-xs">
												Justification
											</Label>
											{editingId === question.id ? (
												<Textarea
													value={question.aiJustification}
													onChange={(e) =>
														handleJustificationChange(
															question.id,
															e.target.value,
														)
													}
													rows={3}
													className="mt-1"
												/>
											) : (
												<p className="mt-1 text-sm">
													{question.aiJustification}
												</p>
											)}
										</div>

										{/* AI Recommendations */}
										<div>
											<Label className="text-muted-foreground text-xs">
												Recommendations for Improvement
											</Label>
											<ul className="mt-1 space-y-1">
												{question.aiRecommendations.map((rec, idx) => (
													<li key={idx} className="flex text-sm">
														<span className="mr-2 text-blue-600">•</span>
														{rec}
													</li>
												))}
											</ul>
										</div>
									</div>

									{/* Human Adjustment Controls */}
									<div className="flex items-center justify-between gap-4 rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
										<div className="flex-1">
											<Label className="text-sm">Adjust Score</Label>
											<div className="mt-2 flex items-center gap-2">
												<Input
													type="number"
													min={0}
													max={question.maxScore}
													value={question.aiScore}
													onChange={(e) =>
														handleScoreChange(
															question.id,
															Number.parseInt(e.target.value, 10) || 0,
														)
													}
													className="w-20"
													disabled={
														question.humanVerified && editingId !== question.id
													}
												/>
												<span className="text-muted-foreground text-sm">
													/ {question.maxScore}
												</span>
											</div>
										</div>
										<div className="flex gap-2">
											{editingId === question.id ? (
												<>
													<Button
														size="sm"
														onClick={() => handleVerify(question.id)}
													>
														Save
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={() => setEditingId(null)}
													>
														Cancel
													</Button>
												</>
											) : question.humanVerified ? (
												<Button
													size="sm"
													variant="outline"
													onClick={() => setEditingId(question.id)}
												>
													Edit
												</Button>
											) : (
												<>
													<Button
														size="sm"
														onClick={() => handleVerify(question.id)}
													>
														<CheckCircleIcon className="mr-1 h-4 w-4" />
														Verify
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={() => setEditingId(question.id)}
													>
														Edit
													</Button>
												</>
											)}
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
								onClick={() =>
									router.push(`/quicks/tests/${testId}/view/${answerId}`)
								}
							>
								View Full Report
							</Button>
							<Button onClick={handleSaveAll}>
								<SaveIcon className="mr-2 h-4 w-4" />
								Save & Finalize
							</Button>
						</div>
					</div>
				</div>
			</DashboardLayout>
		</FeatureGuard>
	);
}
