"use client";

import { Badge } from "@gb/ui/src/components/ui/badge";
import { Button } from "@gb/ui/src/components/ui/button";
import { Card } from "@gb/ui/src/components/ui/card";
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	Circle,
	FileCheck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { pollForDynamicRubric } from "@/lib/academic-tests-api";
import { GRADE_API_BASE as API_BASE_URL } from "@/lib/api";

const ExpectedAnswer = ({ component }: { component: AnswerComponent }) => {
	if (!component) return null;

	const renderKeywords = () => {
		if (!component.keywords || component.keywords.length === 0) return null;
		return (
			<div className="mt-2 space-y-1">
				<p className="font-medium text-muted-foreground text-xs">Keywords:</p>
				<div className="flex flex-wrap gap-1">
					{component.keywords.map((kw, idx) => (
						<Badge
							key={idx}
							variant={kw.is_mandatory ? "default" : "secondary"}
							className="text-xs"
						>
							{kw.keyword}
							{kw.weight && ` (${Math.round(kw.weight * 100)}%)`}
						</Badge>
					))}
				</div>
			</div>
		);
	};

	const renderConcepts = () => {
		if (!component.concepts || component.concepts.length === 0) return null;
		return (
			<div className="mt-2 space-y-1">
				<p className="font-medium text-muted-foreground text-xs">
					Key Concepts:
				</p>
				<ul className="ml-4 space-y-1 text-sm">
					{component.concepts.map((concept, idx) => (
						<li key={idx} className="list-disc">
							<span className="font-medium">{concept.concept_name}:</span>{" "}
							{concept.concept_description}
							{concept.weight && (
								<span className="text-muted-foreground">
									{" "}
									({Math.round(concept.weight * 100)}%)
								</span>
							)}
						</li>
					))}
				</ul>
			</div>
		);
	};

	switch (component.component_type) {
		case "exact_match":
			return (
				<div>
					<p className="font-medium text-sm">{component.exact_answer}</p>
					{renderKeywords()}
				</div>
			);

		case "numerical":
			return (
				<div className="space-y-2 text-sm">
					<div className="flex items-center gap-2">
						<span className="font-medium">Value:</span>
						<span>{component.numerical_answer?.value}</span>
						{component.numerical_answer?.unit && (
							<Badge variant="outline">{component.numerical_answer.unit}</Badge>
						)}
					</div>
					{component.numerical_answer?.acceptable_range && (
						<div className="text-muted-foreground">
							Range: {component.numerical_answer.acceptable_range.min} -{" "}
							{component.numerical_answer.acceptable_range.max}
						</div>
					)}
					{component.numerical_answer?.significant_figures && (
						<div className="text-muted-foreground">
							Sig. Figures: {component.numerical_answer.significant_figures}
						</div>
					)}
				</div>
			);

		case "code_block":
			return (
				<div className="space-y-2">
					<div>
						<Badge variant="secondary" className="mb-2">
							{component.code_answer?.language || "Code"}
						</Badge>
						<pre className="overflow-x-auto rounded border bg-muted p-3 text-xs">
							<code>{component.code_answer?.expected_code}</code>
						</pre>
					</div>
					{component.code_answer?.test_cases &&
						component.code_answer.test_cases.length > 0 && (
							<div className="space-y-1">
								<p className="font-medium text-muted-foreground text-xs">
									Test Cases:
								</p>
								{component.code_answer.test_cases.map((tc, idx) => (
									<Card key={idx} className="p-2">
										<div className="space-y-1 text-xs">
											<div>
												<span className="font-medium">Input:</span> {tc.input}
											</div>
											<div>
												<span className="font-medium">Expected:</span>{" "}
												{tc.expected_output}
											</div>
										</div>
									</Card>
								))}
							</div>
						)}
				</div>
			);

		case "method_steps":
			return (
				<div className="space-y-2">
					<p className="font-medium text-muted-foreground text-xs">
						Solution Steps:
					</p>
					{component.method_steps?.map((step, idx) => (
						<Card key={idx} className="p-3">
							<div className="flex gap-3">
								<Badge variant="outline" className="h-6 w-6 rounded-full p-0">
									{step.step_number}
								</Badge>
								<div className="flex-1 space-y-1">
									<p className="text-sm">{step.step_description}</p>
									<div className="flex items-center gap-2">
										<Badge variant="secondary" className="text-xs">
											{step.step_marks} marks
										</Badge>
										{step.required_keywords &&
											step.required_keywords.length > 0 && (
												<span className="text-muted-foreground text-xs">
													Keywords: {step.required_keywords.join(", ")}
												</span>
											)}
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			);

		case "essay_structure":
			return (
				<div className="space-y-2">
					{component.essay_criteria?.structure_requirements && (
						<div className="space-y-1 text-sm">
							<p className="font-medium">Structure Requirements:</p>
							<ul className="ml-4 space-y-1">
								{component.essay_criteria.structure_requirements
									.requires_introduction && (
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-600" />
										Introduction required
									</li>
								)}
								{component.essay_criteria.structure_requirements
									.requires_body_paragraphs && (
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-600" />
										Body paragraphs (min:{" "}
										{component.essay_criteria.structure_requirements
											.min_body_paragraphs || 1}
										)
									</li>
								)}
								{component.essay_criteria.structure_requirements
									.requires_conclusion && (
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-600" />
										Conclusion required
									</li>
								)}
							</ul>
						</div>
					)}
					{component.essay_criteria?.argument_points &&
						component.essay_criteria.argument_points.length > 0 && (
							<div className="space-y-1">
								<p className="font-medium text-sm">Key Arguments:</p>
								<ul className="ml-4 space-y-1 text-sm">
									{component.essay_criteria.argument_points.map((arg, idx) => (
										<li key={idx} className="list-disc">
											{arg.point_description}
											{arg.marks_weight && (
												<Badge variant="secondary" className="ml-2 text-xs">
													{Math.round(arg.marks_weight * 100)}%
												</Badge>
											)}
										</li>
									))}
								</ul>
							</div>
						)}
				</div>
			);

		case "keyword_based":
			return (
				<div>
					{component.exact_answer && (
						<p className="mb-2 text-sm">{component.exact_answer}</p>
					)}
					{renderKeywords()}
					{renderConcepts()}
				</div>
			);

		case "concept_based":
			return (
				<div>
					{component.exact_answer && (
						<p className="mb-2 text-sm">{component.exact_answer}</p>
					)}
					{renderConcepts()}
				</div>
			);

		case "diagram":
			return (
				<div className="space-y-2">
					{component.diagram_answer?.reference_diagram_url && (
						<div className="relative h-64 w-full">
							{/* biome-ignore lint/performance/noImgElement: External diagram URLs from S3, Next.js Image requires known domains */}
							<img
								src={component.diagram_answer.reference_diagram_url}
								alt="Reference diagram"
								className="max-h-64 rounded border object-contain"
							/>
						</div>
					)}
					{component.diagram_answer?.required_elements &&
						component.diagram_answer.required_elements.length > 0 && (
							<div className="space-y-1 text-sm">
								<p className="font-medium">Required Elements:</p>
								<ul className="ml-4 space-y-1">
									{component.diagram_answer.required_elements.map((el, idx) => (
										<li key={idx} className="flex items-center gap-2">
											{el.is_mandatory ? (
												<CheckCircle className="h-4 w-4 text-green-600" />
											) : (
												<Circle className="h-4 w-4 text-gray-400" />
											)}
											{el.element_name} ({el.element_type})
										</li>
									))}
								</ul>
							</div>
						)}
				</div>
			);
		default:
			return (
				<div>
					<p className="text-sm">
						{component.exact_answer || "Answer component defined"}
					</p>
					{renderKeywords()}
					{renderConcepts()}
				</div>
			);
	}
};

// Comprehensive type definitions matching JSON schema
interface NumericalAnswer {
	value: number;
	unit?: string;
	acceptable_range?: {
		min: number;
		max: number;
	};
	significant_figures?: number;
	alternative_units?: {
		unit: string;
		conversion_factor: number;
	}[];
}

interface KeywordItem {
	keyword: string;
	is_mandatory?: boolean;
	weight?: number;
	synonyms?: string[];
}

interface ConceptItem {
	concept_name: string;
	concept_description: string;
	weight?: number;
}

interface CodeAnswer {
	language?: string;
	expected_code: string;
	test_cases?: {
		input: string;
		expected_output: string;
		marks_weight?: number;
	}[];
	required_constructs?: string[];
}

interface DiagramAnswer {
	reference_diagram_url?: string;
	required_elements?: {
		element_name: string;
		element_type: string;
		is_mandatory?: boolean;
		coordinates?: { x: number; y: number };
	}[];
}

interface MethodStep {
	step_number: number;
	step_description: string;
	step_marks: number;
	required_keywords?: string[];
}

interface EssayCriteria {
	structure_requirements?: {
		requires_introduction?: boolean;
		requires_body_paragraphs?: boolean;
		min_body_paragraphs?: number;
		requires_conclusion?: boolean;
	};
	argument_points?: {
		point_description: string;
		supporting_evidence_required?: boolean;
		marks_weight?: number;
	}[];
	thesis_statement_required?: boolean;
}

interface AnswerComponent {
	component_id: string;
	component_type:
		| "exact_match"
		| "keyword_based"
		| "concept_based"
		| "numerical"
		| "formula"
		| "code_block"
		| "diagram"
		| "essay_structure"
		| "method_steps"
		| "other";
	component_label?: string;
	marks_allocated?: number;
	component_marks?: number;
	is_mandatory?: boolean;
	exact_answer?: string;
	numerical_answer?: NumericalAnswer;
	keywords?: KeywordItem[];
	concepts?: ConceptItem[];
	code_answer?: CodeAnswer;
	diagram_answer?: DiagramAnswer;
	method_steps?: MethodStep[];
	essay_criteria?: EssayCriteria;
}

interface CommonError {
	error_description: string;
	penalty: number;
	feedback_template?: string;
}

interface QuestionAnswer {
	question_id: string;
	question_number?: string;
	question_type?:
		| "mcq"
		| "short_answer"
		| "long_answer"
		| "numerical"
		| "code"
		| "diagram"
		| "essay"
		| "true_false"
		| "fill_blank"
		| "matching"
		| "other";
	marks_allocated?: number;
	model_answer_summary?: string;
	answer_components: AnswerComponent[];
	overall_guidance?: string;
	common_errors?: CommonError[];
}

interface ModelAnswerData {
	model_answer_id: string;
	paper_id?: string;
	question_paper_id?: string;
	question_answers: QuestionAnswer[];
	evaluator_notes?: string;
	approved_by?: string;
	approval_timestamp?: string;
	version?: string;
	created_at?: string;
	updated_at?: string;
}
export default function ModelAnswerPage() {
	const params = useParams();
	const router = useRouter();
	const testId = params?.testId as string;

	const [modelAnswerData, setModelAnswerData] =
		useState<ModelAnswerData | null>(null);
	const [loading, setLoading] = useState(true);
	const [generating, setGenerating] = useState(false);
	const [needsGeneration, setNeedsGeneration] = useState(false);
	const [generationFinished, setGenerationFinished] = useState(false);
	const [isProceeding, setIsProceeding] = useState(false);

	const generateModelAnswers = useCallback(async () => {
		if (!testId) {
			toast.error("Invalid test ID");
			return;
		}

		setGenerating(true);
		toast.info(
			"Starting model answer generation... Please do not leave or reload the page.",
			{
				duration: 10000, // Keep the toast visible for longer
			},
		);

		try {
			const response = await fetch(`${API_BASE_URL}/model-answers/${testId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP ${response.status}`);
			}

			toast.success(
				"Model answer generation started successfully. Fetching results...",
			);
			setGenerationFinished(true);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			toast.error(`Failed to start model answer generation: ${message}`);
		} finally {
			setGenerating(false);
		}
	}, [testId]);

	const fetchModelAnswers = useCallback(async () => {
		if (!testId) return;

		try {
			setLoading(true);
			setNeedsGeneration(false); // Reset on each fetch

			const testResponse = await fetch(
				`${API_BASE_URL}/academic-tests/${testId}`,
			);
			if (!testResponse.ok) {
				toast.error("Failed to load test details");
				return;
			}

			const testData = await testResponse.json();
			console.log(testData);

			const test = testData.data || testData;

			if (test?.academic_tests?.key_answers_url) {
				const s3Response = await fetch(test.academic_tests.key_answers_url);

				if (s3Response.ok) {
					const data = await s3Response.json();
					setModelAnswerData(data);
					toast.success("Model answers loaded");
					return;
				}

				const _errorText = await s3Response.text();
				toast.error(`Failed to fetch from S3: ${s3Response.status}`);
			} else {
				setNeedsGeneration(true);
			}
		} catch (_error) {
			toast.error("Failed to load model answers");
		} finally {
			setLoading(false);
		}
	}, [testId]);

	useEffect(() => {
		if (testId) {
			fetchModelAnswers();
		}
	}, [testId, fetchModelAnswers]);

	useEffect(() => {
		if (generationFinished) {
			fetchModelAnswers();
			setGenerationFinished(false); // Reset the trigger
		}
	}, [generationFinished, fetchModelAnswers]);

	const handleProceedToEvaluation = async () => {
		if (!testId) return;
		setIsProceeding(true);

		if (modelAnswerData)
			try {
				const testResponse = await fetch(
					`${API_BASE_URL}/academic-tests/${testId}`,
				);
				if (!testResponse.ok) {
					toast.error("Failed to load test details");
					return;
				}

				const testData = await testResponse.json();

				if (testData.data.academic_tests.dynamic_rubrics_url !== null) {
					return router.push(`/quicks/tests/${testId}/evaluate`);
				}
				// 1. Trigger Dynamic Rubric Generation
				toast.info("Initializing evaluation rubrics...");
				const response = await fetch(
					`${API_BASE_URL}/dynamic-rubrics/${testId}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
					},
				);

				if (!response.ok) {
					// If it fails, it might be because it already exists or other error.
					// We'll log it but try to proceed after polling.
					console.warn(
						"Rubric generation trigger failed or already exists:",
						response.status,
					);
				}

				// 2. Poll until rubrics are ready
				toast.loading("Generating rubrics, please wait...");
				await pollForDynamicRubric(testId);
				toast.dismiss();
				toast.success("Rubrics ready! Proceeding to evaluation.");

				// 3. Navigate
				router.push(`/quicks/tests/${testId}/evaluate`);
			} catch (error) {
				console.error("Error preparing evaluation:", error);
				toast.dismiss();
				toast.error("Failed to generate rubrics. Proceeding anyway...");
				// Fallback: navigate anyway
				router.push(`/quicks/tests/${testId}/evaluate`);
			} finally {
				setIsProceeding(false);
			}
	};

	if (loading || generating) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
					<p className="text-muted-foreground">
						{generating ? "Generating model answers..." : "Loading..."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="border-b bg-background p-6">
				<div className="container mx-auto flex items-center justify-between">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => router.push("/quicks")}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Dashboard
					</Button>
					{modelAnswerData && (
						<Button
							size="sm"
							onClick={handleProceedToEvaluation}
							disabled={isProceeding}
						>
							{isProceeding ? (
								<>
									<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
									Preparing...
								</>
							) : (
								<>
									Proceed to Evaluation
									<ArrowRight className="ml-2 h-4 w-4" />
								</>
							)}
						</Button>
					)}
				</div>
			</div>

			<div className="container mx-auto p-6">
				<div className="mb-8 space-y-1">
					<h1 className="flex items-center gap-3 font-bold text-3xl tracking-tight">
						<div className="rounded-lg bg-primary/10 p-2.5">
							<FileCheck className="h-6 w-6 text-primary" />
						</div>
						Model Answers
					</h1>
					<p className="ml-14 text-muted-foreground">
						Reference answers and marking criteria for evaluation
					</p>
				</div>{" "}
				{modelAnswerData?.question_answers?.length ? (
					<div className="space-y-6">
						{modelAnswerData.question_answers.map((qa) => (
							<div key={qa.question_id} className="rounded-lg border">
								<div className="border-b bg-muted/50 p-4">
									<div className="flex items-center justify-between">
										<h3 className="font-semibold text-lg">
											Question {qa.question_number || "N/A"}
										</h3>
										<span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm">
											{qa.marks_allocated || 0} marks
										</span>
									</div>
									<p className="mt-1 text-muted-foreground text-xs uppercase">
										{qa.question_type
											? qa.question_type.replace(/_/g, " ")
											: "N/A"}
									</p>
									{qa.model_answer_summary && (
										<div className="mt-2">
											<p className="mb-1 font-medium text-muted-foreground text-xs">
												Summary:
											</p>
											<p className="text-sm">{qa.model_answer_summary}</p>
										</div>
									)}
								</div>
								<div className="space-y-4 p-5">
									{qa.answer_components?.map((component, idx) => (
										<div
											key={component.component_id}
											className="rounded-xl border-2 bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
										>
											<div className="mb-3 flex items-start justify-between gap-4">
												<div className="flex-1">
													<div className="mb-2 flex flex-wrap items-center gap-2">
														<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
															{idx + 1}
														</div>
														<Badge
															variant="secondary"
															className="font-medium text-xs"
														>
															{component.component_type
																? component.component_type.replace(/_/g, " ")
																: "N/A"}
														</Badge>
														{component.is_mandatory && (
															<Badge variant="destructive" className="text-xs">
																Required
															</Badge>
														)}
													</div>
												</div>
												<Badge variant="outline" className="font-semibold">
													{component.marks_allocated ||
														component.component_marks ||
														0}{" "}
													{(component.marks_allocated ||
														component.component_marks) === 1
														? "mark"
														: "marks"}
												</Badge>
											</div>{" "}
											<div className="space-y-3">
												<div>
													<p className="mb-1 font-medium text-muted-foreground text-xs">
														Expected Answer:
													</p>
													<ExpectedAnswer component={component} />
												</div>
												{component.keywords &&
													component.keywords.length > 0 && (
														<div>
															<p className="mb-1 font-medium text-muted-foreground text-xs">
																Keywords:
															</p>
															<div className="flex flex-wrap gap-1">
																{component.keywords.map((keyword, idx) => (
																	<span
																		key={idx}
																		className="rounded-full bg-muted px-2 py-0.5 text-xs"
																	>
																		{typeof keyword === "string"
																			? keyword
																			: keyword.keyword}
																	</span>
																))}
															</div>
														</div>
													)}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				) : needsGeneration ? (
					<div className="rounded-lg border p-8 text-center">
						<p className="text-muted-foreground">
							Model answers have not been generated yet.
						</p>
						<Button
							variant="outline"
							onClick={generateModelAnswers}
							className="mt-4"
							disabled={generating}
						>
							{generating ? "Generating..." : "Generate Model Answers"}
						</Button>
					</div>
				) : (
					<div className="rounded-lg border p-8 text-center">
						<p className="text-muted-foreground">No model answers available</p>
					</div>
				)}
			</div>
		</div>
	);
}
