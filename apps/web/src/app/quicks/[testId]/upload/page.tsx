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
import {
	CheckCircleIcon,
	EyeIcon,
	FileTextIcon,
	UploadIcon,
	XIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FeatureGuard } from "@/components/quicks/shared/FeatureGuard";

interface UploadedFile {
	id: string;
	name: string;
	size: string;
	studentName: string;
}

export default function UploadPage() {
	const router = useRouter();
	const params = useParams();
	const [isLoaded, setIsLoaded] = useState(false);
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

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const removeFile = (id: string) => {
		setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
	};

	const progressPercentage = 75;

	return (
		<FeatureGuard>
			<div className="min-h-screen p-4 sm:p-6 lg:p-8">
				<div className="mx-auto max-w-6xl">
					{/* Header with Progress */}
					<header
						className={`transition-all duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} mb-8`}
					>
						<div className="mb-4 flex items-center justify-between">
							<div>
								<h1 className="font-bold text-3xl">Upload Answer Sheets</h1>
								<p className="mt-1 text-muted-foreground">
									Upload student answer sheets for evaluation
								</p>
							</div>
							<div className="text-right">
								<p className="text-muted-foreground text-sm">
									Overall Progress
								</p>
								<p className="font-bold text-2xl">{progressPercentage}%</p>
							</div>
						</div>
						<Progress value={progressPercentage} className="h-2" />
					</header>

					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Upload Section */}
						<div
							className={`transition-all delay-200 duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
						>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<UploadIcon className="h-5 w-5" />
										Upload Answer Sheets
									</CardTitle>
									<CardDescription>
										Upload PDF files of student answers
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="cursor-pointer rounded-lg border-2 border-dashed bg-accent/50 p-12 text-center transition-colors hover:border-primary/50">
										<UploadIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
										<p className="font-medium text-sm">
											Drop PDFs here or click to browse
										</p>
										<p className="mt-1 text-muted-foreground text-xs">
											Supports PDF (Max 10MB each)
										</p>
									</div>

									<div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
										<div className="flex items-center gap-2 text-sm">
											<CheckCircleIcon className="h-4 w-4 text-primary" />
											<p>
												<span className="font-semibold">
													{uploadedFiles.length}
												</span>{" "}
												files uploaded
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Uploaded Files List */}
						<div
							className={`transition-all delay-300 duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
						>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<FileTextIcon className="h-5 w-5" />
										Uploaded Files
									</CardTitle>
									<CardDescription>
										Manage uploaded answer sheets
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="max-h-[400px] space-y-2 overflow-y-auto">
										{uploadedFiles.map((file, index) => (
											<div
												key={file.id}
												style={{ transitionDelay: `${index * 100}ms` }}
												className={`flex items-center justify-between rounded-lg border bg-card p-3 transition-all hover:bg-accent ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
											>
												<div className="flex flex-1 items-center gap-3">
													<div className="rounded bg-primary/10 p-2">
														<FileTextIcon className="h-4 w-4 text-primary" />
													</div>
													<div className="flex-1">
														<p className="font-medium text-sm">
															{file.studentName}
														</p>
														<p className="text-muted-foreground text-xs">
															{file.name} • {file.size}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0"
													>
														<EyeIcon className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0 text-destructive hover:text-destructive"
														onClick={() => removeFile(file.id)}
													>
														<XIcon className="h-4 w-4" />
													</Button>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Action Buttons */}
					<div
						className={`transition-all delay-500 duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} mt-8 flex justify-between`}
					>
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
			</div>
		</FeatureGuard>
	);
}
