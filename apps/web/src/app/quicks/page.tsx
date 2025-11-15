"use client";

import { Button } from "@gb/ui/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@gb/ui/src/components/ui/card";
import { Input } from "@gb/ui/src/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@gb/ui/src/components/ui/pagination";
import { CreateAcademicTestDrawer } from "@gb-element/quicks/components/CreateAcademicTestDrawer";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import { EvaluatorConfigPanelV3 } from "@gb-element/quicks/components/EvaluatorConfigPanelV3";
import { UploadQuestionPaperDrawer } from "@gb-element/quicks/components/UploadQuestionPaperDrawer";
import {
	CheckCircleIcon,
	ClockIcon,
	FileTextIcon,
	PlusIcon,
	SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:8083/grade/v1";

interface AcademicTest {
	id: string;
	question_paper_id: string;
	evaluator_configuration_id: string;
	test_name: string;
	key_answers_url: string | null;
	dynamic_rubrics_url: string | null;
	updated_at: Record<string, unknown> | null;
	created_at: Record<string, unknown>;
}

interface QuestionPaper {
	id: string;
	name: string;
	raw_document_url: string;
	digitized_document_url: string | null;
	processed_document_url: string | null;
	updated_at: Record<string, unknown> | null;
	created_at: Record<string, unknown>;
}

type QuestionPaperStatus = "parsed" | "digitized" | "raw";

function getQuestionPaperStatus(qp: QuestionPaper): QuestionPaperStatus {
	if (qp.processed_document_url) {
		return "parsed";
	}
	if (qp.digitized_document_url) {
		return "digitized";
	}
	return "raw";
}

interface AcademicTestsResponse {
	success: boolean;
	status_code: number;
	status_message: string;
	data: {
		academic_tests: AcademicTest[];
	};
	error: null | string;
	metadata: {
		service: string;
		timestamp: string;
		pagination: {
			currentPage: number;
			pageSize: number;
			totalPages: number;
			totalItems: number;
		};
	};
}

export default function QuicksDashboard() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("test");
	const [tests, setTests] = useState<AcademicTest[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [pageSize] = useState(4);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [qpDrawerOpen, setQpDrawerOpen] = useState(false);
	const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
	const [qpLoading, setQpLoading] = useState(true);
	const [qpSearchQuery, setQpSearchQuery] = useState("");
	const [qpCurrentPage, setQpCurrentPage] = useState(1);
	const [qpTotalPages, setQpTotalPages] = useState(1);
	const [qpTotalItems, setQpTotalItems] = useState(0);

	const fetchAcademicTests = useCallback(
		async (page: number) => {
			try {
				setLoading(true);
				const response = await fetch(
					`${API_BASE_URL}/academic-tests?page=${page}&pageSize=${pageSize}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch academic tests");
				}

				const data: AcademicTestsResponse = await response.json();

				if (data.success && data.data.academic_tests) {
					setTests(data.data.academic_tests);
					setTotalPages(data.metadata.pagination.totalPages);
					setCurrentPage(data.metadata.pagination.currentPage);
					setTotalItems(data.metadata.pagination.totalItems);
				} else {
					setTests([]);
					setTotalPages(1);
					setTotalItems(0);
				}
			} catch (error) {
				console.error("Error fetching academic tests:", error);
				toast.error("Failed to load tests. Please try again.");
				setTests([]);
				setTotalPages(1);
				setTotalItems(0);
			} finally {
				setLoading(false);
			}
		},
		[pageSize],
	);

	const fetchQuestionPapers = useCallback(
		async (page: number) => {
			try {
				setQpLoading(true);
				const response = await fetch(
					`${API_BASE_URL}/question-papers?page=${page}&pageSize=${pageSize}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch question papers");
				}

				const data = await response.json();

				if (data.success && data.data.question_papers) {
					setQuestionPapers(data.data.question_papers);
					setQpTotalPages(data.metadata.pagination.totalPages);
					setQpCurrentPage(data.metadata.pagination.currentPage);
					setQpTotalItems(data.metadata.pagination.totalItems);
				} else {
					setQuestionPapers([]);
					setQpTotalPages(1);
					setQpTotalItems(0);
				}
			} catch (error) {
				console.error("Error fetching question papers:", error);
				toast.error("Failed to load question papers. Please try again.");
				setQuestionPapers([]);
				setQpTotalPages(1);
				setQpTotalItems(0);
			} finally {
				setQpLoading(false);
			}
		},
		[pageSize],
	);

	useEffect(() => {
		fetchAcademicTests(currentPage);
	}, [currentPage, fetchAcademicTests]);

	useEffect(() => {
		if (activeTab === "question-paper") {
			fetchQuestionPapers(qpCurrentPage);
		}
	}, [qpCurrentPage, activeTab, fetchQuestionPapers]);

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		if (value === "test") {
			router.push("/quicks");
		}
	};

	// Filter tests based on search query
	const filteredTests = tests.filter((test) =>
		test.test_name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Filter question papers based on search query
	const filteredQuestionPapers = questionPapers.filter((qp) =>
		qp.name.toLowerCase().includes(qpSearchQuery.toLowerCase()),
	);

	const handleQuestionPaperClick = (qp: QuestionPaper) => {
		const status = getQuestionPaperStatus(qp);
		// Only allow navigation if the paper is parsed (has processed_document_url)
		if (status === "parsed") {
			router.push(`/quicks/question-papers/${qp.id}`);
		} else {
			toast.info(
				`This question paper is ${status}. Please wait for processing to complete.`,
			);
		}
	};

	// Calculate stats
	const stats = {
		total: tests.length,
		withKeyAnswers: tests.filter((t) => t.key_answers_url).length,
		withRubrics: tests.filter((t) => t.dynamic_rubrics_url).length,
	};

	return (
		<DashboardLayout title="">
			<div className="space-y-6">
				<nav className="overflow-hidden border-b">
					<div className="grid grid-cols-3">
						<button
							type="button"
							className={`cursor-pointer border-b-2 px-4 py-3 text-center font-semibold text-base transition-colors hover:text-foreground ${
								activeTab === "test"
									? "border-primary text-foreground"
									: "border-transparent text-muted-foreground"
							}`}
							onClick={() => handleTabChange("test")}
						>
							Test
						</button>
						<button
							type="button"
							className={`cursor-pointer border-b-2 px-4 py-3 text-center font-semibold text-base transition-colors hover:text-foreground ${
								activeTab === "question-paper"
									? "border-primary text-foreground"
									: "border-transparent text-muted-foreground"
							}`}
							onClick={() => handleTabChange("question-paper")}
						>
							Question Paper
						</button>
						<button
							type="button"
							className={`cursor-pointer border-b-2 px-4 py-3 text-center font-semibold text-base transition-colors hover:text-foreground ${
								activeTab === "evaluator-config"
									? "border-primary text-foreground"
									: "border-transparent text-muted-foreground"
							}`}
							onClick={() => handleTabChange("evaluator-config")}
						>
							Evaluator Configuration
						</button>
					</div>
				</nav>

				{activeTab === "test" && (
					<div className="mt-6 space-y-6">
						{/* Stats Cards */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<Card>
								<CardHeader className="pb-3">
									<CardDescription>Total Tests</CardDescription>
									<CardTitle className="flex items-center gap-2 text-3xl">
										<FileTextIcon className="h-8 w-8 text-primary" />
										{stats.total}
									</CardTitle>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader className="pb-3">
									<CardDescription>With Key Answers</CardDescription>
									<CardTitle className="flex items-center gap-2 text-3xl">
										<CheckCircleIcon className="h-8 w-8 text-green-600" />
										{stats.withKeyAnswers}
									</CardTitle>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader className="pb-3">
									<CardDescription>With Rubrics</CardDescription>
									<CardTitle className="flex items-center gap-2 text-3xl">
										<ClockIcon className="h-8 w-8 text-blue-600" />
										{stats.withRubrics}
									</CardTitle>
								</CardHeader>
							</Card>
						</div>

						{/* Test List */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>All Tests</CardTitle>
										<CardDescription>
											View and manage your academic tests
										</CardDescription>
									</div>
									<Button onClick={() => setDrawerOpen(true)}>
										<PlusIcon className="mr-2 h-4 w-4" />
										Create New Test
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{/* Search Bar */}
								<div className="mb-4">
									<div className="relative">
										<SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search tests..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="pl-10"
										/>
									</div>
								</div>

								{/* Test List */}
								{loading ? (
									<div className="flex items-center justify-center p-8">
										<p className="text-muted-foreground">Loading tests...</p>
									</div>
								) : filteredTests.length === 0 ? (
									<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-16 text-center">
										<div className="mb-4 text-6xl">📝</div>
										<h3 className="mb-2 font-semibold text-lg">
											{searchQuery ? "No tests found" : "No tests yet"}
										</h3>
										<p className="text-muted-foreground text-sm">
											{searchQuery
												? "Try adjusting your search query"
												: "Create your first test to get started"}
										</p>
									</div>
								) : (
									<div className="space-y-2">
										{filteredTests.map((test) => (
											<a
												key={test.id}
												href={
													test.dynamic_rubrics_url
														? `/quicks/tests/${test.id}/evaluate`
														: `/quicks/tests/${test.id}/model-answer`
												}
												className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
											>
												<div className="space-y-1">
													<div className="font-medium">{test.test_name}</div>
													<div className="text-muted-foreground text-xs">
														ID: {test.id.slice(0, 8)}...
													</div>
												</div>
												<div className="flex gap-2 text-sm">
													{test.key_answers_url && (
														<span className="rounded-full bg-green-100 px-2 py-1 text-green-700">
															Key Answers
														</span>
													)}
													{test.dynamic_rubrics_url && (
														<span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
															Rubrics
														</span>
													)}
												</div>
											</a>
										))}
									</div>
								)}
							</CardContent>
							{!loading && tests.length > 0 && totalPages > 1 && (
								<div className="border-t px-6 py-4">
									<div className="flex items-center justify-between">
										<p className="text-muted-foreground text-sm">
											Showing {(currentPage - 1) * pageSize + 1} to{" "}
											{Math.min(currentPage * pageSize, totalItems)} of{" "}
											{totalItems} tests
										</p>
										<Pagination>
											<PaginationContent>
												<PaginationItem>
													<PaginationPrevious
														onClick={() =>
															currentPage > 1 && setCurrentPage(currentPage - 1)
														}
														className={
															currentPage === 1
																? "pointer-events-none opacity-50"
																: "cursor-pointer"
														}
													/>
												</PaginationItem>
												{currentPage > 2 && (
													<PaginationItem>
														<PaginationLink
															onClick={() => setCurrentPage(1)}
															className="cursor-pointer"
														>
															1
														</PaginationLink>
													</PaginationItem>
												)}
												{currentPage > 3 && (
													<PaginationItem>
														<PaginationEllipsis />
													</PaginationItem>
												)}
												{currentPage > 1 && (
													<PaginationItem>
														<PaginationLink
															onClick={() => setCurrentPage(currentPage - 1)}
															className="cursor-pointer"
														>
															{currentPage - 1}
														</PaginationLink>
													</PaginationItem>
												)}
												<PaginationItem>
													<PaginationLink isActive className="cursor-default">
														{currentPage}
													</PaginationLink>
												</PaginationItem>
												{currentPage < totalPages && (
													<PaginationItem>
														<PaginationLink
															onClick={() => setCurrentPage(currentPage + 1)}
															className="cursor-pointer"
														>
															{currentPage + 1}
														</PaginationLink>
													</PaginationItem>
												)}
												{currentPage < totalPages - 2 && (
													<PaginationItem>
														<PaginationEllipsis />
													</PaginationItem>
												)}
												{currentPage < totalPages - 1 && (
													<PaginationItem>
														<PaginationLink
															onClick={() => setCurrentPage(totalPages)}
															className="cursor-pointer"
														>
															{totalPages}
														</PaginationLink>
													</PaginationItem>
												)}
												<PaginationItem>
													<PaginationNext
														onClick={() =>
															currentPage < totalPages &&
															setCurrentPage(currentPage + 1)
														}
														className={
															currentPage === totalPages
																? "pointer-events-none opacity-50"
																: "cursor-pointer"
														}
													/>
												</PaginationItem>
											</PaginationContent>
										</Pagination>
									</div>
								</div>
							)}
						</Card>
					</div>
				)}

				{activeTab === "question-paper" && (
					<div className="mt-6 space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>All Question Papers</CardTitle>
										<CardDescription>
											View and manage your question papers
										</CardDescription>
									</div>
									<Button onClick={() => setQpDrawerOpen(true)}>
										<PlusIcon className="mr-2 h-4 w-4" />
										Upload Question Paper
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="mb-4">
									<div className="relative">
										<SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search question papers..."
											value={qpSearchQuery}
											onChange={(e) => setQpSearchQuery(e.target.value)}
											className="pl-10"
										/>
									</div>
								</div>

								{qpLoading ? (
									<div className="flex items-center justify-center p-8">
										<p className="text-muted-foreground">
											Loading question papers...
										</p>
									</div>
								) : filteredQuestionPapers.length === 0 ? (
									<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-16 text-center">
										<div className="mb-4 text-6xl">📄</div>
										<h3 className="mb-2 font-semibold text-lg">
											{qpSearchQuery
												? "No question papers found"
												: "No question papers yet"}
										</h3>
										<p className="text-muted-foreground text-sm">
											{qpSearchQuery
												? "Try adjusting your search query"
												: "Upload your first question paper to get started"}
										</p>
									</div>
								) : (
									<div className="space-y-2">
										{filteredQuestionPapers.map((qp) => {
											const status = getQuestionPaperStatus(qp);
											const isParsed = status === "parsed";
											return (
												<button
													type="button"
													key={qp.id}
													onClick={() => handleQuestionPaperClick(qp)}
													className={`flex w-full items-center justify-between rounded-lg border p-4 text-left ${
														isParsed
															? "cursor-pointer transition-colors hover:bg-accent"
															: "cursor-default"
													}`}
												>
													<div className="space-y-1">
														<div className="font-medium">{qp.name}</div>
														<div className="text-muted-foreground text-xs">
															ID: {qp.id.slice(0, 8)}...
														</div>
													</div>
													<div className="flex items-center gap-2">
														<span
															className={`rounded-full px-2 py-1 text-xs ${
																status === "parsed"
																	? "bg-green-100 text-green-700"
																	: status === "digitized"
																		? "bg-blue-100 text-blue-700"
																		: "bg-gray-100 text-gray-700"
															}`}
														>
															{status === "parsed"
																? "Parsed"
																: status === "digitized"
																	? "Digitized"
																	: "Raw"}
														</span>
														<FileTextIcon className="h-5 w-5 text-muted-foreground" />
													</div>
												</button>
											);
										})}
									</div>
								)}
							</CardContent>
							{!qpLoading && questionPapers.length > 0 && qpTotalPages > 1 && (
								<div className="border-t px-6 py-4">
									<div className="flex items-center justify-between">
										<p className="text-muted-foreground text-sm">
											Showing {(qpCurrentPage - 1) * pageSize + 1} to{" "}
											{Math.min(qpCurrentPage * pageSize, qpTotalItems)} of{" "}
											{qpTotalItems} question papers
										</p>
										<Pagination>
											<PaginationContent>
												<PaginationItem>
													<PaginationPrevious
														onClick={() =>
															qpCurrentPage > 1 &&
															setQpCurrentPage(qpCurrentPage - 1)
														}
														className={
															qpCurrentPage === 1
																? "pointer-events-none opacity-50"
																: "cursor-pointer"
														}
													/>
												</PaginationItem>
												{qpCurrentPage > 2 && (
													<PaginationItem>
														<PaginationLink
															onClick={() => setQpCurrentPage(1)}
															className="cursor-pointer"
														>
															1
														</PaginationLink>
													</PaginationItem>
												)}
												{qpCurrentPage > 3 && (
													<PaginationItem>
														<PaginationEllipsis />
													</PaginationItem>
												)}
												{qpCurrentPage > 1 && (
													<PaginationItem>
														<PaginationLink
															onClick={() =>
																setQpCurrentPage(qpCurrentPage - 1)
															}
															className="cursor-pointer"
														>
															{qpCurrentPage - 1}
														</PaginationLink>
													</PaginationItem>
												)}
												<PaginationItem>
													<PaginationLink isActive className="cursor-default">
														{qpCurrentPage}
													</PaginationLink>
												</PaginationItem>
												{qpCurrentPage < qpTotalPages && (
													<PaginationItem>
														<PaginationLink
															onClick={() =>
																setQpCurrentPage(qpCurrentPage + 1)
															}
															className="cursor-pointer"
														>
															{qpCurrentPage + 1}
														</PaginationLink>
													</PaginationItem>
												)}
												{qpCurrentPage < qpTotalPages - 2 && (
													<PaginationItem>
														<PaginationEllipsis />
													</PaginationItem>
												)}
												{qpCurrentPage < qpTotalPages - 1 && (
													<PaginationItem>
														<PaginationLink
															onClick={() => setQpCurrentPage(qpTotalPages)}
															className="cursor-pointer"
														>
															{qpTotalPages}
														</PaginationLink>
													</PaginationItem>
												)}
												<PaginationItem>
													<PaginationNext
														onClick={() =>
															qpCurrentPage < qpTotalPages &&
															setQpCurrentPage(qpCurrentPage + 1)
														}
														className={
															qpCurrentPage === qpTotalPages
																? "pointer-events-none opacity-50"
																: "cursor-pointer"
														}
													/>
												</PaginationItem>
											</PaginationContent>
										</Pagination>
									</div>
								</div>
							)}
						</Card>
					</div>
				)}

				{activeTab === "evaluator-config" && (
					<div className="mt-6">
						<EvaluatorConfigPanelV3
							onConfigSelected={(config) => {
								console.log("Config selected:", config);
								toast.success("Configuration saved successfully!");
							}}
						/>
					</div>
				)}
			</div>
			<CreateAcademicTestDrawer
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				onTestCreated={() => fetchAcademicTests(currentPage)}
			/>
			<UploadQuestionPaperDrawer
				open={qpDrawerOpen}
				onOpenChange={setQpDrawerOpen}
				onQuestionPaperUploaded={() => fetchQuestionPapers(qpCurrentPage)}
			/>
		</DashboardLayout>
	);
}
