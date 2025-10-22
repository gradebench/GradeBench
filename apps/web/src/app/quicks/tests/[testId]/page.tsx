"use client";

import { Button } from "@gb/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@gb/ui/components/ui/card";
import { Input } from "@gb/ui/components/ui/input";
import { Label } from "@gb/ui/components/ui/label";
import { Textarea } from "@gb/ui/components/ui/textarea";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import { FeatureGuard } from "@gb-element/quicks/components/FeatureGuard";
import {
	CheckCircleIcon,
	ChevronRightIcon,
	FileTextIcon,
	KeyIcon,
	SettingsIcon,
	UploadIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useId, useState } from "react";

const STEPS = [
	{ num: 1, title: "Question Paper Digitization", icon: FileTextIcon },
	{ num: 2, title: "Eval Configs", icon: SettingsIcon },
	{ num: 3, title: "Model Key Answer", icon: KeyIcon },
];

export default function TestCreationPage() {
	const router = useRouter();
	const params = useParams();
	const testId = params.testId as string;
	const isNewTest = testId === "new";

	const testNameId = useId();
	const totalQuestionsId = useId();
	const totalMarksId = useId();
	const evaluationCriteriaId = useId();
	const additionalNotesId = useId();

	const [currentStep, setCurrentStep] = useState(1);
	const [testName, setTestName] = useState("");
	const [testPaper, setTestPaper] = useState<string | null>(null);
	const [totalQuestions, setTotalQuestions] = useState("");
	const [totalMarks, setTotalMarks] = useState("");
	const [evaluationCriteria, setEvaluationCriteria] = useState("");
	const [answerKey, setAnswerKey] = useState<string | null>(null);
	const [additionalNotes, setAdditionalNotes] = useState("");

	const handleNext = () => {
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1);
		} else {
			// Navigate to evaluation page
			const newTestId = isNewTest ? `test-${Date.now()}` : testId;
			router.push(`/quicks/tests/${newTestId}/evaluate`);
		}
	};

	const handleBack = () => {
		if (currentStep === 1) {
			router.push("/quicks");
		} else {
			setCurrentStep(currentStep - 1);
		}
	};

	return (
		<FeatureGuard>
			<DashboardLayout
				title={isNewTest ? "Create New Test" : "Edit Test"}
				description="Set up your test in 3 simple steps"
			>
				<div className="mx-auto max-w-4xl space-y-8">
					{/* Progress Steps */}
					<div className="flex items-center justify-between">
						{STEPS.map((step, idx) => {
							const Icon = step.icon;
							const isCompleted = currentStep > step.num;
							const isCurrent = currentStep === step.num;

							return (
								<div key={step.num} className="flex flex-1 items-center">
									<div className="flex flex-col items-center">
										<div
											className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
												isCompleted
													? "border-green-500 bg-green-500 text-white"
													: isCurrent
														? "border-primary bg-primary text-primary-foreground"
														: "border-muted-foreground/25 bg-muted text-muted-foreground"
											}`}
										>
											{isCompleted ? (
												<CheckCircleIcon className="h-6 w-6" />
											) : (
												<Icon className="h-6 w-6" />
											)}
										</div>
										<p
											className={`mt-2 text-center font-medium text-sm ${
												isCurrent ? "text-foreground" : "text-muted-foreground"
											}`}
										>
											{step.title}
										</p>
									</div>
									{idx < STEPS.length - 1 && (
										<div
											className={`mx-4 h-0.5 flex-1 transition-all ${
												isCompleted ? "bg-green-500" : "bg-muted"
											}`}
										/>
									)}
								</div>
							);
						})}
					</div>

					{/* Step 1: Question Paper Digitization */}
					{currentStep === 1 && (
						<Card>
							<CardHeader>
								<CardTitle>Question Paper Digitization</CardTitle>
								<CardDescription>
									Upload the test paper PDF that students will answer
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor={testNameId}>Test Name</Label>
									<Input
										id={testNameId}
										placeholder="e.g., Math Quiz - Chapter 5"
										value={testName}
										onChange={(e) => setTestName(e.target.value)}
									/>
								</div>
								<div>
									<Label htmlFor="test-paper">Test Paper (PDF)</Label>
									<div className="mt-2 flex min-h-[200px] cursor-pointer items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted/50 transition-colors hover:border-muted-foreground/50">
										{testPaper ? (
											<div className="text-center">
												<FileTextIcon className="mx-auto mb-2 h-12 w-12 text-primary" />
												<p className="font-medium text-sm">{testPaper}</p>
												<Button
													variant="link"
													onClick={() => setTestPaper(null)}
													className="mt-2"
												>
													Remove
												</Button>
											</div>
										) : (
											<div className="text-center">
												<UploadIcon className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
												<p className="text-muted-foreground text-sm">
													Click to upload or drag and drop
												</p>
												<p className="mt-1 text-muted-foreground text-xs">
													PDF files only (max 10MB)
												</p>
												<Button
													variant="outline"
													onClick={() => setTestPaper("Sample_Test.pdf")}
													className="mt-4"
												>
													Browse Files
												</Button>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Step 2: Eval Configs */}
					{currentStep === 2 && (
						<Card>
							<CardHeader>
								<CardTitle>Evaluation Configuration</CardTitle>
								<CardDescription>
									Configure how the AI should evaluate answers
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor={totalQuestionsId}>Total Questions</Label>
										<Input
											id={totalQuestionsId}
											type="number"
											placeholder="e.g., 20"
											value={totalQuestions}
											onChange={(e) => setTotalQuestions(e.target.value)}
										/>
									</div>
									<div>
										<Label htmlFor={totalMarksId}>Total Marks</Label>
										<Input
											id={totalMarksId}
											type="number"
											placeholder="e.g., 100"
											value={totalMarks}
											onChange={(e) => setTotalMarks(e.target.value)}
										/>
									</div>
								</div>
								<div>
									<Label htmlFor={evaluationCriteriaId}>
										Evaluation Criteria
									</Label>
									<Textarea
										id={evaluationCriteriaId}
										placeholder="Describe the evaluation criteria, marking scheme, and any special instructions..."
										rows={6}
										value={evaluationCriteria}
										onChange={(e) => setEvaluationCriteria(e.target.value)}
									/>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Step 3: Model Key Answer */}
					{currentStep === 3 && (
						<Card>
							<CardHeader>
								<CardTitle>Upload Model Key Answer</CardTitle>
								<CardDescription>
									Upload the answer key for reference during evaluation
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label>Answer Key (PDF)</Label>
									<div className="mt-2 flex min-h-[200px] cursor-pointer items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted/50 transition-colors hover:border-muted-foreground/50">
										{answerKey ? (
											<div className="text-center">
												<FileTextIcon className="mx-auto mb-2 h-12 w-12 text-primary" />
												<p className="font-medium text-sm">{answerKey}</p>
												<Button
													variant="link"
													onClick={() => setAnswerKey(null)}
													className="mt-2"
												>
													Remove
												</Button>
											</div>
										) : (
											<div className="text-center">
												<UploadIcon className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
												<p className="text-muted-foreground text-sm">
													Click to upload or drag and drop
												</p>
												<p className="mt-1 text-muted-foreground text-xs">
													PDF files only (max 10MB)
												</p>
												<Button
													variant="outline"
													onClick={() => setAnswerKey("Answer_Key.pdf")}
													className="mt-4"
												>
													Browse Files
												</Button>
											</div>
										)}
									</div>
								</div>
								<div>
									<Label htmlFor={additionalNotesId}>
										Additional Notes (Optional)
									</Label>
									<Textarea
										id={additionalNotesId}
										placeholder="Any additional instructions or notes for the evaluator..."
										rows={4}
										value={additionalNotes}
										onChange={(e) => setAdditionalNotes(e.target.value)}
									/>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Navigation Buttons */}
					<div className="flex justify-between">
						<Button variant="outline" onClick={handleBack}>
							{currentStep === 1 ? "Cancel" : "Previous"}
						</Button>
						<Button onClick={handleNext}>
							{currentStep < 3 ? (
								<>
									Next
									<ChevronRightIcon className="ml-2 h-4 w-4" />
								</>
							) : (
								"Complete Setup & Upload Answers"
							)}
						</Button>
					</div>
				</div>
			</DashboardLayout>
		</FeatureGuard>
	);
}
