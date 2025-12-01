"use client";

import { Button } from "@gb/ui/src/components/ui/button";
import { Card } from "@gb/ui/src/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@gb/ui/src/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { toast } from "sonner";
import { uploadAnswerPapers } from "@/lib/answer-papers-api";

interface FileWithProgress {
	file: File;
	name: string;
	progress: number;
	status: "pending" | "uploading" | "completed" | "failed";
	error?: string;
}

interface UploadPanelProps {
	testId: string;
	onUploadComplete: () => void;
}

export function UploadPanel({ testId, onUploadComplete }: UploadPanelProps) {
	const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const fileInputId = useId();

	const handleFileSelect = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(event.target.files || []);

			// Validate files
			const validFiles: FileWithProgress[] = [];

			for (const file of files) {
				// Check if PDF
				if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
					toast.error(`${file.name} is not a PDF file`);
					continue;
				}

				// Check if already added
				if (
					selectedFiles.some(
						(f) => f.file.name === file.name && f.file.size === file.size,
					)
				) {
					toast.error(`${file.name} is already added`);
					continue;
				}

				validFiles.push({
					file,
					name: file.name,
					progress: 0,
					status: "pending",
				});
			}

			if (validFiles.length + selectedFiles.length > 100) {
				toast.error("Maximum 100 files per upload");
				return;
			}

			setSelectedFiles([...selectedFiles, ...validFiles]);

			// Reset input
			event.target.value = "";
		},
		[selectedFiles],
	);

	const handleRemoveFile = useCallback((index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const handleRemoveAllFiles = useCallback(() => {
		setSelectedFiles([]);
	}, []);

	const handleUploadClick = useCallback(() => {
		if (selectedFiles.length === 0) {
			toast.error("Please select at least one file");
			return;
		}

		setShowConfirmation(true);
	}, [selectedFiles.length]);

	const handleConfirmUpload = useCallback(async () => {
		setShowConfirmation(false);
		setIsUploading(true);

		try {
			const files = selectedFiles.map((f) => f.file);
			const fileNames = selectedFiles.map((f) => f.name);

			// Update files with uploading status
			const updatedFiles = selectedFiles.map((f) => ({
				...f,
				status: "uploading" as const,
			}));
			setSelectedFiles(updatedFiles);

			await uploadAnswerPapers(
				testId,
				files,
				fileNames,
				(fileIndex, loaded, total) => {
					setSelectedFiles((prev) => {
						const updated = [...prev];
						updated[fileIndex] = {
							...updated[fileIndex],
							progress: (loaded / total) * 100,
						};
						return updated;
					});
				},
			);

			// Mark all files as completed
			setSelectedFiles((prev) =>
				prev.map((f) => ({ ...f, status: "completed", progress: 100 })),
			);

			toast.success(`Successfully uploaded ${files.length} answer papers`);

			// Refresh after a short delay to show completion
			setTimeout(() => {
				setSelectedFiles([]);
				onUploadComplete();
			}, 1500);
		} catch (error) {
			console.error("Upload error:", error);

			const errorMessage =
				error instanceof Error ? error.message : "Upload failed";
			toast.error(errorMessage);

			// Mark failed files
			setSelectedFiles((prev) =>
				prev.map((f) =>
					f.status === "uploading"
						? { ...f, status: "failed", error: errorMessage }
						: f,
				),
			);
		} finally {
			setIsUploading(false);
		}
	}, [selectedFiles, testId, onUploadComplete]);

	const totalFiles = selectedFiles.length;
	const completedFiles = selectedFiles.filter(
		(f) => f.status === "completed",
	).length;
	const failedFiles = selectedFiles.filter((f) => f.status === "failed").length;

	return (
		<div className="container mx-auto space-y-6 p-6">
			{/* Header */}
			<div>
				<h1 className="font-semibold text-3xl">Upload Answer Papers</h1>
				<p className="text-muted-foreground text-sm">
					Select and upload PDF files for evaluation
				</p>
			</div>

			{/* Upload Area */}
			<Card className="border-2 border-dashed">
				<div className="p-8">
					<div className="flex cursor-pointer flex-col items-center justify-center">
						<div className="mb-4 text-5xl">📄</div>
						<h3 className="mb-2 font-semibold text-lg">
							Drag and drop your files here
						</h3>
						<p className="mb-6 text-center text-muted-foreground text-sm">
							or click to browse
						</p>
						<Button
							type="button"
							variant="outline"
							onClick={() => document.getElementById(fileInputId)?.click()}
						>
							<Upload className="mr-2 h-4 w-4" />
							Browse Files
						</Button>
						<p className="mt-4 text-muted-foreground text-xs">
							Only PDF files allowed • Maximum 100 files per upload
						</p>
					</div>
					<input
						id={fileInputId}
						type="file"
						multiple
						accept=".pdf"
						onChange={handleFileSelect}
						className="hidden"
					/>
				</div>
			</Card>

			{/* Files List */}
			{selectedFiles.length > 0 && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="font-semibold text-lg">
								Selected Files ({totalFiles})
							</h2>
							{failedFiles > 0 && (
								<p className="text-destructive text-xs">
									{failedFiles} file(s) failed
								</p>
							)}
						</div>
						{!isUploading && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleRemoveAllFiles}
								disabled={isUploading}
							>
								Clear All
							</Button>
						)}
					</div>

					<div className="space-y-2">
						{selectedFiles.map((fileItem, index) => (
							<div
								key={`${fileItem.name}-${index}`}
								className="flex items-center gap-3 rounded-lg border p-3"
							>
								<div className="flex-1 space-y-1">
									<div className="flex items-center justify-between">
										<p className="truncate font-medium text-sm">
											{fileItem.name}
										</p>
										{fileItem.status === "completed" && (
											<span className="font-semibold text-green-600 text-xs">
												✓ Completed
											</span>
										)}
										{fileItem.status === "failed" && (
											<span className="font-semibold text-destructive text-xs">
												✗ Failed
											</span>
										)}
									</div>

									{fileItem.status === "uploading" && (
										<div className="flex items-center gap-2">
											<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
												<div
													className="h-full bg-blue-500 transition-all duration-300"
													style={{
														width: `${fileItem.progress}%`,
													}}
												/>
											</div>
											<span className="text-muted-foreground text-xs">
												{Math.round(fileItem.progress)}%
											</span>
										</div>
									)}

									{fileItem.status === "failed" && fileItem.error && (
										<p className="text-destructive text-xs">{fileItem.error}</p>
									)}

									<p className="text-muted-foreground text-xs">
										{(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
									</p>
								</div>

								<button
									type="button"
									onClick={() => handleRemoveFile(index)}
									disabled={isUploading || fileItem.status === "completed"}
									className="rounded p-1 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
									title="Remove file"
								>
									<X className="h-4 w-4 text-muted-foreground" />
								</button>
							</div>
						))}
					</div>

					{/* Stats */}
					{(completedFiles > 0 || failedFiles > 0) && (
						<div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
							<div className="space-y-1">
								{completedFiles > 0 && (
									<p className="text-green-600">
										✓ {completedFiles} file(s) uploaded
									</p>
								)}
								{failedFiles > 0 && (
									<p className="text-destructive">
										✗ {failedFiles} file(s) failed
									</p>
								)}
							</div>
						</div>
					)}

					{/* Upload Button */}
					<div className="flex gap-2 pt-4">
						<Button
							onClick={handleUploadClick}
							disabled={
								isUploading ||
								selectedFiles.length === 0 ||
								completedFiles === selectedFiles.length
							}
							className="flex-1"
						>
							{isUploading && (
								<div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
							)}
							{isUploading ? "Uploading..." : "Upload Answer Papers"}
						</Button>
					</div>
				</div>
			)}

			{/* Confirmation Dialog */}
			<Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Upload</DialogTitle>
						<DialogDescription>
							Once uploaded, you cannot add more answer papers. Do you want to
							proceed?
						</DialogDescription>
					</DialogHeader>
					<div className="rounded bg-muted p-3 text-sm">
						<p className="font-medium">{totalFiles} file(s) will be uploaded</p>
						<p className="mt-1 text-muted-foreground text-xs">
							This action will trigger automatic digitization of all papers.
						</p>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowConfirmation(false)}
							disabled={isUploading}
						>
							Cancel
						</Button>
						<Button onClick={handleConfirmUpload} disabled={isUploading}>
							{isUploading ? "Uploading..." : "Confirm"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
