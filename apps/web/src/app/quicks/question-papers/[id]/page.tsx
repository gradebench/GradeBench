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
import { Input } from "@gb/ui/src/components/ui/input";
import { Label } from "@gb/ui/src/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@gb/ui/src/components/ui/select";
import { Textarea } from "@gb/ui/src/components/ui/textarea";
import { DashboardLayout } from "@gb-element/quicks/src/components/DashboardLayout";
import {
	ArrowLeftIcon,
	CheckCircleIcon,
	ClockIcon,
	FileTextIcon,
	Loader2Icon,
	PenLineIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GRADE_API_BASE as API_BASE_URL } from "@/lib/api";

// Types for the processed question paper data
interface QuestionPaper {
	id: string;
	name?: string;
	raw_document_url?: string | null;
	digitized_document_url?: string | null;
	processed_document_url?: string | null;
	subject?: string | null;
	exam_type?: string | null;
	total_marks?: number | null;
	duration_minutes?: number | null;
	academic_year?: string | null;
	grade_level?: string | null;
	institution?: string | null;
	instructions?: string[] | null;
	created_at?: string | null;
	updated_at?: string | null;
}

interface ProcessedQuestionPaper {
	metadata: {
		duration_minutes: number | null;
		subject: string;
		institution: string;
		exam_type: string;
		total_marks: number;
	};
	warnings?: string[];
	questions: {
		question_number: string;
		question_type: string;
		question_text: string;
		constraints?: {
			word_limit?: number;
			time_limit?: number;
		};
		marks_allocated: number;
		question_id: string;
	}[];
	question_paper_id: string;
	paper_id: string;
}

interface TestBasicInfo {
	title: string;
	category: string;
	subject: string;
	totalMarks: number;
	totalQuestions: number;
	duration: number;
	description?: string;
	instructions?: string;
}

