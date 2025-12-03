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
			// Step 1: Get pre-signed URL
			const urlResponse = await fetch(
				`${API_BASE_URL}/question-papers/upload/raw`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ file_name: file.name }),
				},
			);

			if (!urlResponse.ok) {
				throw new Error("Failed to get upload URL");
			}

			const urlData = await urlResponse.json();
			const questionPapersData =
				urlData.data?.question_papers || urlData.question_papers;
			const { upload_url, file_url } = questionPapersData || {};

			if (!upload_url || !file_url) {
				throw new Error("Invalid upload URL response");
			}

			// Step 2: Upload file to S3 with progress
			await new Promise<void>((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				xhr.upload.addEventListener("progress", (e) => {
					if (e.lengthComputable) {
						const progress = Math.round((e.loaded / e.total) * 100);
						setUploadProgress(progress);
					}
				});

				xhr.addEventListener("load", () => {
					if (xhr.status === 200) {
						resolve();
					} else {
						reject(new Error(`Upload failed with status ${xhr.status}`));
					}
				});

				xhr.addEventListener("error", () => {
					reject(new Error("Upload failed"));
				});

				xhr.open("PUT", upload_url);
				xhr.setRequestHeader("Content-Type", "application/pdf");
				xhr.send(file);
			});

			// Step 3: Create question paper record
			toast.info("Creating question paper record...");
			const paperName = file.name.replace(/\.pdf$/i, "");
			const createResponse = await fetch(`${API_BASE_URL}/question-papers`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: paperName,
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

			// Extract question paper ID
			let questionPaperId: string | null = null;
			if (createResult.data?.question_papers?.id) {
				questionPaperId = createResult.data.question_papers.id;
			} else if (createResult.data?.question_paper?.id) {
				questionPaperId = createResult.data.question_paper.id;
			} else if (createResult.data?.id) {
				questionPaperId = createResult.data.id;
			} else if (createResult.question_papers?.id) {
				questionPaperId = createResult.question_papers.id;
			} else if (createResult.id) {
				questionPaperId = createResult.id;
			}

			if (!questionPaperId) {
				throw new Error("Question paper ID not found in response");
			}

			// Step 4: Digitize the question paper
			toast.info("Digitizing question paper...");
			const digitizeResponse = await fetch(
				`${API_BASE_URL}/question-papers/${questionPaperId}/digitize`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
				},
			);

			if (digitizeResponse.ok) {
				const digitizeResult = await digitizeResponse.json();
				if (digitizeResult.success) {
					// Step 5: Process the question paper
					toast.info("Processing question paper...");
					try {
						const processResponse = await fetch(
							`${API_BASE_URL}/question-papers/${questionPaperId}/process`,
							{ method: "POST" },
						);
						if (processResponse.ok) {
							toast.success("Question paper uploaded and processed!");
						}
					} catch (_error) {
						// Processing is optional
					}
				}
			}

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
				const testId = result.data?.academic_tests?.id || result.data?.id;
				toast.success("Test created successfully");

				// Generate model answer
				if (testId) {
					toast.info("Generating model answer...");
					try {
						const modelAnswerResponse = await fetch(
							`${API_BASE_URL}/model-answers/${testId}`,
							{
								method: "POST",
								headers: { "Content-Type": "application/json" },
							},
						);
						if (modelAnswerResponse.ok) {
							toast.success("Model answer generated successfully!");
						} else {
							toast.warning("Test created but model answer generation failed");
						}
					} catch (error) {
						console.error("Model answer generation error:", error);
						toast.warning("Test created but model answer generation failed");
					}
				}

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
								disabled={loading}
							/>
						</div>
						<div>
							<Label htmlFor="questionPaper" className="font-semibold text-lg">
								Question Paper
							</Label>
							<Tabs
								value={uploadMode}
								onValueChange={(v) => setUploadMode(v as "select" | "upload")}
								className="mt-2"
							>
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="select">Select Existing</TabsTrigger>
									<TabsTrigger value="upload">Upload New</TabsTrigger>
								</TabsList>
								<TabsContent value="select" className="mt-4">
									<Select
										value={questionPaperId}
										onValueChange={setQuestionPaperId}
										disabled={loading || fetching}
									>
										<SelectTrigger>
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
								</TabsContent>
								<TabsContent value="upload" className="mt-4">
									{!selectedFile ? (
										<div>
											<label
												htmlFor="fileUpload"
												className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors hover:bg-accent"
											>
												<FileUp className="mb-4 h-12 w-12 text-muted-foreground" />
												<p className="mb-2 font-medium text-sm">
													Click to upload or drag and drop
												</p>
												<p className="text-muted-foreground text-xs">
													PDF (MAX. 50MB)
												</p>
											</label>
											<input
												id="fileUpload"
												ref={fileInputRef}
												type="file"
												onChange={handleFileSelect}
												className="hidden"
												disabled={loading || uploading}
												accept=".pdf"
											/>
										</div>
									) : (
										<div className="flex items-center justify-between rounded-lg border p-4">
											<div className="flex items-center gap-3">
												<Upload className="h-8 w-8 text-primary" />
												<div>
													<p className="font-medium">{selectedFile.name}</p>
													<p className="text-muted-foreground text-xs">
														{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
													</p>
													{uploading && (
														<p className="text-primary text-xs">
															Uploading: {uploadProgress}%
														</p>
													)}
												</div>
											</div>
											<Button
												variant="ghost"
												size="icon"
												onClick={handleRemoveFile}
												disabled={loading || uploading}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									)}
								</TabsContent>
							</Tabs>
						</div>

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
								disabled={loading || fetching}
							>
								<SelectTrigger className="mt-2">
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
								disabled={loading || uploading}
							>
								Cancel
							</Button>
						</DrawerClose>
						<Button
							onClick={handleSubmit}
							size="lg"
							className="flex-1 text-base"
							disabled={loading || uploading || !testName.trim()}
						>
							{loading || uploading ? "Creating..." : "Create Test"}
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
