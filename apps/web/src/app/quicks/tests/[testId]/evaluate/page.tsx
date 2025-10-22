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
import { Progress } from "@gb/ui/components/ui/progress";
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
import {
	CheckCircleIcon,
	ClockIcon,
	EyeIcon,
	FileTextIcon,
	PlayIcon,
	TrashIcon,
	UploadIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface UploadedAnswer {
	id: string;
	name: string;
	size: string;
	studentName: string;
	status: "pending" | "uploading" | "uploaded" | "evaluating" | "completed";
	progress?: number;
	score?: number;
}

const mockAnswers: UploadedAnswer[] = [
	{
		id: "1",
		name: "student_001.pdf",
		size: "1.2 MB",
		studentName: "John Doe",
		status: "completed",
		score: 85,
	},
	{
		id: "2",
		name: "student_002.pdf",
		size: "1.5 MB",
		studentName: "Jane Smith",
		status: "evaluating",
		progress: 65,
	},
	{
		id: "3",
		name: "student_003.pdf",
		size: "1.8 MB",
		studentName: "Mike Johnson",
		status: "uploaded",
	},
];

export default function EvaluationPanelPage() {
	const router = useRouter();
	const params = useParams();
	const testId = params.testId as string;

	const [uploadedAnswers, setUploadedAnswers] =
		useState<UploadedAnswer[]>(mockAnswers);
	const [isEvaluating, setIsEvaluating] = useState(false);

	const removeAnswer = (id: string) => {
		setUploadedAnswers(uploadedAnswers.filter((a) => a.id !== id));
	};

	const startEvaluation = () => {
		setIsEvaluating(true);
		// Simulate evaluation progress
		setTimeout(() => {
			setIsEvaluating(false);
		}, 3000);
	};

	const handleViewAnswer = (answerId: string) => {
		router.push(`/quicks/tests/${testId}/view/${answerId}`);
	};

	const handleAdaptAnswer = (answerId: string) => {
		router.push(`/quicks/tests/${testId}/adapt/${answerId}`);
	};

	const stats = {
		total: uploadedAnswers.length,
		completed: uploadedAnswers.filter((a) => a.status === "completed").length,
		evaluating: uploadedAnswers.filter((a) => a.status === "evaluating").length,
		pending: uploadedAnswers.filter(
			(a) => a.status === "uploaded" || a.status === "pending",
		).length,
	};

	const overallProgress =
		stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

	return (
		<FeatureGuard>
			<DashboardLayout
				title="Evaluation Panel"
				description={`Upload and evaluate answer sheets for test`}
				action={
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => router.push(`/quicks/tests/${testId}/report`)}
							disabled={stats.completed === 0}
						>
							View Report
						</Button>
						<Button
							onClick={startEvaluation}
							disabled={isEvaluating || stats.pending === 0}
						>
							<PlayIcon className="mr-2 h-4 w-4" />
							{isEvaluating ? "Evaluating..." : "Start Evaluation"}
						</Button>
					</div>
				}
			>
				<div className="space-y-6">
					{/* Progress Overview */}
					<Card>
						<CardHeader>
							<CardTitle>Evaluation Progress</CardTitle>
							<CardDescription>
								Track the progress of answer sheet evaluation
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Overall Progress</span>
									<span className="font-medium">
										{Math.round(overallProgress)}%
									</span>
								</div>
								<Progress value={overallProgress} className="h-2" />
							</div>

							<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
								<div className="rounded-lg bg-muted p-4 text-center">
									<p className="font-bold text-2xl">{stats.total}</p>
									<p className="text-muted-foreground text-xs">Total Answers</p>
								</div>
								<div className="rounded-lg bg-green-500/10 p-4 text-center">
									<p className="font-bold text-2xl text-green-600">
										{stats.completed}
									</p>
									<p className="text-muted-foreground text-xs">Completed</p>
								</div>
								<div className="rounded-lg bg-yellow-500/10 p-4 text-center">
									<p className="font-bold text-2xl text-yellow-600">
										{stats.evaluating}
									</p>
									<p className="text-muted-foreground text-xs">Evaluating</p>
								</div>
								<div className="rounded-lg bg-gray-500/10 p-4 text-center">
									<p className="font-bold text-2xl text-gray-600">
										{stats.pending}
									</p>
									<p className="text-muted-foreground text-xs">Pending</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Upload Section */}
					<Card>
						<CardHeader>
							<CardTitle>Upload Answer Sheets</CardTitle>
							<CardDescription>
								Upload multiple student answer sheets in PDF format
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex min-h-[150px] cursor-pointer items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted/50 transition-colors hover:border-muted-foreground/50">
								<div className="text-center">
									<UploadIcon className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
									<p className="text-muted-foreground text-sm">
										Click to upload or drag and drop multiple files
									</p>
									<p className="mt-1 text-muted-foreground text-xs">
										PDF files only (max 10MB each)
									</p>
									<Button
										variant="outline"
										onClick={() => {
											const newAnswer: UploadedAnswer = {
												id: `${uploadedAnswers.length + 1}`,
												name: `student_00${uploadedAnswers.length + 1}.pdf`,
												size: "1.3 MB",
												studentName: `Student ${uploadedAnswers.length + 1}`,
												status: "uploaded",
											};
											setUploadedAnswers([...uploadedAnswers, newAnswer]);
										}}
										className="mt-4"
									>
										Browse Files
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Answer Paper List */}
					<Card>
						<CardHeader>
							<CardTitle>Answer Paper List</CardTitle>
							<CardDescription>
								Manage uploaded answer sheets and view evaluation status
							</CardDescription>
						</CardHeader>
						<CardContent>
							{uploadedAnswers.length === 0 ? (
								<div className="py-8 text-center text-muted-foreground">
									No answer sheets uploaded yet
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Student Name</TableHead>
											<TableHead>File Name</TableHead>
											<TableHead>Size</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Score</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{uploadedAnswers.map((answer) => (
											<TableRow key={answer.id}>
												<TableCell className="font-medium">
													{answer.studentName}
												</TableCell>
												<TableCell>
													<div className="flex items-center">
														<FileTextIcon className="mr-2 h-4 w-4 text-muted-foreground" />
														{answer.name}
													</div>
												</TableCell>
												<TableCell>{answer.size}</TableCell>
												<TableCell>
													{answer.status === "completed" && (
														<Badge className="border-green-500/20 bg-green-500/10 text-green-600">
															<CheckCircleIcon className="mr-1 h-3 w-3" />
															Completed
														</Badge>
													)}
													{answer.status === "evaluating" && (
														<div className="space-y-1">
															<Badge className="border-yellow-500/20 bg-yellow-500/10 text-yellow-600">
																<ClockIcon className="mr-1 h-3 w-3" />
																Evaluating
															</Badge>
															{answer.progress && (
																<Progress
																	value={answer.progress}
																	className="h-1 w-24"
																/>
															)}
														</div>
													)}
													{(answer.status === "uploaded" ||
														answer.status === "pending") && (
														<Badge variant="outline">Pending</Badge>
													)}
												</TableCell>
												<TableCell>
													{answer.score ? `${answer.score}%` : "-"}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														{answer.status === "completed" && (
															<>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => handleViewAnswer(answer.id)}
																>
																	<EyeIcon className="h-4 w-4" />
																</Button>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => handleAdaptAnswer(answer.id)}
																>
																	Adapt
																</Button>
															</>
														)}
														<Button
															variant="ghost"
															size="sm"
															onClick={() => removeAnswer(answer.id)}
														>
															<TrashIcon className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>

					{/* Action Buttons */}
					<div className="flex justify-between">
						<Button variant="outline" onClick={() => router.push("/quicks")}>
							Back to Dashboard
						</Button>
						<Button
							onClick={() => router.push(`/quicks/tests/${testId}`)}
							variant="outline"
						>
							Edit Test Configuration
						</Button>
					</div>
				</div>
			</DashboardLayout>
		</FeatureGuard>
	);
}
