"use client";

import { Button } from "@gb/ui/src/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	type AcademicTest,
	pollForDynamicRubric,
} from "@/lib/academic-tests-api";
import { GRADE_API_BASE as API_BASE_URL } from "@/lib/api";

const ExpectedAnswer = ({ component }: { component: AnswerComponent }) => {
	if (!component) return null;

	switch (component.component_type) {
		case "concept_point":
			return (
				<p className="text-sm">{component.component_text || "No answer"}</p>
			);
		case "exact_match":
			return <p className="text-sm">{component.exact_answer || "No answer"}</p>;
		case "numerical":
			return (
				<div className="text-sm">
					<p>Value: {component.numerical_answer?.value}</p>
					{component.numerical_answer?.unit && (
						<p>Unit: {component.numerical_answer.unit}</p>
					)}
				</div>
			);
		case "code_block":
			return (
				<pre className="rounded bg-muted p-2 text-sm">
					<code>{component.code_answer?.expected_code}</code>
				</pre>
			);
		default:
			return (
				<p className="text-sm">
					{component.component_text ||
						component.exact_answer ||
						"No answer provided for this component type."}
				</p>
			);
	}
};

interface NumericalAnswer {
	value: number;
	unit?: string;
}

interface CodeAnswer {
	expected_code: string;
}

interface AnswerComponent {
	component_id: string;
	component_type: string;
	component_text?: string;
	keywords?: string[];
	component_marks?: number;
	exact_answer?: string;
	numerical_answer?: NumericalAnswer;
	code_answer?: CodeAnswer;
}

interface QuestionAnswer {
	question_id: string;
	question_number?: string;
	question_type: string;
	marks_allocated: number;
	model_answer_summary?: string;
	answer_components: AnswerComponent[];
}

interface ModelAnswerData {
	model_answer_id: string;
	question_paper_id: string;
	question_answers: QuestionAnswer[];
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
	const [testDetails, setTestDetails] = useState<AcademicTest | null>(null);
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
			setTestDetails(test);

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
		if (!testId) {
			toast.error("Invalid test ID");
			return;
		}

		// Check if rubrics already exist
		const hasRubrics =
			testDetails?.dynamic_rubrics_url ||
			(
				testDetails as unknown as {
					academic_tests?: { dynamic_rubrics_url?: string };
				}
			)?.academic_tests?.dynamic_rubrics_url ||
			testDetails?.dynamic_rubric;

		if (hasRubrics) {
			toast.success("Rubrics already generated. Proceeding to evaluation...");
			router.push(`/quicks/tests/${testId}/evaluate`);
			return;
		}

		setIsProceeding(true);
		let loadingToastId: string | number | undefined;

		try {
			// Step 1: Trigger Dynamic Rubric Generation
			loadingToastId = toast.loading("Initializing evaluation rubrics...");

			const response = await fetch(
				`${API_BASE_URL}/dynamic-rubrics/${testId}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
				},
			);

			if (!response.ok) {
				// Rubric generation endpoint returned an error
				// This might mean rubrics already exist or there was an actual error
				const errorText = await response.text();
				console.warn(
					"Rubric generation trigger response:",
					response.status,
					errorText,
				);

				// Don't fail immediately - try to poll for existing rubrics
				if (response.status === 409 || response.status === 400) {
					console.info("Rubrics may already exist, attempting to verify...");
				} else {
					toast.dismiss(loadingToastId);
					throw new Error(
						`Rubric generation failed with status ${response.status}`,
					);
				}
			}

			// Step 2: Poll until rubrics are ready
			toast.dismiss(loadingToastId);
			loadingToastId = toast.loading(
				"Generating evaluation rubrics... This may take a moment.",
			);

			const testWithRubrics = await pollForDynamicRubric(testId);

			// Step 3: Verify rubrics are available
			if (
				!testWithRubrics.dynamic_rubric &&
				!testWithRubrics.dynamic_rubrics_url
			) {
				throw new Error("Rubrics generation timed out or failed to complete");
			}

			// Step 4: Success - Navigate to evaluation page
			toast.dismiss(loadingToastId);
			toast.success("Evaluation rubrics ready! Redirecting...");

			// Small delay to show success message before navigation
			await new Promise((resolve) => setTimeout(resolve, 500));
			router.push(`/quicks/tests/${testId}/evaluate`);
		} catch (error) {
			// Cleanup any loading toasts
			if (loadingToastId) {
				toast.dismiss(loadingToastId);
			}

			const errorMessage =
				error instanceof Error ? error.message : "Unknown error occurred";
			console.error("Error preparing evaluation:", errorMessage, error);

			// Show error but allow user to proceed manually if they want
			toast.error(
				`Failed to generate rubrics: ${errorMessage}. You may proceed anyway, but evaluation might not work correctly.`,
				{
					duration: 6000,
					action: {
						label: "Proceed Anyway",
						onClick: () => {
							router.push(`/quicks/tests/${testId}/evaluate`);
						},
					},
				},
			);
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
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="font-semibold text-3xl">Model Answers</h1>
						<p className="text-muted-foreground text-sm">
							Reference answers for evaluation
						</p>
					</div>
				</div>

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
								</div>{" "}
								<div className="space-y-4 p-4">
									{qa.answer_components?.map((component) => (
										<div
											key={component.component_id}
											className="rounded-lg border bg-card p-4"
										>
											<div className="mb-3 flex items-start justify-between gap-4">
												<div className="flex-1">
													<div className="mb-1 flex items-center gap-2">
														<span className="rounded bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs uppercase">
															{component.component_type
																? component.component_type.replace(/_/g, " ")
																: "N/A"}
														</span>
														<span className="text-muted-foreground text-xs">
															{component.component_marks || 0}{" "}
															{component.component_marks === 1
																? "mark"
																: "marks"}
														</span>{" "}
													</div>
												</div>
											</div>

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
																		{keyword}
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
