"use client";

import { Button } from "@gb/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gb/ui/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gb/ui/components/ui/table";
import { DashboardLayout } from "../../../../components/shared/DashboardLayout.js";
import { FeatureGuard } from "../../../../components/shared/FeatureGuard.js";
import { CheckCircleIcon, XCircleIcon, DownloadIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const mockResults = [
	{ id: 1, question: "What is 2+2?", answer: "4", correct: true, score: 100 },
	{ id: 2, question: "Capital of France?", answer: "Paris", correct: true, score: 100 },
	{ id: 3, question: "Largest planet?", answer: "Saturn", correct: false, score: 0 },
];

export default function ResultsPage() {
	const router = useRouter();
	const totalScore = Math.round(mockResults.reduce((acc, r) => acc + r.score, 0) / mockResults.length);

	return (
		<FeatureGuard>
			<DashboardLayout
				title="Test Results"
				description="View detailed results and analysis"
				action={
					<Button variant="outline">
						<DownloadIcon />
						Export Results
					</Button>
				}
			>
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Card>
							<CardHeader>
								<CardDescription>Overall Score</CardDescription>
								<CardTitle className="text-3xl">{totalScore}%</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<CardDescription>Total Questions</CardDescription>
								<CardTitle className="text-3xl">{mockResults.length}</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<CardDescription>Correct</CardDescription>
								<CardTitle className="text-3xl text-green-600">
									{mockResults.filter((r) => r.correct).length}
								</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<CardDescription>Incorrect</CardDescription>
								<CardTitle className="text-3xl text-red-600">
									{mockResults.filter((r) => !r.correct).length}
								</CardTitle>
							</CardHeader>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Detailed Results</CardTitle>
							<CardDescription>Question-by-question breakdown</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Question</TableHead>
										<TableHead>Answer</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Score</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{mockResults.map((result) => (
										<TableRow key={result.id}>
											<TableCell className="font-medium">{result.question}</TableCell>
											<TableCell>{result.answer}</TableCell>
											<TableCell>
												{result.correct ? (
													<CheckCircleIcon className="size-5 text-green-600" />
												) : (
													<XCircleIcon className="size-5 text-red-600" />
												)}
											</TableCell>
											<TableCell>{result.score}%</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>

					<Button variant="outline" onClick={() => router.push("/quicks")}>
						Back to Dashboard
					</Button>
				</div>
			</DashboardLayout>
		</FeatureGuard>
	);
}
