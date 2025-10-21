"use client";

import { useState, useEffect } from "react";
import { Button } from "@gb/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gb/ui/components/ui/card";
import { Input } from "@gb/ui/components/ui/input";
import { Label } from "@gb/ui/components/ui/label";
import { Textarea } from "@gb/ui/components/ui/textarea";
import { Select } from "@gb/ui/components/ui/select";
import { FeatureGuard } from "@/components/quicks/shared/FeatureGuard";
import { useRouter } from "next/navigation";
import { UploadIcon, FileTextIcon, SettingsIcon, KeyIcon, CheckCircleIcon, ChevronRightIcon } from "lucide-react";

export default function TestSetupPage() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoaded, setIsLoaded] = useState(false);
	const [pdfMetadata, setPdfMetadata] = useState({ name: "Sample_Test.pdf", pages: 5, size: "2.3 MB" });

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const steps = [
		{ num: 1, title: "Test Paper", icon: <FileTextIcon className="w-5 h-5" /> },
		{ num: 2, title: "Evaluator Config", icon: <SettingsIcon className="w-5 h-5" /> },
		{ num: 3, title: "Key Answer", icon: <KeyIcon className="w-5 h-5" /> },
	];

	return (
		<FeatureGuard>
			<div className="min-h-screen p-4 sm:p-6 lg:p-8">
				<div className="max-w-6xl mx-auto">
					<header className={`transition-all duration-700 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} mb-8`}>
						<h1 className="text-3xl font-bold">Create New Test</h1>
						<p className="text-muted-foreground mt-1">Set up your test in 3 simple steps</p>
					</header>

					{/* Progress Steps */}
					<div className={`transition-all duration-700 ease-out delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} mb-8`}>
						<div className="flex items-center justify-between">
							{steps.map((step, idx) => (
								<div key={step.num} className="flex items-center flex-1">
									<div className="flex flex-col items-center">
										<div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
											currentStep === step.num ? "bg-primary border-primary text-primary-foreground" :
											currentStep > step.num ? "bg-green-500 border-green-500 text-white" :
											"bg-card border-border"
										}`}>
											{currentStep > step.num ? <CheckCircleIcon className="w-6 h-6" /> : step.icon}
										</div>
										<p className="text-sm font-medium mt-2">{step.title}</p>
									</div>
									{idx < steps.length - 1 && (
										<div className={`flex-1 h-0.5 mx-4 transition-all ${
											currentStep > step.num ? "bg-green-500" : "bg-border"
										}`} />
									)}
								</div>
							))}
						</div>
					</div>

					{/* Step 1: Upload Test Paper */}
					{currentStep === 1 && (
						<div className={`transition-all duration-700 ease-out delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<FileTextIcon className="w-5 h-5" />
										Test Question Paper
									</CardTitle>
									<CardDescription>Upload the PDF of your test paper</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-accent/50">
										<UploadIcon className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
										<p className="text-sm font-medium">Drop your PDF here or click to browse</p>
										<p className="text-xs text-muted-foreground mt-1">Supports PDF (Max 50MB)</p>
									</div>

									{/* PDF Metadata */}
									<div className="bg-card border rounded-lg p-4">
										<h3 className="font-semibold mb-3 flex items-center gap-2">
											<FileTextIcon className="w-4 h-4" />
											Document Information
										</h3>
										<div className="grid grid-cols-3 gap-4 text-sm">
											<div>
												<p className="text-muted-foreground">File Name</p>
												<p className="font-medium">{pdfMetadata.name}</p>
											</div>
											<div>
												<p className="text-muted-foreground">Pages</p>
												<p className="font-medium">{pdfMetadata.pages}</p>
											</div>
											<div>
												<p className="text-muted-foreground">Size</p>
												<p className="font-medium">{pdfMetadata.size}</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* Step 2: Evaluator Configuration */}
					{currentStep === 2 && (
						<div className={`transition-all duration-700 ease-out delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<SettingsIcon className="w-5 h-5" />
										Evaluator Configuration
									</CardTitle>
									<CardDescription>Configure 70+ parameters to describe your evaluator</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="font-semibold">Use Default Template</p>
												<p className="text-sm text-muted-foreground">Standard evaluation criteria pre-configured</p>
											</div>
											<Button variant="outline">Load Template</Button>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label>Strictness Level</Label>
											<Input type="range" min="1" max="10" defaultValue="5" />
										</div>
										<div className="space-y-2">
											<Label>Partial Credit</Label>
											<Input type="range" min="0" max="100" defaultValue="50" />
										</div>
										<div className="space-y-2">
											<Label>Grammar Weight</Label>
											<Input type="number" defaultValue="20" />
										</div>
										<div className="space-y-2">
											<Label>Content Weight</Label>
											<Input type="number" defaultValue="80" />
										</div>
									</div>

									<div className="text-center text-sm text-muted-foreground">
										<p>+ 66 more configuration options available</p>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* Step 3: Model Key Answer */}
					{currentStep === 3 && (
						<div className={`transition-all duration-700 ease-out delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<KeyIcon className="w-5 h-5" />
										Model Key Answer
									</CardTitle>
									<CardDescription>Review and finalize the answer key</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<CheckCircleIcon className="w-5 h-5 text-green-500" />
												<div>
													<p className="font-semibold">Draft Generated</p>
													<p className="text-sm text-muted-foreground">AI has generated a draft answer key</p>
												</div>
											</div>
											<Button variant="outline">Regenerate</Button>
										</div>
									</div>

									<div className="space-y-4">
										{[1, 2, 3].map((q) => (
											<div key={q} className="bg-card border rounded-lg p-4">
												<div className="flex items-start justify-between mb-2">
													<p className="font-semibold">Question {q}</p>
													<Button variant="ghost" size="sm">Edit</Button>
												</div>
												<Textarea
													defaultValue={`Sample answer for question ${q}. This is the model answer that will be used for evaluation.`}
													rows={3}
													className="mt-2"
												/>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* Navigation Buttons */}
					<div className={`transition-all duration-700 ease-out delay-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} flex justify-between mt-8`}>
						<Button
							variant="outline"
							onClick={() => currentStep === 1 ? router.push("/quicks") : setCurrentStep(currentStep - 1)}
						>
							{currentStep === 1 ? "Cancel" : "Previous"}
						</Button>
						{currentStep < 3 ? (
							<Button onClick={() => setCurrentStep(currentStep + 1)} className="gap-2">
								Next
								<ChevronRightIcon className="w-4 h-4" />
							</Button>
						) : (
							<Button onClick={() => {
								const testId = Date.now().toString();
								router.push(`/quicks/${testId}/upload`);
							}} className="gap-2">
								<ChevronRightIcon className="w-4 h-4" />
								Continue to Upload Answers
							</Button>
						)}
					</div>
				</div>
			</div>
		</FeatureGuard>
	);
}
