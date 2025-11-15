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
import { FileIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UploadQuestionPaperDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onQuestionPaperUploaded?: () => void;
}

export function UploadQuestionPaperDrawer({
	open,
	onOpenChange,
	onQuestionPaperUploaded,
}: UploadQuestionPaperDrawerProps) {
	const [paperName, setPaperName] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	const API_BASE_URL = "http://localhost:8083/grade/v1";

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setFile(e.target.files[0]);
		}
	};
	const handleRemoveFile = () => {
		setFile(null);
	};

	const handleSubmit = async () => {
		if (!paperName.trim()) {
			toast.error("Please enter a question paper name");
			return;
		}

		if (!file) {
			toast.error("Please upload a file");
			return;
		}

		setLoading(true);

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

			// Step 2: Upload file to S3
			const s3Response = await fetch(upload_url, {
				method: "PUT",
				headers: { "Content-Type": "application/pdf" },
				body: file,
			});

			if (!s3Response.ok) {
				throw new Error("Failed to upload file to S3");
			}

			// Step 3: Create question paper record
			toast.info("Creating question paper record...");
			const createResponse = await fetch(`${API_BASE_URL}/question-papers`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: paperName.trim(),
					raw_document_url: file_url,
				}),
			});

			if (!createResponse.ok) {
				throw new Error("Failed to create question paper");
			}

			const createResult = await createResponse.json();

			console.log(
				"Create question paper response:",
				JSON.stringify(createResult, null, 2),
			);

			if (!createResult.success) {
				throw new Error(
					createResult.error || "Failed to create question paper",
				);
			}

			// Extract question paper ID from response - handle multiple possible structures
			let questionPaperId: string | null = null;

			// Try different possible response structures
			if (createResult.data?.question_papers?.id) {
				// Structure: { data: { question_papers: { id: "..." } } }
				questionPaperId = createResult.data.question_papers.id;
				console.log("Found ID in data.question_papers.id");
			} else if (createResult.data?.question_paper?.id) {
				// Structure: { data: { question_paper: { id: "..." } } }
				questionPaperId = createResult.data.question_paper.id;
				console.log("Found ID in data.question_paper.id");
			} else if (createResult.data?.id) {
				// Structure: { data: { id: "..." } }
				questionPaperId = createResult.data.id;
				console.log("Found ID in data.id");
			} else if (createResult.question_papers?.id) {
				// Structure: { question_papers: { id: "..." } }
				questionPaperId = createResult.question_papers.id;
				console.log("Found ID in question_papers.id");
			} else if (createResult.question_paper?.id) {
				// Structure: { question_paper: { id: "..." } }
				questionPaperId = createResult.question_paper.id;
				console.log("Found ID in question_paper.id");
			} else if (createResult.id) {
				// Structure: { id: "..." }
				questionPaperId = createResult.id;
				console.log("Found ID at root level");
			}

			if (!questionPaperId) {
				console.error(
					"Could not find question paper ID in response:",
					createResult,
				);
				throw new Error(
					`Question paper ID not found in response. Response structure: ${JSON.stringify(
						createResult,
					)}`,
				);
			}

			console.log("Question paper created with ID:", questionPaperId);

			// Step 4: Digitize the question paper
			toast.info("Digitizing question paper...");
			const digitizeResponse = await fetch(
				`${API_BASE_URL}/question-papers/${questionPaperId}/digitize`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
				},
			);

			if (!digitizeResponse.ok) {
				// Don't throw error, just warn - digitization can happen later
				console.warn("Failed to digitize question paper");
				toast.warning(
					"Question paper uploaded but digitization failed. You can retry later.",
				);
			} else {
				const digitizeResult = await digitizeResponse.json();

				if (digitizeResult.success) {
					const digitizedUrl = digitizeResult.data?.digitized_document_url;
					console.log("Question paper digitized successfully:", digitizedUrl);

					// Step 5: Process the question paper
					toast.info("Processing question paper...");
					try {
						const processResponse = await fetch(
							`${API_BASE_URL}/question-papers/${questionPaperId}/process`,
							{
								method: "POST",
							},
						);

						if (!processResponse.ok) {
							console.warn("Failed to process question paper");
							toast.warning(
								"Question paper uploaded and digitized, but processing failed.",
							);
						} else {
							console.log("Question paper processed successfully");
							toast.success(
								"Question paper uploaded, digitized, and processed successfully!",
							);
						}
					} catch (processError) {
						console.error("Error processing question paper:", processError);
						toast.warning(
							"Question paper uploaded and digitized, but processing encountered an error.",
						);
					}
				} else {
					console.warn("Digitization response unsuccessful:", digitizeResult);
					toast.warning(
						"Question paper uploaded but digitization encountered issues.",
					);
				}
			}

			// Reset form and close drawer
			setPaperName("");
			setFile(null);
			onOpenChange(false);
			onQuestionPaperUploaded?.();
		} catch (error) {
			console.error("Error uploading question paper:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to upload question paper",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
			<DrawerContent className="h-[85vh]">
				<DrawerHeader className="px-8 py-6">
					<DrawerTitle className="text-2xl">Upload Question Paper</DrawerTitle>
					<DrawerDescription className="text-base">
						Upload a new question paper by providing a name and file
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto px-8 py-6">
					<div className="mx-auto max-w-2xl space-y-6">
						<div>
							<Label htmlFor="paperName" className="font-semibold text-lg">
								Question Paper Name
							</Label>
							<Input
								id="paperName"
								type="text"
								placeholder="e.g., Mathematics Final Exam 2024"
								value={paperName}
								onChange={(e) => setPaperName(e.target.value)}
								className="mt-2"
								disabled={loading}
							/>
						</div>

						{!file ? (
							<div>
								<Label htmlFor="file" className="font-semibold text-lg">
									Upload File
								</Label>
								<div className="mt-2">
									<label
										htmlFor="file"
										className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors hover:bg-accent"
									>
										<FileIcon className="mb-4 h-12 w-12 text-muted-foreground" />
										<p className="mb-2 font-medium text-sm">
											Click to upload or drag and drop
										</p>
										<p className="text-muted-foreground text-xs">
											PDF, DOC, DOCX (MAX. 10MB)
										</p>
									</label>
									<Input
										id="file"
										type="file"
										onChange={handleFileChange}
										className="hidden"
										disabled={loading}
										accept=".pdf,.doc,.docx"
									/>
								</div>
							</div>
						) : (
							<div>
								<Label className="font-semibold text-lg">Uploaded File</Label>
								<div className="mt-2 flex items-center justify-between rounded-lg border p-4">
									<div className="flex items-center gap-3">
										<FileIcon className="h-8 w-8 text-primary" />
										<div>
											<p className="font-medium">{file.name}</p>
											<p className="text-muted-foreground text-xs">
												{(file.size / 1024 / 1024).toFixed(2)} MB
											</p>
										</div>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={handleRemoveFile}
										disabled={loading}
									>
										<XIcon className="h-4 w-4" />
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>

				<DrawerFooter className="px-8 py-6">
					<div className="flex gap-4">
						<DrawerClose asChild>
							<Button
								variant="outline"
								size="lg"
								className="flex-1 text-base"
								disabled={loading}
							>
								Cancel
							</Button>
						</DrawerClose>
						<Button
							onClick={handleSubmit}
							size="lg"
							className="flex-1 text-base"
							disabled={!paperName.trim() || !file || loading}
						>
							{loading ? "Uploading..." : "Submit"}
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
