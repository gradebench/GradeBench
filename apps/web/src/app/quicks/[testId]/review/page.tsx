"use client";

import { Button } from "@gb/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@gb/ui/components/ui/card";
import { Textarea } from "@gb/ui/components/ui/textarea";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import { FeatureGuard } from "@gb-element/quicks/components/FeatureGuard";
import { CheckCircleIcon, EditIcon, SaveIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface Question {
	id: number;
	question: string;
	studentAnswer: string;
	aiScore: number;
	aiComment: string;
}

const mockQuestions: Question[] = [
	{
		id: 1,
		question: "Explain Newton's First Law of Motion",
		studentAnswer:
			"An object at rest stays at rest unless acted upon by an external force.",
		aiScore: 85,
		aiComment: "Good answer but could include more detail about inertia.",
	},
	{
		id: 2,
		question: "What is photosynthesis?",
		studentAnswer:
			"Process where plants convert sunlight into energy using chlorophyll.",
		aiScore: 90,
		aiComment: "Excellent answer with key concepts covered.",
	},
	{
		id: 3,
		question: "Define democracy",
		studentAnswer: "A system where people vote for leaders.",
		aiScore: 70,
		aiComment:
			"Correct but oversimplified. Missing key aspects like representation.",
	},
];

export default function ReviewPage() {
	const router = useRouter();
	const params = useParams();
	const [questions, setQuestions] = useState(mockQuestions);
	const [editingId, setEditingId] = useState<number | null>(null);

	const handleScoreChange = (id: number, newScore: number) => {
		setQuestions(
			questions.map((q) => (q.id === id ? { ...q, aiScore: newScore } : q)),
		);
	};

	const handleCommentChange = (id: number, newComment: string) => {
		setQuestions(
			questions.map((q) => (q.id === id ? { ...q, aiComment: newComment } : q)),
		);
	};

	const averageScore = Math.round(
		questions.reduce((acc, q) => acc + q.aiScore, 0) / questions.length,
	);

	return (
		<FeatureGuard>
			<DashboardLayout
				title="Review & Adjust Scores"
				description="Review AI-generated scores and make adjustments"
				action={
					<Button>
						<SaveIcon className="mr-2 h-4 w-4" />
						Save & Finalize
					</Button>
				}
			>
				<div className="space-y-6">
					{/* Summary Card */}
					<Card>
						<CardHeader>
							<CardTitle>Review Summary</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-3 gap-4">
								<div className="rounded-lg bg-muted p-4 text-center">
									<p className="font-bold text-2xl">{questions.length}</p>
									<p className="text-muted-foreground text-xs">
										Total Questions
									</p>
								</div>
								<div className="rounded-lg bg-muted p-4 text-center">
									<p className="font-bold text-2xl">{averageScore}%</p>
									<p className="text-muted-foreground text-xs">Average Score</p>
								</div>
								<div className="rounded-lg bg-muted p-4 text-center">
									<p className="font-bold text-2xl">
										{questions.filter((q) => q.aiScore >= 80).length}
									</p>
									<p className="text-muted-foreground text-xs">
										High Scores (80+)
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Questions Review */}
					<div className="space-y-4">
						{questions.map((question) => (
							<Card key={question.id}>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<CardTitle className="text-lg">
												Question {question.id}
											</CardTitle>
											<CardDescription className="mt-1">
												{question.question}
											</CardDescription>
										</div>
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												setEditingId(
													editingId === question.id ? null : question.id,
												)
											}
										>
											{editingId === question.id ? (
												<CheckCircleIcon className="h-4 w-4" />
											) : (
												<EditIcon className="h-4 w-4" />
											)}
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<p className="mb-1 text-muted-foreground text-sm">
											Student Answer:
										</p>
										<p className="rounded-md bg-muted p-3 text-sm">
											{question.studentAnswer}
										</p>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<label
												htmlFor={`score-${question.id}`}
												className="mb-2 block font-medium text-sm"
											>
												AI Score
											</label>
											<input
												id={`score-${question.id}`}
												type="number"
												min="0"
												max="100"
												value={question.aiScore}
												onChange={(e) =>
													handleScoreChange(
														question.id,
														Number.parseInt(e.target.value, 10),
													)
												}
												disabled={editingId !== question.id}
												className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
											/>
										</div>
										<div>
											<label
												htmlFor={`comment-${question.id}`}
												className="mb-2 block font-medium text-sm"
											>
												AI Comment
											</label>
											<Textarea
												id={`comment-${question.id}`}
												value={question.aiComment}
												onChange={(e) =>
													handleCommentChange(question.id, e.target.value)
												}
												disabled={editingId !== question.id}
												className="min-h-[80px] disabled:opacity-50"
											/>
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
							onClick={() => router.push(`/quicks/${params.testId}/results`)}
						>
							Cancel
						</Button>
						<Button
							onClick={() => router.push(`/quicks/${params.testId}/results`)}
						>
							Save & View Final Results
						</Button>
					</div>
				</div>
			</DashboardLayout>
		</FeatureGuard>
	);
}
