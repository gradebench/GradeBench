"use client";

import { Button } from "@gb/ui/src/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@gb/ui/src/components/ui/drawer";
import { Input } from "@gb/ui/src/components/ui/input";
import { Label } from "@gb/ui/src/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@gb/ui/src/components/ui/select";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@gb/ui/src/components/ui/tabs";
import { FileUp, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface CreateAcademicTestDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onTestCreated?: () => void;
}

interface QuestionPaper {
	id: string;
	name: string;
}

interface EvaluatorConfiguration {
	id: string;
	config_name: string;
}

export function CreateAcademicTestDrawer({
	open,
	onOpenChange,
	onTestCreated,
}: CreateAcademicTestDrawerProps) {
	const [testName, setTestName] = useState("");
	const [questionPaperId, setQuestionPaperId] = useState("");
	const [evaluatorConfigId, setEvaluatorConfigId] = useState("");
	const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
	const [evaluatorConfigs, setEvaluatorConfigs] = useState<
		EvaluatorConfiguration[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [uploadMode, setUploadMode] = useState<"select" | "upload">("select");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [generatingModelAnswer, setGeneratingModelAnswer] = useState(false);
	const [generatingRubrics, setGeneratingRubrics] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL as string}/grade/v1`;

	const fetchData = useCallback(async () => {
		setFetching(true);
		try {
			const [qpResponse, ecResponse] = await Promise.all([
				fetch(`${API_BASE_URL}/question-papers`),
				fetch(`${API_BASE_URL}/evaluator-configurations`),
			]);

			if (qpResponse.ok) {
				const qpData = await qpResponse.json();
				if (qpData.success && qpData.data?.question_papers) {
					setQuestionPapers(qpData.data.question_papers);
				}
			}

			if (ecResponse.ok) {
				const ecData = await ecResponse.json();
				if (ecData.success && ecData.data?.evaluator_configurations) {
					setEvaluatorConfigs(ecData.data.evaluator_configurations);
				}
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			toast.error("Failed to load options");
		} finally {
			setFetching(false);
		}
	}, [API_BASE_URL]);

	useEffect(() => {
		if (open) {
			fetchData();
		}
	}, [open, fetchData]);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.type !== "application/pdf") {
				toast.error("Please select a PDF file");
				return;
			}
			if (file.size > 50 * 1024 * 1024) {
				toast.error("File size must be less than 50MB");
				return;
			}
			setSelectedFile(file);
		}
	};

	const handleRemoveFile = () => {
		setSelectedFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const uploadQuestionPaper = async (file: File): Promise<string> => {
		setUploading(true);
		setUploadProgress(0);

		try {
			// Step 1: Get pre-signed upload URL
			const uploadUrlResponse = await fetch(
				`${API_BASE_URL}/question-papers/upload/raw`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ file_name: file.name }),
				},
			);

			if (!uploadUrlResponse.ok) {
				throw new Error("Failed to get upload URL");
			}

			const uploadData = await uploadUrlResponse.json();
			const questionPapersData =
				uploadData.data?.question_papers || uploadData.question_papers;
			const { upload_url, file_url } = questionPapersData || {};

			if (!upload_url || !file_url) {
				throw new Error("Invalid upload URL response");
			}

			setUploadProgress(30);

			// Step 2: Upload file to S3
			const s3Response = await fetch(upload_url, {
				method: "PUT",
				headers: { "Content-Type": "application/pdf" },
				body: file,
			});

			if (!s3Response.ok) {
				throw new Error("Failed to upload file to S3");
			}

			setUploadProgress(60);

			// Step 3: Create question paper record
			const createResponse = await fetch(`${API_BASE_URL}/question-papers`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: file.name.replace(/\.pdf$/i, ""),
					raw_document_url: file_url,
				}),
			});

			if (!createResponse.ok) {
				throw new Error("Failed to create question paper");
			}

			const createResult = await createResponse.json();

			if (!createResult.success) {
				throw new Error(
					createResult.error || "Failed to create question paper",
				);
			}

			// Extract question paper ID from response
			let questionPaperId: string | null = null;

			if (createResult.data?.question_papers?.id) {
				questionPaperId = createResult.data.question_papers.id;
			} else if (createResult.data?.question_paper?.id) {
				questionPaperId = createResult.data.question_paper.id;
			} else if (createResult.data?.id) {
				questionPaperId = createResult.data.id;
			} else if (createResult.question_papers?.id) {
				questionPaperId = createResult.question_papers.id;
			} else if (createResult.question_paper?.id) {
				questionPaperId = createResult.question_paper.id;
			} else if (createResult.id) {
				questionPaperId = createResult.id;
			}

			if (!questionPaperId) {
				throw new Error("No question paper ID returned from upload");
			}

			setUploadProgress(100);
			toast.success("Question paper uploaded successfully");
			return questionPaperId;
		} catch (error) {
			console.error("Error uploading question paper:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to upload question paper",
			);
			throw error;
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async () => {
		if (!testName.trim()) {
			toast.error("Please enter a test name");
			return;
		}

		let finalQuestionPaperId = questionPaperId;

		// If upload mode and file selected, upload first
		if (uploadMode === "upload" && selectedFile) {
			try {
				finalQuestionPaperId = await uploadQuestionPaper(selectedFile);
			} catch (_error) {
				return; // Upload failed, don't proceed
			}
		} else if (uploadMode === "upload" && !selectedFile) {
			toast.error("Please select a file to upload");
			return;
		} else if (uploadMode === "select" && !questionPaperId) {
			toast.error("Please select a question paper");
			return;
		}

		if (!finalQuestionPaperId) {
			toast.error("Please select or upload a question paper");
			return;
		}

		if (!evaluatorConfigId) {
			toast.error("Please select an evaluator configuration");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${API_BASE_URL}/academic-tests`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					test_name: testName.trim(),
					question_paper_id: finalQuestionPaperId,
					evaluator_configuration_id: evaluatorConfigId,
				}),
			});

			const result = await response.json();

			if (result.success && response.ok) {
				const testId =
					result.data?.academic_test?.id ||
					result.data?.id ||
					result.academic_test?.id ||
					result.id;

				if (!testId) {
					throw new Error("No test ID returned from creation");
				}

				toast.success("Test created successfully");

				// Generate model answers and rubrics automatically
				setLoading(false);
				setGeneratingModelAnswer(true);
				toast.info("Generating model answers and rubrics...", {
					duration: 10000,
				});

				try {
					const modelAnswerResponse = await fetch(
						`${API_BASE_URL}/model-answers/${testId}`,
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
						},
					);

					if (!modelAnswerResponse.ok) {
						const errorData = await modelAnswerResponse
							.json()
							.catch(() => ({}));
						throw new Error(
							errorData.message || `HTTP ${modelAnswerResponse.status}`,
						);
					}

					// Poll for model answers to be ready
					let attempts = 0;
					const maxAttempts = 30;
					let modelAnswersReady = false;

					while (attempts < maxAttempts && !modelAnswersReady) {
						await new Promise((resolve) => setTimeout(resolve, 2000));
						attempts++;

						try {
							const checkResponse = await fetch(
								`${API_BASE_URL}/academic-tests/${testId}`,
							);
							if (checkResponse.ok) {
								const checkData = await checkResponse.json();
								const test =
									checkData.data?.academic_tests || checkData.data || checkData;
								if (test.key_answers_url) {
									modelAnswersReady = true;
									toast.success("Model answers generated successfully!");
								}
							}
						} catch (error) {
							console.error("Error checking model answer status:", error);
						}
					}

					if (!modelAnswersReady) {
						toast.warning(
							"Model answer generation is taking longer than expected. You can check the status later.",
						);
					}
				} catch (error) {
					console.error("Error generating model answers:", error);
					toast.error(
						error instanceof Error
							? `Model answer generation failed: ${error.message}`
							: "Failed to generate model answers",
					);
				} finally {
					setGeneratingModelAnswer(false);
				}

				// Generate rubrics automatically
				setGeneratingRubrics(true);
				try {
					const rubricsResponse = await fetch(
						`${API_BASE_URL}/rubrics/${testId}`,
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
						},
					);

					if (!rubricsResponse.ok) {
						const errorData = await rubricsResponse.json().catch(() => ({}));
						throw new Error(errorData.message || `HTTP ${rubricsResponse.status}`);
					}

					let attempts = 0;
					const maxAttempts = 30;
					let rubricsReady = false;

					while (attempts < maxAttempts && !rubricsReady) {
						await new Promise((resolve) => setTimeout(resolve, 2000));
						attempts++;

						try {
							const checkResponse = await fetch(
								`${API_BASE_URL}/academic-tests/${testId}`,
							);
							if (checkResponse.ok) {
								const checkData = await checkResponse.json();
								const test =
									checkData.data?.academic_tests || checkData.data || checkData;
								if (test.rubrics_url) {
									rubricsReady = true;
									toast.success("Rubrics generated successfully!");
								}
							}
						} catch (error) {
							console.error("Error checking rubrics status:", error);
						}
					}

					if (!rubricsReady) {
						toast.warning("Rubrics generation is taking longer than expected.");
					}
				} catch (error) {
					console.error("Error generating rubrics:", error);
					toast.error(
						error instanceof Error
							? `Rubrics generation failed: ${error.message}`
							: "Failed to generate rubrics",
					);
				} finally {
					setGeneratingRubrics(false);
				}

				// Reset form and close
				setTestName("");
				setQuestionPaperId("");
				setEvaluatorConfigId("");
				setSelectedFile(null);
				onOpenChange(false);
				onTestCreated?.();
			} else {
				throw new Error(result.error || "Failed to create test");
			}
		} catch (error) {
			console.error("Error creating test:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to create test",
			);
		} finally {
			setLoading(false);
			setGeneratingModelAnswer(false);
			setGeneratingRubrics(false);
		}
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
			<DrawerContent className="h-[85vh]">
				<DrawerHeader className="px-8 py-6">
					<DrawerTitle className="text-2xl">Create New Test</DrawerTitle>
					<DrawerDescription className="text-base">
						Create a new academic test by selecting a question paper and
						evaluator configuration
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto px-8 py-6">
					{(generatingModelAnswer || generatingRubrics) && (
						<div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
							<div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 shadow-lg">
								<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
								<div className="text-center">
									<h3 className="font-semibold text-lg">
										{generatingModelAnswer ? "Generating Model Answers..." : "Generating Rubrics..."}
									</h3>
									<p className="mt-2 text-muted-foreground">
										{generatingModelAnswer ? "Please wait while we generate the model answers for your test. This may take a few moments." : "Please wait while we generate the rubrics for your test. This may take a few moments."}
									</p>
								</div>
							</div>
						</div>
					)}

					<div className="mx-auto max-w-2xl space-y-6">
						<div>
							<Label htmlFor="testName" className="font-semibold text-lg">
								Test Name
							</Label>
							<Input
								id="testName"
								type="text"
								placeholder="e.g., Mathematics Final Exam 2024"
								value={testName}
								onChange={(e) => setTestName(e.target.value)}
								className="mt-2"
								disabled={loading || generatingModelAnswer || generatingRubrics}
							/>
						</div>
						<div>
							<Label htmlFor="questionPaper" className="font-semibold text-lg">
								Question Paper
							</Label>
							<Tabs
								value={uploadMode}
								onValueChange={(value) =>
									setUploadMode(value as "select" | "upload")
								}
								className="mt-2"
							>
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger
										value="select"
										disabled={loading || uploading || generatingModelAnswer || generatingRubrics}
									>
										Select Existing
									</TabsTrigger>
									<TabsTrigger
										value="upload"
										disabled={loading || uploading || generatingModelAnswer || generatingRubrics}
									>
										Upload New
									</TabsTrigger>
								</TabsList>

								<TabsContent value="select" className="mt-4 space-y-3">
									<Select
										value={questionPaperId}
										onValueChange={setQuestionPaperId}
										disabled={
											loading || fetching || uploading || generatingModelAnswer || generatingRubrics
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a question paper" />
										</SelectTrigger>
										<SelectContent>
											{questionPapers.map((qp) => (
												<SelectItem key={qp.id} value={qp.id}>
													{qp.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setUploadMode("upload")}
										disabled={loading || uploading || generatingModelAnswer || generatingRubrics}
										className="w-full gap-2"
									>
										<Upload className="h-4 w-4" />
										Or Upload New Question Paper
									</Button>
								</TabsContent>

								<TabsContent value="upload" className="mt-4 space-y-3">
									<input
										ref={fileInputRef}
										type="file"
										accept="application/pdf"
										onChange={handleFileSelect}
										className="hidden"
										disabled={loading || uploading || generatingModelAnswer || generatingRubrics}
									/>
									{selectedFile ? (
										<div className="flex w-full items-center gap-3 rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
											<FileUp className="h-8 w-8 text-primary" />
											<div className="flex-1 text-left">
												<p className="font-medium text-sm">
													{selectedFile.name}
												</p>
												<p className="text-muted-foreground text-xs">
													{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
												</p>
											</div>
											<button
												type="button"
												onClick={handleRemoveFile}
												disabled={loading || uploading || generatingModelAnswer || generatingRubrics}
												className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									) : (
										<button
											type="button"
											className="group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed p-8 transition-all hover:border-primary hover:bg-primary/5 disabled:opacity-50"
											onClick={() => fileInputRef.current?.click()}
											disabled={loading || uploading || generatingModelAnswer || generatingRubrics}
										>
											<Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground transition-colors group-hover:text-primary" />
											<p className="mb-1 font-medium text-sm">
												Click to upload question paper
											</p>
											<p className="text-muted-foreground text-xs">
												PDF file up to 50MB
											</p>
										</button>
									)}
									{uploading && (
										<div className="space-y-2">
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">
													Uploading...
												</span>
												<span className="font-medium">{uploadProgress}%</span>
											</div>
											<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
												<div
													className="h-full bg-primary transition-all duration-300"
													style={{ width: `${uploadProgress}%` }}
												/>
											</div>
										</div>
									)}
								</TabsContent>
							</Tabs>
						</div>{" "}
						<div>
							<Label
								htmlFor="evaluatorConfig"
								className="font-semibold text-lg"
							>
								Evaluator Configuration
							</Label>
							<Select
								value={evaluatorConfigId}
								onValueChange={setEvaluatorConfigId}
								disabled={loading || fetching || generatingModelAnswer || generatingRubrics}
							>
								<SelectTrigger className="mt-2 w-full">
									<SelectValue placeholder="Select an evaluator configuration" />
								</SelectTrigger>
								<SelectContent>
									{evaluatorConfigs.map((ec) => (
										<SelectItem key={ec.id} value={ec.id}>
											{ec.config_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<DrawerFooter className="px-8 py-6">
					<div className="flex gap-4">
						<DrawerClose asChild>
							<Button
								variant="outline"
								size="lg"
								className="flex-1 text-base"
								disabled={loading || generatingModelAnswer || generatingRubrics}
							>
								Cancel
							</Button>
						</DrawerClose>
						<Button
							onClick={handleSubmit}
							size="lg"
							className="flex-1 text-base"
							disabled={
								!testName.trim() ||
								(uploadMode === "select" && !questionPaperId) ||
								(uploadMode === "upload" && !selectedFile) ||
								!evaluatorConfigId ||
								loading ||
								fetching ||
								generatingModelAnswer ||
								generatingRubrics
							}
						>
							{generatingRubrics
								? "Generating Rubrics..."
								: generatingModelAnswer
									? "Generating Model Answers..."
									: loading
										? "Creating Test..."
										: "Create Test"}
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
