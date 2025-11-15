"use client";

import { Button } from "@gb/ui/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface AnswerComponent {
	component_id: string;
	component_type: string;
	expected_answer: string;
	evaluation_criteria: string;
	keywords: string[];
	marks: number;
	acceptable_variations?: string[];
}

interface QuestionAnswer {
	question_id: string;
	question_number: string;
	question_text: string;
	question_type: string;
	total_marks: number;
	answer_components: AnswerComponent[];
}

interface ModelAnswerData {
	model_answer_id: string;
	question_paper_id: string;
	question_answers: QuestionAnswer[];
}

const API_BASE_URL = "http://localhost:8083/grade/v1";

export default function ModelAnswerPage() {
	const params = useParams();
	const router = useRouter();
	const testId = params?.testId as string;

	const [modelAnswerData, setModelAnswerData] =
		useState<ModelAnswerData | null>(null);
	const [loading, setLoading] = useState(true);
	const [generating, setGenerating] = useState(false);

	const generateModelAnswers = useCallback(async () => {
		if (!testId) {
			toast.error("Invalid test ID");
			return;
		}

		setGenerating(true);
		try {
			const response = await fetch(`${API_BASE_URL}/model-answers/${testId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP ${response.status}`);
			}

			const data = await response.json();
			setModelAnswerData(data.data || data);
			toast.success("Model answers generated successfully");
		} catch (error) {
			console.error("Error generating model answers:", error);
			const message = error instanceof Error ? error.message : "Unknown error";
			toast.error(`Failed to generate model answers: ${message}`);
		} finally {
			setGenerating(false);
		}
	}, [testId]);

	const fetchModelAnswers = useCallback(async () => {
		if (!testId) return;

		try {
			setLoading(true);

			const testResponse = await fetch(
				`${API_BASE_URL}/academic-tests/${testId}`,
			);
			if (!testResponse.ok) {
				console.error(`Test fetch failed: ${testResponse.status}`);
				toast.error("Failed to load test details");
				return;
			}

			const testData = await testResponse.json();
			const test = testData.data || testData;
			console.log("Full test response:", testData);
			console.log("Extracted test:", test);
			console.log("key_answers_url:", test?.key_answers_url);

			if (test?.key_answers_url) {
				console.log("Fetching from S3:", test.key_answers_url);
				const s3Response = await fetch(test.key_answers_url);
				console.log("S3 response status:", s3Response.status);

				if (s3Response.ok) {
					const data = await s3Response.json();
					console.log("Raw S3 data:", data);
					setModelAnswerData(data);
					toast.success("Model answers loaded");
					return;
				}

				const errorText = await s3Response.text();
				console.error("S3 fetch failed:", s3Response.status, errorText);
				toast.error(`Failed to fetch from S3: ${s3Response.status}`);
			} else {
				console.log("No key_answers_url, generating...");
				await generateModelAnswers();
			}
		} catch (error) {
			console.error("Error in fetchModelAnswers:", error);
			toast.error("Failed to load model answers");
		} finally {
			setLoading(false);
		}
	}, [testId, generateModelAnswers]);

	useEffect(() => {
		if (testId) fetchModelAnswers();
	}, [testId, fetchModelAnswers]);

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
				<Button
					variant="ghost"
					size="sm"
					onClick={() => router.push("/quicks")}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Dashboard
				</Button>
			</div>

			<div className="container mx-auto p-6">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="font-semibold text-3xl">Model Answers</h1>
						<p className="text-muted-foreground text-sm">
							Reference answers for evaluation
						</p>
					</div>
					<Button variant="outline" onClick={fetchModelAnswers}>
						Reload
					</Button>
				</div>

				{!modelAnswerData?.question_answers?.length ? (
					<div className="rounded-lg border p-8 text-center">
						<p className="text-muted-foreground">No model answers available</p>
						<p className="mt-2 text-muted-foreground text-xs">
							Check console for errors
						</p>
					</div>
				) : (
					<div className="space-y-6">
						{modelAnswerData.question_answers.map((qa) => (
							<div key={qa.question_id} className="rounded-lg border">
								<div className="border-b bg-muted/50 p-4">
									<div className="flex items-center justify-between">
										<h3 className="font-semibold text-lg">
											Question {qa.question_number}
										</h3>
										<span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm">
											{qa.total_marks} marks
										</span>
									</div>
									<p className="mt-2 text-sm">{qa.question_text}</p>
									<p className="mt-1 text-muted-foreground text-xs uppercase">
										{qa.question_type.replace("_", " ")}
									</p>
								</div>

								<div className="space-y-4 p-4">
									{qa.answer_components.map((component) => (
										<div
											key={component.component_id}
											className="rounded-lg border bg-card p-4"
										>
											<div className="mb-3 flex items-start justify-between gap-4">
												<div className="flex-1">
													<div className="mb-1 flex items-center gap-2">
														<span className="rounded bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs uppercase">
															{component.component_type.replace("_", " ")}
														</span>
														<span className="text-muted-foreground text-xs">
															{component.marks}{" "}
															{component.marks === 1 ? "mark" : "marks"}
														</span>
													</div>
												</div>
											</div>

											<div className="space-y-3">
												<div>
													<p className="mb-1 font-medium text-muted-foreground text-xs">
														Expected Answer:
													</p>
													<p className="text-sm">{component.expected_answer}</p>
												</div>

												{component.keywords.length > 0 && (
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

												<div>
													<p className="mb-1 font-medium text-muted-foreground text-xs">
														Evaluation Criteria:
													</p>
													<p className="text-muted-foreground text-xs">
														{component.evaluation_criteria}
													</p>
												</div>

												{component.acceptable_variations &&
													component.acceptable_variations.length > 0 && (
														<div>
															<p className="mb-1 font-medium text-muted-foreground text-xs">
																Acceptable Variations:
															</p>
															<div className="flex flex-wrap gap-1">
																{component.acceptable_variations.map(
																	(variation, idx) => (
																		<span
																			key={idx}
																			className="rounded-full bg-muted px-2 py-0.5 text-xs"
																		>
																			{variation}
																		</span>
																	),
																)}
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
				)}
			</div>
		</div>
	);
}
