"use client";

import { Button } from "@gb/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@gb/ui/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@gb/ui/components/ui/table";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import { FeatureGuard } from "@gb-element/quicks/components/FeatureGuard";
import { CheckCircleIcon, DownloadIcon, XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const mockResults = [
	{
		id: 1,
		question: "What is 2+2?",
		studentAnswer: "4",
		correctAnswer: "4",
		correct: true,
		score: 100,
	},
	{
		id: 2,
		question: "Capital of France?",
		studentAnswer: "Paris",
		correctAnswer: "Paris",
		correct: true,
		score: 100,
	},
	{
		id: 3,
		question: "Largest planet?",
		studentAnswer: "Saturn",
		correctAnswer: "Jupiter",
		correct: false,
		score: 0,
	},
	{
		id: 4,
		question: "Water formula?",
		studentAnswer: "H2O",
		correctAnswer: "H2O",
		correct: true,
		score: 100,
	},
	{
		id: 5,
		question: "Speed of light?",
		studentAnswer: "300,000 km/s",
		correctAnswer: "299,792 km/s",
		correct: false,
		score: 50,
	},
];

export default function ResultsPage() {
	const router = useRouter();
	const totalScore = Math.round(
		mockResults.reduce((acc, r) => acc + r.score, 0) / mockResults.length,
	);
	const correctCount = mockResults.filter((r) => r.correct).length;
	const incorrectCount = mockResults.length - correctCount;

	return (
		<FeatureGuard>
			<DashboardLayout
				title="Test Results"
				description="Detailed evaluation results and analysis"
				action={
					<Button variant="outline">
						<DownloadIcon className="mr-2 h-4 w-4" />
						Export Results
					</Button>
				}
			>
				<div className="space-y-6">
					{/* Summary Cards */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
						<Card>
							<CardHeader className="pb-3">
								<CardDescription>Overall Score</CardDescription>
								<CardTitle className="text-3xl">{totalScore}%</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardDescription>Total Questions</CardDescription>
								<CardTitle className="text-3xl">{mockResults.length}</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardDescription>Correct Answers</CardDescription>
								<CardTitle className="text-3xl text-green-600">
									{correctCount}
								</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardDescription>Incorrect Answers</CardDescription>
								<CardTitle className="text-3xl text-red-600">
									{incorrectCount}
								</CardTitle>
							</CardHeader>
						</Card>
					</div>

					{/* Detailed Results Table */}
					<Card>
						<CardHeader>
							<CardTitle>Question-by-Question Analysis</CardTitle>
							<CardDescription>
								Detailed breakdown of each question and answer
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-12">#</TableHead>
										<TableHead>Question</TableHead>
										<TableHead>Student Answer</TableHead>
										<TableHead>Correct Answer</TableHead>
										<TableHead className="w-24 text-center">Status</TableHead>
										<TableHead className="w-24 text-right">Score</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{mockResults.map((result) => (
										<TableRow key={result.id}>
											<TableCell className="font-medium">{result.id}</TableCell>
											<TableCell className="font-medium">
												{result.question}
											</TableCell>
											<TableCell>{result.studentAnswer}</TableCell>
											<TableCell className="text-muted-foreground">
												{result.correctAnswer}
											</TableCell>
											<TableCell className="text-center">
												{result.correct ? (
													<CheckCircleIcon className="mx-auto size-5 text-green-600" />
												) : (
													<XCircleIcon className="mx-auto size-5 text-red-600" />
												)}
											</TableCell>
											<TableCell className="text-right font-medium">
												{result.score}%
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>

					{/* Action Buttons */}
					<div className="flex justify-between">
						<Button variant="outline" onClick={() => router.push("/quicks")}>
							Back to Dashboard
						</Button>
						<Button onClick={() => router.push("/quicks/new")}>
							Create Another Test
						</Button>
					</div>
				</div>
			</DashboardLayout>
		</FeatureGuard>
	);
}
