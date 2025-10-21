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
import { Label } from "@gb/ui/src/components/ui/label";
import { Textarea } from "@gb/ui/src/components/ui/textarea";
import {
	CheckCircleIcon,
	ChevronRightIcon,
	FileTextIcon,
	KeyIcon,
	SettingsIcon,
	UploadIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FeatureGuard } from "@/components/quicks/shared/FeatureGuard";

export default function TestSetupPage() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoaded, setIsLoaded] = useState(false);
	const [pdfMetadata, _setPdfMetadata] = useState({
		name: "Sample_Test.pdf",
		pages: 5,
		size: "2.3 MB",
	});

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const steps = [
		{ num: 1, title: "Test Paper", icon: <FileTextIcon className="h-5 w-5" /> },
		{
			num: 2,
			title: "Evaluator Config",
			icon: <SettingsIcon className="h-5 w-5" />,
		},
		{ num: 3, title: "Key Answer", icon: <KeyIcon className="h-5 w-5" /> },
	];

	return (
		<FeatureGuard>
			<div className="min-h-screen p-4 sm:p-6 lg:p-8">
				<div className="mx-auto max-w-6xl">
					<header
						className={`transition-all duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} mb-8`}
					>
						<h1 className="font-bold text-3xl">Create New Test</h1>
						<p className="mt-1 text-muted-foreground">
							Set up your test in 3 simple steps
						</p>
					</header>

					{/* Progress Steps */}
					<div
						className={`transition-all delay-200 duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} mb-8`}
					>
						<div className="flex items-center justify-between">
							{steps.map((step, idx) => (
								<div key={step.num} className="flex flex-1 items-center">
									<div className="flex flex-col items-center">
										<div
											className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
												currentStep === step.num
													? "border-primary bg-primary text-primary-foreground"
													: currentStep > step.num
														? "border-green-500 bg-green-500 text-white"
														: "border-border bg-card"
											}`}
										>
											{currentStep > step.num ? (
												<CheckCircleIcon className="h-6 w-6" />
											) : (
												step.icon
											)}
										</div>
										<p className="mt-2 font-medium text-sm">{step.title}</p>
									</div>
									{idx < steps.length - 1 && (
										<div
											className={`mx-4 h-0.5 flex-1 transition-all ${
												currentStep > step.num ? "bg-green-500" : "bg-border"
											}`}
										/>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Step 1: Upload Test Paper */}
					{currentStep === 1 && (
						<div
							className={`transition-all delay-300 duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
						>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<FileTextIcon className="h-5 w-5" />
										Test Question Paper
									</CardTitle>
									<CardDescription>
										Upload the PDF of your test paper
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="cursor-pointer rounded-lg border-2 border-dashed bg-accent/50 p-12 text-center transition-colors hover:border-primary/50">
										<UploadIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
										<p className="font-medium text-sm">
											Drop your PDF here or click to browse
										</p>
										<p className="mt-1 text-muted-foreground text-xs">
											Supports PDF (Max 50MB)
										</p>
									</div>

									{/* PDF Metadata */}
									<div className="rounded-lg border bg-card p-4">
										<h3 className="mb-3 flex items-center gap-2 font-semibold">
											<FileTextIcon className="h-4 w-4" />
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
						<div
							className={`transition-all delay-300 duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
						>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<SettingsIcon className="h-5 w-5" />
										Evaluator Configuration
									</CardTitle>
									<CardDescription>
										Configure 70+ parameters to describe your evaluator
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="font-semibold">Use Default Template</p>
												<p className="text-muted-foreground text-sm">
													Standard evaluation criteria pre-configured
												</p>
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

									<div className="text-center text-muted-foreground text-sm">
										<p>+ 66 more configuration options available</p>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* Step 3: Model Key Answer */}
					{currentStep === 3 && (
						<div
							className={`transition-all delay-300 duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
						>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<KeyIcon className="h-5 w-5" />
										Model Key Answer
									</CardTitle>
									<CardDescription>
										Review and finalize the answer key
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<CheckCircleIcon className="h-5 w-5 text-green-500" />
												<div>
													<p className="font-semibold">Draft Generated</p>
													<p className="text-muted-foreground text-sm">
														AI has generated a draft answer key
													</p>
												</div>
											</div>
											<Button variant="outline">Regenerate</Button>
										</div>
									</div>

									<div className="space-y-4">
										{[1, 2, 3].map((q) => (
											<div key={q} className="rounded-lg border bg-card p-4">
												<div className="mb-2 flex items-start justify-between">
													<p className="font-semibold">Question {q}</p>
													<Button variant="ghost" size="sm">
														Edit
													</Button>
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
					<div
						className={`transition-all delay-500 duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} mt-8 flex justify-between`}
					>
						<Button
							variant="outline"
							onClick={() =>
								currentStep === 1
									? router.push("/quicks")
									: setCurrentStep(currentStep - 1)
							}
						>
							{currentStep === 1 ? "Cancel" : "Previous"}
						</Button>
						{currentStep < 3 ? (
							<Button
								onClick={() => setCurrentStep(currentStep + 1)}
								className="gap-2"
							>
								Next
								<ChevronRightIcon className="h-4 w-4" />
							</Button>
						) : (
							<Button
								onClick={() => {
									const testId = Date.now().toString();
									router.push(`/quicks/${testId}/upload`);
								}}
								className="gap-2"
							>
								<ChevronRightIcon className="h-4 w-4" />
								Continue to Upload Answers
							</Button>
						)}
					</div>
				</div>
			</div>
		</FeatureGuard>
	);
}
