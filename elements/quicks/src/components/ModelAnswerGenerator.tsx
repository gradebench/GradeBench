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
import { Textarea } from "@gb/ui/src/components/ui/textarea";
import { Loader2Icon, PlusIcon, SparklesIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import type { ModelAnswer, TestQuestion } from "../types/test-creation";

interface ModelAnswerGeneratorProps {
	questions: TestQuestion[];
	isGenerating: boolean;
	onGenerate: () => void;
	modelAnswers: ModelAnswer[];
	onAnswersChange: (answers: ModelAnswer[]) => void;
}

export function ModelAnswerGenerator({
	questions,
	isGenerating,
	onGenerate,
	modelAnswers,
	onAnswersChange,
}: ModelAnswerGeneratorProps) {
	const [selectedQuestion, setSelectedQuestion] = useState<string | null>(
		questions.length > 0 ? questions[0].id : null,
	);

	const currentAnswer = modelAnswers.find(
		(a) => a.questionId === selectedQuestion,
	);

	const updateAnswer = (updates: Partial<ModelAnswer>) => {
		if (!selectedQuestion) return;

		const existing = modelAnswers.find(
			(a) => a.questionId === selectedQuestion,
		);
		if (existing) {
			onAnswersChange(
				modelAnswers.map((a) =>
					a.questionId === selectedQuestion ? { ...a, ...updates } : a,
				),
			);
		} else {
			onAnswersChange([
				...modelAnswers,
				{
					questionId: selectedQuestion,
					answerText: "",
					keyPoints: [],
					keywords: [],
					concepts: [],
					acceptableVariations: [],
					mandatoryComponents: [],
					optionalComponents: [],
					...updates,
				},
			]);
		}
	};

	const addKeyPoint = (point: string) => {
		if (point && currentAnswer) {
			updateAnswer({ keyPoints: [...currentAnswer.keyPoints, point] });
		}
	};

	const removeKeyPoint = (index: number) => {
		if (currentAnswer) {
			updateAnswer({
				keyPoints: currentAnswer.keyPoints.filter((_, i) => i !== index),
			});
		}
	};

	const addKeyword = (keyword: string) => {
		if (keyword && currentAnswer) {
			updateAnswer({ keywords: [...currentAnswer.keywords, keyword] });
		}
	};

	const removeKeyword = (index: number) => {
		if (currentAnswer) {
			updateAnswer({
				keywords: currentAnswer.keywords.filter((_, i) => i !== index),
			});
		}
	};

	if (questions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Model Answers</CardTitle>
					<CardDescription>
						No questions added yet. Add questions in the previous step.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{/* Generation Trigger */}
			{modelAnswers.length === 0 && (
				<Card className="border-2 border-dashed">
					<CardContent className="flex flex-col items-center justify-center p-12">
						{isGenerating ? (
							<div className="flex flex-col items-center gap-4">
								<Loader2Icon className="h-12 w-12 animate-spin text-blue-600" />
								<div className="text-center">
									<h3 className="font-semibold text-lg">
										Generating Model Answers...
									</h3>
									<p className="text-muted-foreground">
										Our AI is analyzing the questions and creating key answers
									</p>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<SparklesIcon className="h-4 w-4 animate-pulse text-yellow-500" />
									<span>This may take a few moments</span>
								</div>
							</div>
						) : (
							<div className="flex flex-col items-center gap-4">
								<SparklesIcon className="h-16 w-16 text-blue-600" />
								<div className="text-center">
									<h3 className="font-semibold text-lg">
										Generate Model Answers with AI
									</h3>
									<p className="text-muted-foreground">
										Let our AI generate draft model answers for all{" "}
										{questions.length} questions
									</p>
								</div>
								<Button onClick={onGenerate} size="lg">
									<SparklesIcon className="mr-2 h-5 w-5" />
									Generate Model Answers
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Model Answer Editor */}
			{modelAnswers.length > 0 && (
				<div className="grid grid-cols-12 gap-4">
					{/* Questions Sidebar */}
					<div className="col-span-4 space-y-2">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Questions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								{questions.map((q) => {
									const hasAnswer = modelAnswers.some(
										(a) => a.questionId === q.id,
									);
									return (
										<button
											key={q.id}
											type="button"
											onClick={() => setSelectedQuestion(q.id)}
											className={`w-full rounded-lg border p-3 text-left transition-colors ${
												selectedQuestion === q.id
													? "border-blue-500 bg-blue-50"
													: "border-gray-200 hover:border-gray-300"
											}`}
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<Badge variant="secondary" className="mb-1">
														Q{q.questionNumber}
													</Badge>
													<p className="line-clamp-2 text-sm">
														{q.questionText}
													</p>
												</div>
												{hasAnswer && <Badge className="ml-2">✓</Badge>}
											</div>
										</button>
									);
								})}
							</CardContent>
						</Card>
					</div>

					{/* Answer Editor */}
					<div className="col-span-8 space-y-4">
						{selectedQuestion && (
							<>
								<Card>
									<CardHeader>
										<CardTitle>
											Question{" "}
											{
												questions.find((q) => q.id === selectedQuestion)
													?.questionNumber
											}
										</CardTitle>
										<CardDescription>
											{
												questions.find((q) => q.id === selectedQuestion)
													?.questionText
											}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<Label>Model Answer</Label>
											<Textarea
												value={currentAnswer?.answerText || ""}
												onChange={(e) =>
													updateAnswer({ answerText: e.target.value })
												}
												placeholder="Enter the complete model answer..."
												rows={8}
											/>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Key Points</CardTitle>
										<CardDescription>
											Add the main points that should be present in the answer
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											{currentAnswer?.keyPoints.map((point, idx) => (
												<div key={idx} className="flex items-center gap-2">
													<Badge variant="outline" className="flex-1">
														{point}
													</Badge>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => removeKeyPoint(idx)}
													>
														<TrashIcon className="h-4 w-4" />
													</Button>
												</div>
											))}
										</div>
										<div className="flex gap-2">
											<Input
												placeholder="Add a key point..."
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														addKeyPoint(e.currentTarget.value);
														e.currentTarget.value = "";
													}
												}}
											/>
											<Button
												variant="outline"
												onClick={(e) => {
													const input = e.currentTarget
														.previousElementSibling as HTMLInputElement;
													addKeyPoint(input.value);
													input.value = "";
												}}
											>
												<PlusIcon className="h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Keywords</CardTitle>
										<CardDescription>
											Important terms that should appear in student answers
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex flex-wrap gap-2">
											{currentAnswer?.keywords.map((keyword, idx) => (
												<Badge
													key={idx}
													variant="secondary"
													className="cursor-pointer"
													onClick={() => removeKeyword(idx)}
												>
													{keyword} ×
												</Badge>
											))}
										</div>
										<div className="flex gap-2">
											<Input
												placeholder="Add a keyword..."
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														addKeyword(e.currentTarget.value);
														e.currentTarget.value = "";
													}
												}}
											/>
											<Button
												variant="outline"
												onClick={(e) => {
													const input = e.currentTarget
														.previousElementSibling as HTMLInputElement;
													addKeyword(input.value);
													input.value = "";
												}}
											>
												<PlusIcon className="h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
