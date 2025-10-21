"use client";

import { useState, useEffect } from "react";
import { Button } from "@gb/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gb/ui/components/ui/card";
import { Progress } from "@gb/ui/components/ui/progress";
import { FeatureGuard } from "@/components/quicks/shared/FeatureGuard";
import { UploadIcon, FileTextIcon, XIcon, EyeIcon, CheckCircleIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

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
		{ id: "1", name: "student_001.pdf", size: "1.2 MB", studentName: "John Doe" },
		{ id: "2", name: "student_002.pdf", size: "1.5 MB", studentName: "Jane Smith" },
		{ id: "3", name: "student_003.pdf", size: "1.8 MB", studentName: "Mike Johnson" },
	]);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const removeFile = (id: string) => {
		setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
	};

	const progressPercentage = 75;

	return (
		<FeatureGuard>
			<div className="min-h-screen p-4 sm:p-6 lg:p-8">
				<div className="max-w-6xl mx-auto">
					{/* Header with Progress */}
					<header className={`transition-all duration-700 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} mb-8`}>
						<div className="flex items-center justify-between mb-4">
							<div>
								<h1 className="text-3xl font-bold">Upload Answer Sheets</h1>
								<p className="text-muted-foreground mt-1">Upload student answer sheets for evaluation</p>
							</div>
							<div className="text-right">
								<p className="text-sm text-muted-foreground">Overall Progress</p>
								<p className="text-2xl font-bold">{progressPercentage}%</p>
							</div>
						</div>
						<Progress value={progressPercentage} className="h-2" />
					</header>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Upload Section */}
						<div className={`transition-all duration-700 ease-out delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<UploadIcon className="w-5 h-5" />
										Upload Answer Sheets
									</CardTitle>
									<CardDescription>Upload PDF files of student answers</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-accent/50">
										<UploadIcon className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
										<p className="text-sm font-medium">Drop PDFs here or click to browse</p>
										<p className="text-xs text-muted-foreground mt-1">Supports PDF (Max 10MB each)</p>
									</div>

									<div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
										<div className="flex items-center gap-2 text-sm">
											<CheckCircleIcon className="w-4 h-4 text-primary" />
											<p><span className="font-semibold">{uploadedFiles.length}</span> files uploaded</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Uploaded Files List */}
						<div className={`transition-all duration-700 ease-out delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<FileTextIcon className="w-5 h-5" />
										Uploaded Files
									</CardTitle>
									<CardDescription>Manage uploaded answer sheets</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2 max-h-[400px] overflow-y-auto">
										{uploadedFiles.map((file, index) => (
											<div
												key={file.id}
												style={{ transitionDelay: `${index * 100}ms` }}
												className={`flex items-center justify-between p-3 bg-card border rounded-lg hover:bg-accent transition-all ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
											>
												<div className="flex items-center gap-3 flex-1">
													<div className="bg-primary/10 p-2 rounded">
														<FileTextIcon className="w-4 h-4 text-primary" />
													</div>
													<div className="flex-1">
														<p className="font-medium text-sm">{file.studentName}</p>
														<p className="text-xs text-muted-foreground">{file.name} • {file.size}</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
														<EyeIcon className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0 text-destructive hover:text-destructive"
														onClick={() => removeFile(file.id)}
													>
														<XIcon className="w-4 h-4" />
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
					<div className={`transition-all duration-700 ease-out delay-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} flex justify-between mt-8`}>
						<Button variant="outline" onClick={() => router.push("/quicks")}>
							Cancel
						</Button>
						<Button onClick={() => router.push(`/quicks/${params.testId}/evaluate`)} disabled={uploadedFiles.length === 0}>
							Start Evaluation ({uploadedFiles.length} files)
						</Button>
					</div>
				</div>
			</div>
		</FeatureGuard>
	);
}