export default function QuestionPaperDetailPage() {
	const params = useParams();
	const router = useRouter();
	const questionPaperId = params.id as string;

	const [loading, setLoading] = useState(true);
	const [questionPaper, setQuestionPaper] = useState<QuestionPaper | null>(
		null,
	);
	const [processedData, setProcessedData] =
		useState<ProcessedQuestionPaper | null>(null);
	const [basicInfo, setBasicInfo] = useState<TestBasicInfo>({
		title: "",
		category: "school",
		subject: "",
		totalMarks: 0,
		totalQuestions: 0,
		duration: 0,
		description: "",
		instructions: "",
	});

	useEffect(() => {
		async function fetchQuestionPaperData() {
			try {
				setLoading(true);

				// Fetch question paper from the list endpoint and filter by ID
				// The backend GET by ID endpoint returns empty object, so we fetch from list
				console.log("Fetching question paper:", questionPaperId);
				const response = await fetch(
					`${API_BASE_URL}/question-papers?pageSize=100`,
				);

				if (!response.ok) {
					throw new Error(
						`Failed to fetch question papers: ${response.status}`,
					);
				}

				const data = await response.json();
				console.log("Question papers list response:", data);

				let qp = null;

				// Extract question papers array from response
				if (data.success && data.data?.question_papers) {
					const questionPapers = data.data.question_papers;
					qp = questionPapers.find(
						(q: QuestionPaper) => q.id === questionPaperId,
					);
					console.log("Found question paper in list:", qp);
				}

				if (!qp) {
					console.error("Question paper not found with ID:", questionPaperId);
					throw new Error("Question paper not found");
				}

				setQuestionPaper(qp);

				// Fetch parsed questions from processed_document_url
				if (qp.processed_document_url) {
					console.log(
						"Fetching processed document from:",
						qp.processed_document_url,
					);
					try {
						const processedResponse = await fetch(qp.processed_document_url);

						if (processedResponse.ok) {
							const processedJson: ProcessedQuestionPaper =
								await processedResponse.json();
							console.log("Processed question paper data:", processedJson);
							setProcessedData(processedJson);

							// Pre-fill basic info from processed data metadata
							setBasicInfo({
								title:
									qp.name ||
									`Test from Question Paper ${questionPaperId.slice(0, 8)}`,
								category: processedJson.metadata.exam_type || "school",
								subject:
									processedJson.metadata.subject !== "Unknown"
										? processedJson.metadata.subject
										: "",
								totalMarks: processedJson.metadata.total_marks || 0,
								totalQuestions: processedJson.questions.length,
								duration: processedJson.metadata.duration_minutes || 0,
								description: "",
								instructions: qp.instructions?.join("\n") || "",
							});
						} else {
							const errorText = await processedResponse.text();
							console.error(
								"Failed to fetch processed document. Status:",
								processedResponse.status,
								"Response:",
								errorText,
							);
							throw new Error(
								`Failed to fetch processed question paper: ${processedResponse.status}`,
							);
						}
					} catch (error) {
						console.error("Could not fetch processed question paper:", error);
						toast.error(
							"Failed to load processed questions. The paper might still be processing.",
						);

						// Fallback to basic metadata from question paper
						setBasicInfo({
							title:
								qp.name ||
								`Test from Question Paper ${questionPaperId.slice(0, 8)}`,
							category: qp.exam_type || "school",
							subject: qp.subject || "",
							totalMarks: qp.total_marks || 0,
							totalQuestions: 0,
							duration: qp.duration_minutes || 0,
							description: "",
							instructions: qp.instructions?.join("\n") || "",
						});
					}
				} else {
					// No processed URL available
					console.warn(
						"No processed_document_url found in question paper:",
						qp,
					);
					toast.warning(
						"This question paper hasn't been processed yet. Please wait for processing to complete.",
					);
					setBasicInfo({
						title:
							qp.name ||
							`Test from Question Paper ${questionPaperId.slice(0, 8)}`,
						category: qp.exam_type || "school",
						subject: qp.subject || "",
						totalMarks: qp.total_marks || 0,
						totalQuestions: 0,
						duration: qp.duration_minutes || 0,
						description: "",
						instructions: qp.instructions?.join("\n") || "",
					});
				}
			} catch (error) {
				console.error("Error fetching question paper:", error);
				toast.error("Failed to load question paper details");
			} finally {
				setLoading(false);
			}
		}

		if (questionPaperId) {
			fetchQuestionPaperData();
		}
	}, [questionPaperId]);

	const handleCreateTest = async () => {
		try {
			// Validate basic info
			if (!basicInfo.title || !basicInfo.subject) {
				toast.error("Please fill in all required fields");
				return;
			}

			// TODO: Implement actual test creation API call
			toast.success("Test creation will be implemented soon");
			router.push("/quicks");
		} catch (error) {
			console.error("Error creating test:", error);
			toast.error("Failed to create test");
		}
	};

	if (loading) {
		return (
			<DashboardLayout title="Question Paper Details">
				<div className="flex min-h-[400px] items-center justify-center">
					<div className="flex flex-col items-center gap-2">
						<Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
						<p className="text-muted-foreground text-sm">
							Loading question paper...
						</p>
					</div>
				</div>
			</DashboardLayout>
		);
	}

	if (!questionPaper) {
		return (
			<DashboardLayout title="Question Paper Not Found">
				<div className="flex min-h-[400px] items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="text-6xl">📄</div>
						<h3 className="font-semibold text-lg">Question Paper Not Found</h3>
						<Button onClick={() => router.push("/quicks")}>
							<ArrowLeftIcon className="mr-2 h-4 w-4" />
							Back to Dashboard
						</Button>
					</div>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout title="Create Test from Question Paper">
			<div className="space-y-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button
							variant="outline"
							size="sm"
							onClick={() => router.push("/quicks")}
						>
							<ArrowLeftIcon className="mr-2 h-4 w-4" />
							Back
						</Button>
						<div>
							<h1 className="font-semibold text-2xl">Create Test from Paper</h1>
							<p className="text-muted-foreground text-sm">
								Review and create a test from the parsed question paper
							</p>
						</div>
					</div>
					<Badge variant="secondary" className="bg-green-100 text-green-700">
						<FileTextIcon className="mr-1 h-3 w-3" />
						Parsed
					</Badge>
				</div>

				{/* Metadata Summary */}
				{processedData?.metadata && (
					<div className="grid grid-cols-4 gap-4">
						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-blue-100 p-2">
										<FileTextIcon className="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<p className="text-muted-foreground text-xs">Subject</p>
										<p className="font-semibold">
											{processedData.metadata.subject}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-green-100 p-2">
										<CheckCircleIcon className="h-5 w-5 text-green-600" />
									</div>
									<div>
										<p className="text-muted-foreground text-xs">Total Marks</p>
										<p className="font-semibold">
											{processedData.metadata.total_marks}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-purple-100 p-2">
										<PenLineIcon className="h-5 w-5 text-purple-600" />
									</div>
									<div>
										<p className="text-muted-foreground text-xs">Questions</p>
										<p className="font-semibold">
											{processedData.questions.length}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-orange-100 p-2">
										<ClockIcon className="h-5 w-5 text-orange-600" />
									</div>
									<div>
										<p className="text-muted-foreground text-xs">Duration</p>
										<p className="font-semibold">
											{processedData.metadata.duration_minutes
												? `${processedData.metadata.duration_minutes} min`
												: "Not set"}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Test Details Section */}
				<Card>
					<CardHeader>
						<CardTitle>Test Details</CardTitle>
						<CardDescription>
							Enter the basic information about your test
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="title">Test Title *</Label>
								<Input
									id="title"
									value={basicInfo.title}
									onChange={(e) =>
										setBasicInfo({ ...basicInfo, title: e.target.value })
									}
									placeholder="e.g., Mathematics Final Exam 2024"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="category">Category *</Label>
								<Select
									value={basicInfo.category}
									onValueChange={(value) =>
										setBasicInfo({ ...basicInfo, category: value })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="school">School</SelectItem>
										<SelectItem value="university">University</SelectItem>
										<SelectItem value="competitive">Competitive</SelectItem>
										<SelectItem value="certification">Certification</SelectItem>
										<SelectItem value="custom">Custom</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="subject">Subject *</Label>
								<Input
									id="subject"
									value={basicInfo.subject}
									onChange={(e) =>
										setBasicInfo({ ...basicInfo, subject: e.target.value })
									}
									placeholder="e.g., Mathematics"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="duration">Duration (minutes)</Label>
								<Input
									id="duration"
									type="number"
									value={basicInfo.duration}
									onChange={(e) =>
										setBasicInfo({
											...basicInfo,
											duration: Number(e.target.value),
										})
									}
									placeholder="e.g., 180"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="totalMarks">Total Marks</Label>
								<Input
									id="totalMarks"
									type="number"
									value={basicInfo.totalMarks}
									onChange={(e) =>
										setBasicInfo({
											...basicInfo,
											totalMarks: Number(e.target.value),
										})
									}
									placeholder="e.g., 100"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="totalQuestions">Total Questions</Label>
								<Input
									id="totalQuestions"
									type="number"
									value={basicInfo.totalQuestions}
									disabled
									placeholder="Auto-calculated"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={basicInfo.description}
								onChange={(e) =>
									setBasicInfo({ ...basicInfo, description: e.target.value })
								}
								placeholder="Brief description of the test"
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="instructions">Instructions</Label>
							<Textarea
								id="instructions"
								value={basicInfo.instructions}
								onChange={(e) =>
									setBasicInfo({ ...basicInfo, instructions: e.target.value })
								}
								placeholder="Test instructions for students"
								rows={3}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Warnings Section (if any) */}
				{processedData?.warnings && processedData.warnings.length > 0 && (
					<Card className="border-yellow-200 bg-yellow-50">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-yellow-800">
								<span className="text-xl">⚠️</span>
								Processing Warnings
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-1 text-sm text-yellow-700">
								{processedData.warnings.map((warning, index) => (
									<li key={index} className="flex items-start gap-2">
										<span className="mt-0.5">•</span>
										<span>{warning}</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				)}

				{/* Questions from Uploaded Paper */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Questions from Uploaded Paper</CardTitle>
								<CardDescription>
									{processedData?.questions.length
										? `${processedData.questions.length} questions parsed from the document`
										: "Parsed questions will appear here"}
								</CardDescription>
							</div>
							{processedData?.metadata && (
								<div className="flex gap-2">
									<Badge variant="outline" className="font-normal">
										{processedData.metadata.subject}
									</Badge>
									<Badge variant="outline" className="font-normal">
										{processedData.metadata.total_marks} marks
									</Badge>
								</div>
							)}
						</div>
					</CardHeader>
					<CardContent>
						{!processedData || processedData.questions.length === 0 ? (
							<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-16 text-center">
								<div className="mb-4 text-6xl">📝</div>
								<h3 className="mb-2 font-semibold text-lg">
									No Questions Available Yet
								</h3>
								<p className="text-muted-foreground text-sm">
									The question paper is still being processed. Please check back
									later.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{processedData.questions.map((question, _index) => (
									<div
										key={question.question_id}
										className="group rounded-lg border bg-card p-5 shadow-sm transition-all hover:shadow-md"
									>
										<div className="mb-3 flex items-start justify-between">
											<div className="flex flex-wrap items-center gap-2">
												<Badge variant="default" className="px-3 py-1">
													Q{question.question_number}
												</Badge>
												<Badge variant="outline" className="px-3 py-1">
													{question.question_type
														.replace(/_/g, " ")
														.toUpperCase()}
												</Badge>
												<Badge variant="secondary" className="px-3 py-1">
													{question.marks_allocated} marks
												</Badge>
												{question.constraints?.word_limit && (
													<Badge variant="outline" className="text-xs">
														📝 {question.constraints.word_limit} words
													</Badge>
												)}
												{question.constraints?.time_limit && (
													<Badge variant="outline" className="text-xs">
														⏱️ {question.constraints.time_limit} min
													</Badge>
												)}
											</div>
										</div>
										<p className="leading-relaxed">{question.question_text}</p>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Action Buttons */}
				<div className="flex justify-end gap-4">
					<Button variant="outline" onClick={() => router.push("/quicks")}>
						Cancel
					</Button>
					<Button onClick={handleCreateTest}>
						<CheckCircleIcon className="mr-2 h-4 w-4" />
						Create Test
					</Button>
				</div>
			</div>
		</DashboardLayout>
	);
}
