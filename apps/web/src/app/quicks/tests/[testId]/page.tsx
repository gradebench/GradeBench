"use client";

import { Badge } from "@gb/ui/src/components/ui/badge";
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
import { Progress } from "@gb/ui/src/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@gb/ui/src/components/ui/select";
import { Textarea } from "@gb/ui/src/components/ui/textarea";
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
	ArrowLeftIcon,
	ArrowRightIcon,
	CheckCircleIcon,
	FileTextIcon,
	PlusIcon,
	SettingsIcon,
	SparklesIcon,
	TrashIcon,
	XIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useId, useState } from "react";

const STEPS = [
	{
		id: 1,
		title: "Test Setup",
		icon: FileTextIcon,
		description: "Test details & question papers",
	},
	{
		id: 2,
		title: "Evaluator Config",
		icon: SettingsIcon,
		description: "Configure evaluation",
	},
	{
		id: 3,
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

// Mock pre-fetched questions from uploaded paper
const MOCK_FETCHED_QUESTIONS: TestQuestion[] = [
	{
		id: "q1",
		questionNumber: 1,
		questionText:
			"Explain the significance of the Magna Carta in the development of constitutional law.",
		questionType: "long_answer",
		marks: 15,
		wordLimit: 250,
		mandatory: true,
	},
	{
		id: "q2",
		questionNumber: 2,
		questionText:
			"Discuss the role of the French Revolution in shaping modern European politics.",
		questionType: "essay",
		marks: 20,
		wordLimit: 400,
		mandatory: true,
	},
	{
		id: "q3",
		questionNumber: 3,
		questionText: "What were the main causes of World War I?",
		questionType: "short_answer",
		marks: 10,
		wordLimit: 150,
		mandatory: true,
	},
	{
		id: "q4",
		questionNumber: 4,
		questionText: "Analyze the impact of colonialism on African economies.",
		questionType: "long_answer",
		marks: 15,
		wordLimit: 300,
		mandatory: true,
	},
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
	const academicYearId = useId();
	const gradeLevelId = useId();
	const institutionId = useId();
	const instructionsId = useId();

	// Test Basic Info State
	const [basicInfo, setBasicInfo] = useState<Partial<TestBasicInfo>>({
		testId: isNewTest ? crypto.randomUUID() : testId,
		title: "",
		category: "upsc",
		subject: "",
		totalMarks: 60, // Pre-calculated from fetched questions
		totalQuestions: 4, // From fetched questions
		duration: 180,
		description: "",
		instructions: "",
		questionPapers: [],
		createdAt: new Date().toISOString(),
	});

	// Additional metadata state
	const [academicYear, setAcademicYear] = useState("2024-2025");
	const [gradeLevel, setGradeLevel] = useState("Grade 12");
	const [institution, setInstitution] = useState(
		"Central Board of Secondary Education",
	);
	const [additionalInstructions, setAdditionalInstructions] = useState<
		string[]
	>([
		"Answer all questions",
		"Use black or blue pen only",
		"Draw diagrams wherever necessary",
	]);

	// Questions State - Initialize with fetched questions
	const [questions, setQuestions] = useState<TestQuestion[]>(
		MOCK_FETCHED_QUESTIONS,
	);
	const [currentQuestion, setCurrentQuestion] = useState<Partial<TestQuestion>>(
		{
			id: crypto.randomUUID(),
			questionNumber: 5,
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
		if (currentStep === 3) {
			// Final step - generate rubrics and navigate
			handleFinalize();
		} else {
			setCurrentStep((prev) => Math.min(prev + 1, 3));
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
				return (
					basicInfo.title &&
					basicInfo.category &&
					basicInfo.subject &&
					questions.length > 0
				);
			case 2:
				return true; // Evaluator config is optional
			case 3:
				return true; // Model answers can be empty
			default:
				return false;
		}
	};
	const progressPercentage = (currentStep / 3) * 100;

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

					{/* Step 1: Test Setup (Test Details + Pre-fetched Questions) */}
					{currentStep === 1 && (
						<div className="space-y-6">
							{/* Basic Test Information */}
							<Card className="border-blue-600/20 bg-slate-950">
								<CardHeader>
									<CardTitle className="text-blue-400">Test Details</CardTitle>
									<CardDescription className="text-slate-400">
										Enter the basic information about your test
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor={titleId} className="text-slate-200">
												Test Title *
											</Label>
											<Input
												id={titleId}
												placeholder="e.g., UPSC Civil Services 2025 - GS Paper 1"
												value={basicInfo.title}
												onChange={(e) =>
													setBasicInfo({ ...basicInfo, title: e.target.value })
												}
												className="border-blue-600/30 bg-slate-900 text-slate-100"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor={categoryId} className="text-slate-200">
												Category *
											</Label>
											<Select
												value={basicInfo.category}
												onValueChange={(value: ExamCategory) =>
													setBasicInfo({ ...basicInfo, category: value })
												}
											>
												<SelectTrigger
													id={categoryId}
													className="border-blue-600/30 bg-slate-900 text-slate-100"
												>
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
												<SelectContent className="border-blue-600/30 bg-slate-900">
													{EXAM_CATEGORIES.map((cat) => (
														<SelectItem
															key={cat.value}
															value={cat.value}
															className="text-slate-100 focus:bg-blue-600/20"
														>
															{cat.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<Label htmlFor={subjectId} className="text-slate-200">
												Subject *
											</Label>
											{basicInfo.category === "upsc" ? (
												<Select
													value={basicInfo.subject}
													onValueChange={(value) =>
														setBasicInfo({ ...basicInfo, subject: value })
													}
												>
													<SelectTrigger
														id={subjectId}
														className="border-blue-600/30 bg-slate-900 text-slate-100"
													>
														<SelectValue placeholder="Select subject" />
													</SelectTrigger>
													<SelectContent className="border-blue-600/30 bg-slate-900">
														{UPSC_SUBJECTS.map((subj) => (
															<SelectItem
																key={subj.value}
																value={subj.value}
																className="text-slate-100 focus:bg-blue-600/20"
															>
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
													className="border-blue-600/30 bg-slate-900 text-slate-100"
												/>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor={durationId} className="text-slate-200">
												Duration (minutes)
											</Label>
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
												className="border-blue-600/30 bg-slate-900 text-slate-100"
											/>
										</div>

										<div className="space-y-2">
											<Label
												htmlFor={academicYearId}
												className="text-slate-200"
											>
												Academic Year
											</Label>
											<Input
												id={academicYearId}
												placeholder="e.g., 2024-2025"
												value={academicYear}
												onChange={(e) => setAcademicYear(e.target.value)}
												className="border-blue-600/30 bg-slate-900 text-slate-100"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor={gradeLevelId} className="text-slate-200">
												Grade Level
											</Label>
											<Input
												id={gradeLevelId}
												placeholder="e.g., Grade 12"
												value={gradeLevel}
												onChange={(e) => setGradeLevel(e.target.value)}
												className="border-blue-600/30 bg-slate-900 text-slate-100"
											/>
										</div>

										<div className="space-y-2 md:col-span-2">
											<Label htmlFor={institutionId} className="text-slate-200">
												Institution
											</Label>
											<Input
												id={institutionId}
												placeholder="e.g., Central Board of Secondary Education"
												value={institution}
												onChange={(e) => setInstitution(e.target.value)}
												className="border-blue-600/30 bg-slate-900 text-slate-100"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor={descriptionId} className="text-slate-200">
											Description (Optional)
										</Label>
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
											className="border-blue-600/30 bg-slate-900 text-slate-100"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor={instructionsId} className="text-slate-200">
											Instructions
										</Label>
										<div className="space-y-2">
											{additionalInstructions.map((instruction, idx) => (
												<div
													key={idx}
													className="flex items-center gap-2 rounded-md border border-blue-600/20 bg-slate-900 px-3 py-2"
												>
													<span className="flex-1 text-slate-100 text-sm">
														{instruction}
													</span>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => {
															setAdditionalInstructions(
																additionalInstructions.filter(
																	(_, i) => i !== idx,
																),
															);
														}}
														className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
													>
														<XIcon className="h-4 w-4" />
													</Button>
												</div>
											))}
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Pre-fetched Questions from Uploaded Paper */}
							<Card className="border-blue-600/20 bg-slate-950">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-blue-400">
										<FileTextIcon className="h-5 w-5" />
										<span>Questions from Uploaded Paper</span>
									</CardTitle>
									<CardDescription className="text-slate-400">
										{questions.length} questions detected •{" "}
										{basicInfo.totalMarks} total marks
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									{questions.map((q) => (
										<div
											key={q.id}
											className="rounded-lg border border-blue-600/20 bg-slate-900 p-4 transition-colors hover:border-blue-600/40"
										>
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1 space-y-2">
													<div className="flex items-start gap-3">
														<Badge
															variant="outline"
															className="mt-0.5 border-blue-600/30 bg-blue-600/10 text-blue-400"
														>
															Q{q.questionNumber}
														</Badge>
														<div className="flex-1">
															<p className="font-medium text-slate-100 leading-relaxed">
																{q.questionText}
															</p>
															<div className="mt-3 flex flex-wrap gap-2">
																<Badge
																	variant="secondary"
																	className="border-slate-700 bg-slate-800 text-slate-300"
																>
																	{
																		QUESTION_TYPES.find(
																			(t) => t.value === q.questionType,
																		)?.label
																	}
																</Badge>
																<Badge
																	variant="secondary"
																	className="border-slate-700 bg-slate-800 text-slate-300"
																>
																	{q.marks} marks
																</Badge>
																{q.wordLimit && (
																	<Badge
																		variant="secondary"
																		className="border-slate-700 bg-slate-800 text-slate-300"
																	>
																		≤ {q.wordLimit} words
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
													className="text-slate-400 hover:text-red-400"
												>
													<TrashIcon className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
								</CardContent>
							</Card>

							{/* Manual Question Addition */}
							<Card className="border-blue-600/20 bg-slate-950">
								<CardHeader>
									<CardTitle className="text-blue-400">
										Add More Questions (Optional)
									</CardTitle>
									<CardDescription className="text-slate-400">
										Add additional questions manually
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Add New Question Form */}
									<div className="space-y-4 rounded-lg border border-blue-600/20 bg-slate-900 p-4">
										<h4 className="font-semibold text-blue-400 text-sm">
											Add New Question
										</h4>
										<div className="space-y-3">
											<div className="space-y-2">
												<Label className="text-slate-200 text-sm">
													Question Text *
												</Label>
												<Textarea
													placeholder="Enter the question..."
													value={currentQuestion.questionText}
													onChange={(e) =>
														setCurrentQuestion({
															...currentQuestion,
															questionText: e.target.value,
														})
													}
													rows={2}
													className="border-blue-600/30 bg-slate-800 text-slate-100"
												/>
											</div>

											<div className="grid grid-cols-3 gap-3">
												<div className="space-y-2">
													<Label className="text-slate-200 text-sm">Type</Label>
													<Select
														value={currentQuestion.questionType}
														onValueChange={(value: QuestionType) =>
															setCurrentQuestion({
																...currentQuestion,
																questionType: value,
															})
														}
													>
														<SelectTrigger className="border-blue-600/30 bg-slate-800 text-slate-100">
															<SelectValue />
														</SelectTrigger>
														<SelectContent className="border-blue-600/30 bg-slate-900">
															{QUESTION_TYPES.map((type) => (
																<SelectItem
																	key={type.value}
																	value={type.value}
																	className="text-slate-100 focus:bg-blue-600/20"
																>
																	{type.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>

												<div className="space-y-2">
													<Label className="text-slate-200 text-sm">
														Marks *
													</Label>
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
														className="border-blue-600/30 bg-slate-800 text-slate-100"
													/>
												</div>

												<div className="space-y-2">
													<Label className="text-slate-200 text-sm">
														Word Limit
													</Label>
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
														className="border-blue-600/30 bg-slate-800 text-slate-100"
													/>
												</div>
											</div>

											<Button
												onClick={handleAddQuestion}
												disabled={
													!currentQuestion.questionText ||
													!currentQuestion.marks
												}
												className="w-full bg-blue-600 hover:bg-blue-700"
											>
												<PlusIcon className="mr-2 h-4 w-4" />
												Add Question
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* Step 2: Evaluator Config (previously Step 3) */}
					{currentStep === 2 && (
						<EvaluatorConfigPanel
							config={evaluatorConfig}
							onChange={setEvaluatorConfig}
						/>
					)}

					{/* Step 3: Model Answers (previously Step 4) */}
					{currentStep === 3 && (
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
							{currentStep === 3 ? "Generate Rubrics & Complete" : "Next"}
							{currentStep < 3 && <ArrowRightIcon className="ml-2 h-4 w-4" />}
						</Button>
					</div>
				</div>
			</DashboardLayout>
		</FeatureGuard>
	);
}
