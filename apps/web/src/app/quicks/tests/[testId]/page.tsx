"use client";

import { Badge } from "@gb/ui/components/ui/badge";
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
import { Progress } from "@gb/ui/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@gb/ui/components/ui/select";
import { Textarea } from "@gb/ui/components/ui/textarea";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import { EvaluatorConfigPanel } from "@gb-element/quicks/components/EvaluatorConfigPanel";
import { FeatureGuard } from "@gb-element/quicks/components/FeatureGuard";
import { ModelAnswerGenerator } from "@gb-element/quicks/components/ModelAnswerGenerator";
import type { EvaluatorConfiguration } from "@gb-element/quicks/types/evaluator-config";
import type {
	ExamCategory,
	ModelAnswer,
	QuestionType,
	TestBasicInfo,
	TestQuestion,
} from "@gb-element/quicks/types/test-creation";
import {
	AlertCircleIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	CheckCircleIcon,
	FileTextIcon,
	PlusIcon,
	SettingsIcon,
	SparklesIcon,
	TrashIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useId, useState } from "react";

const STEPS = [
	{
		id: 1,
		title: "Test Details",
		icon: FileTextIcon,
		description: "Basic test information",
	},
	{
		id: 2,
		title: "Questions",
		icon: PlusIcon,
		description: "Add test questions",
	},
	{
		id: 3,
		title: "Evaluator Config",
		icon: SettingsIcon,
		description: "Configure evaluation",
	},
	{
		id: 4,
		title: "Model Answers",
		icon: SparklesIcon,
		description: "Generate key answers",
	},
];

const EXAM_CATEGORIES: { value: ExamCategory; label: string }[] = [
	{ value: "upsc", label: "UPSC" },
	{ value: "engineering", label: "Engineering" },
	{ value: "medical", label: "Medical" },
	{ value: "banking", label: "Banking" },
	{ value: "school", label: "School" },
	{ value: "university", label: "University" },
	{ value: "competitive", label: "Competitive Exam" },
	{ value: "certification", label: "Certification" },
	{ value: "custom", label: "Custom" },
];

const UPSC_SUBJECTS = [
	{ value: "general_studies_1", label: "General Studies - I" },
	{ value: "general_studies_2", label: "General Studies - II" },
	{ value: "general_studies_3", label: "General Studies - III" },
	{ value: "general_studies_4", label: "General Studies - IV" },
	{ value: "essay", label: "Essay" },
	{ value: "optional_subject", label: "Optional Subject" },
];

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
	{ value: "mcq", label: "Multiple Choice" },
	{ value: "short_answer", label: "Short Answer" },
	{ value: "long_answer", label: "Long Answer" },
	{ value: "essay", label: "Essay" },
	{ value: "numerical", label: "Numerical" },
	{ value: "diagram", label: "Diagram" },
	{ value: "true_false", label: "True/False" },
];

