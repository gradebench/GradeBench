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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@gb/ui/src/components/ui/table";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import {
	DownloadIcon,
	EyeIcon,
	MinusIcon,
	TrendingDownIcon,
	TrendingUpIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface StudentResult {
	id: string;
	studentName: string;
	totalScore: number;
	maxScore: number;
	percentage: number;
	questionsCorrect: number;
	totalQuestions: number;
	performance: "excellent" | "good" | "average" | "poor";
}

const mockResults: StudentResult[] = [
	{
		id: "1",
		studentName: "John Doe",
		totalScore: 85,
		maxScore: 100,
		percentage: 85,
		questionsCorrect: 17,
		totalQuestions: 20,
		performance: "excellent",
	},
	{
		id: "2",
		studentName: "Jane Smith",
		totalScore: 92,
		maxScore: 100,
		percentage: 92,
		questionsCorrect: 18,
		totalQuestions: 20,
		performance: "excellent",
	},
	{
		id: "3",
		studentName: "Mike Johnson",
		totalScore: 70,
		maxScore: 100,
		percentage: 70,
		questionsCorrect: 14,
		totalQuestions: 20,
		performance: "good",
	},
	{
		id: "4",
		studentName: "Sarah Williams",
		totalScore: 88,
		maxScore: 100,
		percentage: 88,
		questionsCorrect: 17,
		totalQuestions: 20,
		performance: "excellent",
	},
	{
		id: "5",
		studentName: "David Brown",
		totalScore: 65,
		maxScore: 100,
		percentage: 65,
		questionsCorrect: 13,
		totalQuestions: 20,
		performance: "average",
	},
];

export default function ReportPanelPage() {
	const router = useRouter();
	const params = useParams();
	const testId = params.testId as string;

	const handleViewDetails = (studentId: string) => {
		router.push(`/quicks/tests/${testId}/view/${studentId}`);
	};

	const handleExport = () => {
		// Export report logic
		console.log("Exporting report...");
	};

	// Calculate statistics
	const stats = {
		totalStudents: mockResults.length,
		averageScore: Math.round(
			mockResults.reduce((acc, r) => acc + r.percentage, 0) /
				mockResults.length,
		),
		highestScore: Math.max(...mockResults.map((r) => r.percentage)),
		lowestScore: Math.min(...mockResults.map((r) => r.percentage)),
		passRate: Math.round(
			(mockResults.filter((r) => r.percentage >= 60).length /
				mockResults.length) *
				100,
		),
	};

	const getPerformanceBadge = (performance: StudentResult["performance"]) => {
		const configs = {
			excellent: {
				variant: "default" as const,
				className: "border-green-500/20 bg-green-500/10 text-green-600",
				label: "Excellent",
				icon: TrendingUpIcon,
			},
			good: {
				variant: "default" as const,
				className: "border-blue-500/20 bg-blue-500/10 text-blue-600",
				label: "Good",
				icon: TrendingUpIcon,
			},
			average: {
				variant: "default" as const,
				className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-600",
				label: "Average",
				icon: MinusIcon,
			},
			poor: {
				variant: "default" as const,
				className: "border-red-500/20 bg-red-500/10 text-red-600",
				label: "Needs Improvement",
				icon: TrendingDownIcon,
			},
		};

		const config = configs[performance];
		const Icon = config.icon;

		return (
			<Badge className={config.className}>
				<Icon className="mr-1 h-3 w-3" />
				{config.label}
			</Badge>
		);
	};

	return (
		<DashboardLayout
			title="Test Report"
			description="Comprehensive evaluation report and analytics"
			action={
				<div className="flex gap-2">
					<Button variant="outline" onClick={handleExport}>
						<DownloadIcon className="mr-2 h-4 w-4" />
						Export Report
					</Button>
					<Button
						onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}
					>
						Back to Evaluation
					</Button>
				</div>
			}
		>
			<div className="space-y-6">
				{/* Summary Statistics */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-5">
					<Card>
						<CardHeader className="pb-3">
							<CardDescription>Total Students</CardDescription>
							<CardTitle className="text-3xl">{stats.totalStudents}</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardDescription>Average Score</CardDescription>
							<CardTitle className="text-3xl text-blue-600">
								{stats.averageScore}%
							</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardDescription>Highest Score</CardDescription>
							<CardTitle className="text-3xl text-green-600">
								{stats.highestScore}%
							</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardDescription>Lowest Score</CardDescription>
							<CardTitle className="text-3xl text-red-600">
								{stats.lowestScore}%
							</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardDescription>Pass Rate</CardDescription>
							<CardTitle className="text-3xl text-purple-600">
								{stats.passRate}%
							</CardTitle>
						</CardHeader>
					</Card>
				</div>

				{/* Performance Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Performance Distribution</CardTitle>
						<CardDescription>
							Overview of student performance levels
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							<div className="rounded-lg bg-green-500/10 p-4 text-center">
								<p className="font-bold text-2xl text-green-600">
									{
										mockResults.filter((r) => r.performance === "excellent")
											.length
									}
								</p>
								<p className="text-muted-foreground text-xs">Excellent</p>
								<p className="text-muted-foreground text-xs">(≥ 80%)</p>
							</div>
							<div className="rounded-lg bg-blue-500/10 p-4 text-center">
								<p className="font-bold text-2xl text-blue-600">
									{mockResults.filter((r) => r.performance === "good").length}
								</p>
								<p className="text-muted-foreground text-xs">Good</p>
								<p className="text-muted-foreground text-xs">(70-79%)</p>
							</div>
							<div className="rounded-lg bg-yellow-500/10 p-4 text-center">
								<p className="font-bold text-2xl text-yellow-600">
									{
										mockResults.filter((r) => r.performance === "average")
											.length
									}
								</p>
								<p className="text-muted-foreground text-xs">Average</p>
								<p className="text-muted-foreground text-xs">(60-69%)</p>
							</div>
							<div className="rounded-lg bg-red-500/10 p-4 text-center">
								<p className="font-bold text-2xl text-red-600">
									{mockResults.filter((r) => r.performance === "poor").length}
								</p>
								<p className="text-muted-foreground text-xs">
									Needs Improvement
								</p>
								<p className="text-muted-foreground text-xs">(&lt; 60%)</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Detailed Results Table */}
				<Card>
					<CardHeader>
						<CardTitle>Detailed Student Results</CardTitle>
						<CardDescription>
							Individual student performance breakdown
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Student Name</TableHead>
									<TableHead>Score</TableHead>
									<TableHead>Percentage</TableHead>
									<TableHead>Questions</TableHead>
									<TableHead>Performance</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{mockResults.map((result) => (
									<TableRow key={result.id}>
										<TableCell className="font-medium">
											{result.studentName}
										</TableCell>
										<TableCell>
											{result.totalScore}/{result.maxScore}
										</TableCell>
										<TableCell>
											<span className="font-semibold">
												{result.percentage}%
											</span>
										</TableCell>
										<TableCell>
											{result.questionsCorrect}/{result.totalQuestions}
										</TableCell>
										<TableCell>
											{getPerformanceBadge(result.performance)}
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleViewDetails(result.id)}
											>
												<EyeIcon className="mr-2 h-4 w-4" />
												View Details
											</Button>
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
					<Button
						variant="outline"
						onClick={() => router.push(`/quicks/tests/${testId}`)}
					>
						Edit Test Configuration
					</Button>
				</div>
			</div>
		</DashboardLayout>
	);
}
