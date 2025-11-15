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
import { UploadIcon, XIcon } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

interface CreateTestDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onTestCreated?: (name: string, rawDocumentUrl: string) => Promise<void>;
}

export function CreateTestDrawer({
	open,
	onOpenChange,
	onTestCreated,
}: CreateTestDrawerProps) {
	const fileUploadId = useId();
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [testName, setTestName] = useState("");

	const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes
	const ALLOWED_TYPES = [
		"application/pdf",
		"application/zip",
		"application/x-zip-compressed",
	];

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			const validFiles: File[] = [];
			const errors: string[] = [];

			for (const file of files) {
				// Check file type
				if (!ALLOWED_TYPES.includes(file.type)) {
					errors.push(`${file.name}: Only PDF and ZIP files are allowed`);
					continue;
				}

				// Check file size
				if (file.size > MAX_FILE_SIZE) {
					const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
					errors.push(
						`${file.name}: File size (${sizeMB}MB) exceeds 15MB limit`,
					);
					continue;
				}

				validFiles.push(file);
			}

			if (errors.length > 0) {
				for (const error of errors) {
					toast.error(error);
				}
			}

			if (validFiles.length > 0) {
				setUploadedFiles(validFiles);
				toast.success(`${validFiles.length} file(s) added successfully`);
			}

			// Reset input
			e.target.value = "";
		}
	};

	const removeFile = (index: number) => {
		setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
	};

	const handleSubmit = async () => {
		if (!testName.trim()) {
			toast.error("Please enter a test name");
			return;
		}

		if (uploadedFiles.length === 0) {
			toast.error("No file selected");
			return;
		}

		setUploading(true);
		const API_BASE_URL = "http://localhost:8083/grade/v1";

		try {
			// Get the first uploaded file
			const file = uploadedFiles[0];
			const fileName = file.name;

			// STEP 1: Request presigned URL for S3 upload
			toast.info("Preparing upload...");
			const step1Response = await fetch(
				`${API_BASE_URL}/question-papers/upload/raw`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						file_name: fileName,
					}),
				},
			);

			if (!step1Response.ok) {
				throw new Error("Failed to get upload URL");
			}

			const step1Result = await step1Response.json();

			if (!step1Result.success || !step1Result.data?.question_papers) {
				throw new Error(step1Result.error || "Failed to get upload URL");
			}

			const { upload_url, file_url } = step1Result.data.question_papers;

			// STEP 2: Upload file to S3 using presigned URL
			toast.info("Uploading file...");
			const step2Response = await fetch(upload_url, {
				method: "PUT",
				body: file,
				headers: {
					"Content-Type": file.type,
				},
			});

			if (!step2Response.ok) {
				throw new Error("Failed to upload file to S3");
			}

			// STEP 3: Create question paper with the uploaded file URL
			toast.info("Creating test...");
			const step3Response = await fetch(`${API_BASE_URL}/question-papers`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: testName.trim(),
					raw_document_url: file_url,
				}),
			});

			if (!step3Response.ok) {
				throw new Error("Failed to create question paper");
			}

			const step3Result = await step3Response.json();

			if (step3Result.success) {
				toast.success("Test created successfully");

				// Call the onTestCreated callback if provided
				if (onTestCreated) {
					await onTestCreated(testName.trim(), file_url);
				}

				// Reset form
				setTestName("");
				setUploadedFiles([]);
				onOpenChange(false);

				// Redirect to refresh the list
				window.location.href = "/quicks";
			} else {
				throw new Error(step3Result.error || "Failed to create test");
			}
		} catch (error) {
			console.error("Upload error:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to create test",
			);
		} finally {
			setUploading(false);
		}
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
			<DrawerContent className="h-[85vh]">
				<DrawerHeader className="px-8 py-6">
					<DrawerTitle className="text-2xl">Upload Question Paper</DrawerTitle>
					<DrawerDescription className="text-base">
						Upload your test question papers to create a new test
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto px-8 py-6">
					<div className="mx-auto max-w-4xl space-y-6">
						{/* Test Name Input */}
						<div>
							<Label htmlFor="testName" className="font-semibold text-lg">
								Test Name
							</Label>
							<Input
								id="testName"
								type="text"
								placeholder="e.g., Mathematics Final Exam 2024"
								value={testName}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setTestName(e.target.value)
								}
								className="mt-2"
							/>
						</div>

						<div>
							<Label className="font-semibold text-lg">
								Upload Question Papers
							</Label>
							<div className="mt-4 flex min-h-[400px] items-center justify-center rounded-xl border-2 border-primary/30 border-dashed bg-primary/5 px-12 py-20 transition-colors hover:border-primary/50 hover:bg-primary/10">
								<label
									htmlFor={fileUploadId}
									className="flex cursor-pointer flex-col items-center text-center"
								>
									<div className="mb-4 rounded-full bg-primary/10 p-6">
										<UploadIcon className="h-12 w-12 text-primary" />
									</div>
									<span className="mb-2 font-semibold text-xl">
										Click to upload or drag and drop
									</span>
									<span className="mb-1 text-muted-foreground">
										Supported formats: PDF, ZIP
									</span>
									<span className="text-muted-foreground text-sm">
										Maximum file size: 15MB
									</span>
									<input
										id={fileUploadId}
										type="file"
										multiple
										accept=".pdf,.zip,application/pdf,application/zip,application/x-zip-compressed"
										className="hidden"
										onChange={handleFileUpload}
									/>
								</label>
							</div>
						</div>

						{uploadedFiles.length > 0 && (
							<div className="space-y-4">
								<Label className="font-semibold text-lg">
									Uploaded Files ({uploadedFiles.length})
								</Label>
								<div className="space-y-3">
									{uploadedFiles.map((file, index) => {
										const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
										const fileType = file.name.endsWith(".pdf") ? "PDF" : "ZIP";
										return (
											<div
												key={index}
												className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4 transition-colors hover:border-primary/30"
											>
												<div className="flex flex-col gap-1">
													<span className="font-medium text-base">
														{file.name}
													</span>
													<span className="text-muted-foreground text-sm">
														{fileType} • {fileSizeMB} MB
													</span>
												</div>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => removeFile(index)}
													className="hover:bg-destructive/10 hover:text-destructive"
												>
													<XIcon className="h-5 w-5" />
												</Button>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>

				<DrawerFooter className="px-8 py-6">
					<div className="flex gap-4">
						<DrawerClose asChild>
							<Button variant="outline" size="lg" className="flex-1 text-base">
								Cancel
							</Button>
						</DrawerClose>
						<Button
							onClick={handleSubmit}
							size="lg"
							className="flex-1 text-base"
							disabled={
								!testName.trim() || uploadedFiles.length === 0 || uploading
							}
						>
							{uploading ? "Creating Test..." : "Upload & Create Test"}
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