export default function TestCreationPage() {
	const router = useRouter();
	const params = useParams();
	const testId = params.testId as string;
	const isNewTest = testId === "new";

	const [currentStep, setCurrentStep] = useState(1);
	const [isGeneratingAnswers, setIsGeneratingAnswers] = useState(false);

	// Form IDs for accessibility
	const titleId = useId();
	const categoryId = useId();
	const subjectId = useId();
	const _totalMarksId = useId();
	const durationId = useId();
	const descriptionId = useId();

	// Test Basic Info State
	const [basicInfo, setBasicInfo] = useState<Partial<TestBasicInfo>>({
		testId: isNewTest ? crypto.randomUUID() : testId,
		title: "",
		category: "upsc",
		subject: "",
		totalMarks: 0,
		totalQuestions: 0,
		duration: 180,
		description: "",
		instructions: "",
		createdAt: new Date().toISOString(),
	});

	// Questions State
	const [questions, setQuestions] = useState<TestQuestion[]>([]);
	const [currentQuestion, setCurrentQuestion] = useState<Partial<TestQuestion>>(
		{
			id: crypto.randomUUID(),
			questionNumber: 1,
			questionText: "",
			questionType: "short_answer",
			marks: 10,
			wordLimit: 200,
			mandatory: true,
		},
	);

	// Evaluator Config State
	const [evaluatorConfig, setEvaluatorConfig] =
		useState<EvaluatorConfiguration | null>(null);

	// Model Answers State
	const [modelAnswers, setModelAnswers] = useState<ModelAnswer[]>([]);

	const handleNext = () => {
		if (currentStep === 4) {
			// Final step - generate rubrics and navigate
			handleFinalize();
		} else {
			setCurrentStep((prev) => Math.min(prev + 1, 4));
		}
	};

	const handleBack = () => {
		if (currentStep === 1) {
			router.push("/quicks");
		} else {
			setCurrentStep((prev) => Math.max(prev - 1, 1));
		}
	};

	const handleAddQuestion = () => {
		if (currentQuestion.questionText && currentQuestion.marks) {
			const newQuestion: TestQuestion = {
				id: currentQuestion.id || crypto.randomUUID(),
				questionNumber: questions.length + 1,
				questionText: currentQuestion.questionText,
				questionType: currentQuestion.questionType || "short_answer",
				marks: currentQuestion.marks,
				wordLimit: currentQuestion.wordLimit,
				mandatory: currentQuestion.mandatory ?? true,
			};

			setQuestions([...questions, newQuestion]);
			setBasicInfo((prev) => ({
				...prev,
				totalQuestions: questions.length + 1,
				totalMarks: (prev.totalMarks || 0) + newQuestion.marks,
			}));

			// Reset current question
			setCurrentQuestion({
				id: crypto.randomUUID(),
				questionNumber: questions.length + 2,
				questionText: "",
				questionType: "short_answer",
				marks: 10,
				wordLimit: 200,
				mandatory: true,
			});
		}
	};

	const handleRemoveQuestion = (questionId: string) => {
		const removedQuestion = questions.find((q) => q.id === questionId);
		setQuestions(questions.filter((q) => q.id !== questionId));
		if (removedQuestion) {
			setBasicInfo((prev) => ({
				...prev,
				totalQuestions: (prev.totalQuestions || 0) - 1,
				totalMarks: (prev.totalMarks || 0) - removedQuestion.marks,
			}));
		}
	};

	const handleGenerateModelAnswers = async () => {
		setIsGeneratingAnswers(true);
		// Simulate AI generation
		await new Promise((resolve) => setTimeout(resolve, 3000));
		setIsGeneratingAnswers(false);
		handleNext();
	};

	const handleFinalize = () => {
		// Save test and navigate to evaluation page
		const newTestId = basicInfo.testId || `test-${Date.now()}`;
		router.push(`/quicks/tests/${newTestId}/evaluate`);
	};

	const canProceed = () => {
		switch (currentStep) {
			case 1:
				return basicInfo.title && basicInfo.category && basicInfo.subject;
			case 2:
				return questions.length > 0;
			case 3:
				return true; // Evaluator config is optional
			case 4:
				return true; // Model answers can be empty
			default:
				return false;
		}
	};

	const progressPercentage = (currentStep / 4) * 100;

	return (
		<FeatureGuard>
			<DashboardLayout
				title={isNewTest ? "Create New Test" : "Edit Test"}
				description="Set up your test with detailed configuration"
			>
				<div className="mx-auto max-w-6xl space-y-6">
					{/* Progress Indicator */}
					<Card>
						<CardContent className="pt-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									{STEPS.map((step, idx) => {
										const Icon = step.icon;
										const isCompleted = currentStep > step.id;
										const isCurrent = currentStep === step.id;

										return (
											<div key={step.id} className="flex flex-1 items-center">
												<div className="flex flex-col items-center">
													<div
														className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
															isCompleted
																? "border-green-500 bg-green-500 text-white"
																: isCurrent
																	? "border-blue-500 bg-blue-500 text-white"
																	: "border-gray-300 bg-white text-gray-400"
														}`}
													>
														{isCompleted ? (
															<CheckCircleIcon className="h-6 w-6" />
														) : (
															<Icon className="h-6 w-6" />
														)}
													</div>
													<div className="mt-2 text-center">
														<div
															className={`font-medium text-sm ${
																isCurrent ? "text-blue-600" : "text-gray-600"
															}`}
														>
															{step.title}
														</div>
														<div className="text-muted-foreground text-xs">
															{step.description}
														</div>
													</div>
												</div>
												{idx < STEPS.length - 1 && (
													<div
														className={`mx-4 h-0.5 flex-1 ${
															isCompleted ? "bg-green-500" : "bg-gray-300"
														}`}
													/>
												)}
											</div>
										);
									})}
								</div>
								<Progress value={progressPercentage} className="h-2" />
							</div>
						</CardContent>
					</Card>

					{/* Step 1: Test Details */}
					{currentStep === 1 && (
						<Card>
							<CardHeader>
								<CardTitle>Test Details</CardTitle>
								<CardDescription>
									Enter the basic information about your test
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor={titleId}>Test Title *</Label>
										<Input
											id={titleId}
											placeholder="e.g., UPSC Civil Services 2025 - GS Paper 1"
											value={basicInfo.title}
											onChange={(e) =>
												setBasicInfo({ ...basicInfo, title: e.target.value })
											}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor={categoryId}>Category *</Label>
										<Select
											value={basicInfo.category}
											onValueChange={(value: ExamCategory) =>
												setBasicInfo({ ...basicInfo, category: value })
											}
										>
											<SelectTrigger id={categoryId}>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												{EXAM_CATEGORIES.map((cat) => (
													<SelectItem key={cat.value} value={cat.value}>
														{cat.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor={subjectId}>Subject *</Label>
										{basicInfo.category === "upsc" ? (
											<Select
												value={basicInfo.subject}
												onValueChange={(value) =>
													setBasicInfo({ ...basicInfo, subject: value })
												}
											>
												<SelectTrigger id={subjectId}>
													<SelectValue placeholder="Select subject" />
												</SelectTrigger>
												<SelectContent>
													{UPSC_SUBJECTS.map((subj) => (
														<SelectItem key={subj.value} value={subj.value}>
															{subj.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										) : (
											<Input
												id={subjectId}
												placeholder="Enter subject name"
												value={basicInfo.subject}
												onChange={(e) =>
													setBasicInfo({
														...basicInfo,
														subject: e.target.value,
													})
												}
											/>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor={durationId}>Duration (minutes)</Label>
										<Input
											id={durationId}
											type="number"
											placeholder="180"
											value={basicInfo.duration || ""}
											onChange={(e) =>
												setBasicInfo({
													...basicInfo,
													duration: parseInt(e.target.value, 10) || 0,
												})
											}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor={descriptionId}>Description (Optional)</Label>
									<Textarea
										id={descriptionId}
										placeholder="Brief description of the test..."
										value={basicInfo.description}
										onChange={(e) =>
											setBasicInfo({
												...basicInfo,
												description: e.target.value,
											})
										}
										rows={3}
									/>
								</div>

								<div className="rounded-lg border bg-blue-50 p-4">
									<div className="flex items-start gap-3">
										<AlertCircleIcon className="h-5 w-5 text-blue-600" />
										<div className="text-sm">
											<p className="font-medium text-blue-900">Note:</p>
											<p className="text-blue-700">
												Total marks and question count will be automatically
												calculated as you add questions in the next step.
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Step 2: Questions */}
					{currentStep === 2 && (
						<div className="space-y-4">
							{/* Current Test Summary */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Questions for: {basicInfo.title}</span>
										<div className="flex gap-4 text-sm">
											<Badge variant="outline">
												Total: {questions.length} Questions
											</Badge>
											<Badge variant="outline">
												{basicInfo.totalMarks} Marks
											</Badge>
										</div>
									</CardTitle>
								</CardHeader>
							</Card>

							{/* Add Question Form */}
							<Card>
								<CardHeader>
									<CardTitle>Add New Question</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label>Question Text *</Label>
										<Textarea
											placeholder="Enter the question..."
											value={currentQuestion.questionText}
											onChange={(e) =>
												setCurrentQuestion({
													...currentQuestion,
													questionText: e.target.value,
												})
											}
											rows={4}
										/>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										<div className="space-y-2">
											<Label>Question Type</Label>
											<Select
												value={currentQuestion.questionType}
												onValueChange={(value: QuestionType) =>
													setCurrentQuestion({
														...currentQuestion,
														questionType: value,
													})
												}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{QUESTION_TYPES.map((type) => (
														<SelectItem key={type.value} value={type.value}>
															{type.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<Label>Marks *</Label>
											<Input
												type="number"
												placeholder="10"
												value={currentQuestion.marks || ""}
												onChange={(e) =>
													setCurrentQuestion({
														...currentQuestion,
														marks: parseInt(e.target.value, 10) || 0,
													})
												}
											/>
										</div>

										<div className="space-y-2">
											<Label>Word Limit</Label>
											<Input
												type="number"
												placeholder="200"
												value={currentQuestion.wordLimit || ""}
												onChange={(e) =>
													setCurrentQuestion({
														...currentQuestion,
														wordLimit:
															parseInt(e.target.value, 10) || undefined,
													})
												}
											/>
										</div>
									</div>

									<Button onClick={handleAddQuestion} className="w-full">
										<PlusIcon className="mr-2 h-4 w-4" />
										Add Question
									</Button>
								</CardContent>
							</Card>

							{/* Questions List */}
							{questions.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle>Added Questions ({questions.length})</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{questions.map((q) => (
												<div
													key={q.id}
													className="flex items-start justify-between rounded-lg border p-4"
												>
													<div className="flex-1">
														<div className="flex items-start gap-3">
															<Badge variant="secondary">
																Q{q.questionNumber}
															</Badge>
															<div className="flex-1">
																<p className="font-medium">{q.questionText}</p>
																<div className="mt-2 flex gap-2 text-sm">
																	<Badge variant="outline">
																		{q.marks} marks
																	</Badge>
																	<Badge variant="outline">
																		{
																			QUESTION_TYPES.find(
																				(t) => t.value === q.questionType,
																			)?.label
																		}
																	</Badge>
																	{q.wordLimit && (
																		<Badge variant="outline">
																			{q.wordLimit} words
																		</Badge>
																	)}
																</div>
															</div>
														</div>
													</div>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleRemoveQuestion(q.id)}
													>
														<TrashIcon className="h-4 w-4 text-red-500" />
													</Button>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					)}

					{/* Step 3: Evaluator Configuration */}
					{currentStep === 3 && (
						<EvaluatorConfigPanel
							config={evaluatorConfig}
							onChange={setEvaluatorConfig}
						/>
					)}

					{/* Step 4: Model Answers */}
					{currentStep === 4 && (
						<ModelAnswerGenerator
							questions={questions}
							isGenerating={isGeneratingAnswers}
							onGenerate={handleGenerateModelAnswers}
							modelAnswers={modelAnswers}
							onAnswersChange={setModelAnswers}
						/>
					)}

					{/* Navigation Buttons */}
					<div className="flex justify-between">
						<Button variant="outline" onClick={handleBack}>
							<ArrowLeftIcon className="mr-2 h-4 w-4" />
							{currentStep === 1 ? "Cancel" : "Back"}
						</Button>
						<Button onClick={handleNext} disabled={!canProceed()}>
							{currentStep === 4 ? "Generate Rubrics & Complete" : "Next"}
							{currentStep < 4 && <ArrowRightIcon className="ml-2 h-4 w-4" />}
						</Button>
					</div>
				</div>
			</DashboardLayout>
		</FeatureGuard>
	);
}
