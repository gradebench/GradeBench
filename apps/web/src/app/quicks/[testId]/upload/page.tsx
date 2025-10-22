"use client";

import { Button } from "@gb/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@gb/ui/components/ui/card";
import { Progress } from "@gb/ui/components/ui/progress";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import { FeatureGuard } from "@gb-element/quicks/components/FeatureGuard";
import { FileTextIcon, TrashIcon, UploadIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface UploadedFile {
	id: string;
	name: string;
	size: string;
	studentName: string;
}

export default function UploadPage() {
	const router = useRouter();
	const params = useParams();
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
		{
			id: "1",
			name: "student_001.pdf",
			size: "1.2 MB",
			studentName: "John Doe",
		},
		{
			id: "2",
			name: "student_002.pdf",
			size: "1.5 MB",
			studentName: "Jane Smith",
		},
		{
			id: "3",
			name: "student_003.pdf",
			size: "1.8 MB",
			studentName: "Mike Johnson",
		},
	]);

	const removeFile = (id: string) => {
		setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
	};

	const progressPercentage = 75;

	return (
		<FeatureGuard>
			<DashboardLayout
				title="Upload Answer Sheets"
				description="Upload student answer sheets for automated evaluation"
			>
				<div className="mx-auto max-w-5xl space-y-6">
					{/* Progress Indicator */}
					<Card>
						<CardContent className="pt-6">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Setup Progress</span>
									<span className="font-medium">{progressPercentage}%</span>
								</div>
								<Progress value={progressPercentage} className="h-2" />
							</div>
						</CardContent>
					</Card>

					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Upload Section */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<UploadIcon className="h-5 w-5" />
									Upload Files
								</CardTitle>
								<CardDescription>
									Upload student answer sheets (PDF format)
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex min-h-[200px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50">
									<div className="text-center">
										<UploadIcon className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
										<p className="text-muted-foreground text-sm">
											Click to upload or drag and drop
										</p>
										<p className="mt-1 text-muted-foreground text-xs">
											PDF files only (max 10MB each)
										</p>
									</div>
								</div>
								<Button variant="outline" className="w-full">
									Browse Files
								</Button>
							</CardContent>
						</Card>

						{/* Uploaded Files List */}
						<Card>
							<CardHeader>
								<CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
								<CardDescription>Manage uploaded answer sheets</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{uploadedFiles.length === 0 ? (
										<div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
											<p className="text-muted-foreground text-sm">
												No files uploaded yet
											</p>
										</div>
									) : (
										uploadedFiles.map((file) => (
											<div
												key={file.id}
												className="flex items-center justify-between rounded-lg border bg-card p-3"
											>
												<div className="flex items-center gap-3">
													<FileTextIcon className="h-8 w-8 text-muted-foreground" />
													<div>
														<p className="font-medium text-sm">{file.name}</p>
														<p className="text-muted-foreground text-xs">
															{file.studentName} • {file.size}
														</p>
													</div>
												</div>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => removeFile(file.id)}
												>
													<TrashIcon className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										))
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-between">
						<Button variant="outline" onClick={() => router.push("/quicks")}>
							Cancel
						</Button>
						<Button
							onClick={() => router.push(`/quicks/${params.testId}/evaluate`)}
							disabled={uploadedFiles.length === 0}
						>
							Start Evaluation ({uploadedFiles.length} files)
						</Button>
					</div>
				</div>
			</DashboardLayout>
		</FeatureGuard>
	);
}
