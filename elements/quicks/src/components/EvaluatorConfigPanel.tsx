"use client";

import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@gb/ui/src/components/ui/alert";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@gb/ui/src/components/ui/select";
import { Slider } from "@gb/ui/src/components/ui/slider";
import { Switch } from "@gb/ui/src/components/ui/switch";
import { Textarea } from "@gb/ui/src/components/ui/textarea";
import {
	AlertCircleIcon,
	CheckCircleIcon,
	InfoIcon,
	MessageSquareIcon,
	RotateCcwIcon,
	SlidersIcon,
	SparklesIcon,
} from "lucide-react";
import { useState } from "react";
import {
	createDefaultEvaluatorConfig,
	type EvaluatorConfiguration,
	type FeedbackTone,
	type FeedbackVerbosity,
	type HandwritingInterpretation,
	type LeniencyLevel,
	type ParaphrasingTolerance,
} from "../types/evaluator-config";

interface EvaluatorConfigPanelProps {
	config: EvaluatorConfiguration | null;
	onChange: (config: EvaluatorConfiguration) => void;
}

export function EvaluatorConfigPanel({
	config,
	onChange,
}: EvaluatorConfigPanelProps) {
	const [localConfig, setLocalConfig] = useState<EvaluatorConfiguration>(
		config || createDefaultEvaluatorConfig(),
	);

	const updateSection = <T extends keyof EvaluatorConfiguration>(
		section: T,
		updates: Partial<EvaluatorConfiguration[T]>,
	) => {
		const newConfig = {
			...localConfig,
			[section]: { ...localConfig[section], ...updates },
		};
		setLocalConfig(newConfig);
		onChange(newConfig);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card className="border-blue-600/20 bg-slate-950">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="space-y-2">
							<CardTitle className="flex items-center gap-2 text-2xl text-blue-400">
								<SlidersIcon className="h-6 w-6" />
								Evaluator Configuration
							</CardTitle>
							<CardDescription className="text-slate-400">
								Configure how the AI evaluates and grades student answers
							</CardDescription>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								const defaultConfig = createDefaultEvaluatorConfig();
								setLocalConfig(defaultConfig);
								onChange(defaultConfig);
							}}
							className="border-blue-600/30 text-blue-400 hover:bg-blue-600/10"
						>
							<RotateCcwIcon className="mr-2 h-4 w-4" />
							Reset to Default
						</Button>
					</div>
				</CardHeader>
			</Card>

			{/* Identity Section */}
			<Card className="border-blue-600/20 bg-slate-950">
				<CardHeader>
					<div className="flex items-center gap-2">
						<InfoIcon className="h-5 w-5 text-blue-400" />
						<CardTitle className="text-blue-400">
							Identity & Philosophy
						</CardTitle>
					</div>
					<CardDescription className="text-slate-400">
						Define the evaluator's identity and grading approach
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label className="text-slate-200">Evaluator Name</Label>
						<Input
							value={localConfig.identity.evaluator_name}
							onChange={(e) =>
								updateSection("identity", {
									evaluator_name: e.target.value,
								})
							}
							placeholder="e.g., UPSC Standard Evaluator"
							className="border-blue-600/30 bg-slate-900 text-slate-100"
						/>
					</div>

					<div className="space-y-2">
						<Label className="text-slate-200">Evaluation Philosophy</Label>
						<Textarea
							value={localConfig.identity.evaluator_philosophy}
							onChange={(e) =>
								updateSection("identity", {
									evaluator_philosophy: e.target.value,
								})
							}
							placeholder="Describe the overall grading approach and principles..."
							rows={4}
							className="resize-none border-blue-600/30 bg-slate-900 text-slate-100"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Leniency Settings */}
			<Card className="border-blue-600/20 bg-slate-950">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertCircleIcon className="h-5 w-5 text-yellow-400" />
						<CardTitle className="text-blue-400">
							Leniency & Strictness
						</CardTitle>
					</div>
					<CardDescription className="text-slate-400">
						Control how strictly the evaluator grades answers
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-3">
						<Label className="text-slate-200">Global Leniency Level</Label>
						<Select
							value={localConfig.leniency.global_leniency_level}
							onValueChange={(value: LeniencyLevel) =>
								updateSection("leniency", {
									global_leniency_level: value,
								})
							}
						>
							<SelectTrigger className="border-blue-600/30 bg-slate-900 text-slate-100">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-blue-600/30 bg-slate-900">
								<SelectItem
									value="very_strict"
									className="text-slate-100 focus:bg-blue-600/20"
								>
									🔴 Very Strict - Minimal tolerance
								</SelectItem>
								<SelectItem
									value="strict"
									className="text-slate-100 focus:bg-blue-600/20"
								>
									🟠 Strict - Limited flexibility
								</SelectItem>
								<SelectItem
									value="balanced"
									className="text-slate-100 focus:bg-blue-600/20"
								>
									🟡 Balanced - Standard approach
								</SelectItem>
								<SelectItem
									value="lenient"
									className="text-slate-100 focus:bg-blue-600/20"
								>
									🟢 Lenient - More accommodating
								</SelectItem>
								<SelectItem
									value="very_lenient"
									className="text-slate-100 focus:bg-blue-600/20"
								>
									🔵 Very Lenient - Maximum flexibility
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label className="text-slate-200">Keyword Matching</Label>
								<Badge variant="secondary" className="bg-slate-800">
									{(
										localConfig.leniency.leniency_keyword_matching_threshold *
										100
									).toFixed(0)}
									%
								</Badge>
							</div>
							<Slider
								value={[
									localConfig.leniency.leniency_keyword_matching_threshold *
										100,
								]}
								onValueChange={([value]) =>
									updateSection("leniency", {
										leniency_keyword_matching_threshold: value / 100,
									})
								}
								min={0}
								max={100}
								step={5}
								className="py-4"
							/>
							<p className="text-muted-foreground text-xs">
								Higher values require closer keyword matches
							</p>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label className="text-slate-200">
									Spelling/Grammar Penalty
								</Label>
								<Badge variant="secondary" className="bg-slate-800">
									{
										localConfig.leniency
											.leniency_spelling_grammar_penalty_percent
									}
									%
								</Badge>
							</div>
							<Slider
								value={[
									localConfig.leniency
										.leniency_spelling_grammar_penalty_percent,
								]}
								onValueChange={([value]) =>
									updateSection("leniency", {
										leniency_spelling_grammar_penalty_percent: value,
									})
								}
								min={0}
								max={20}
								step={1}
								className="py-4"
							/>
							<p className="text-muted-foreground text-xs">
								Percentage penalty for spelling and grammar errors
							</p>
						</div>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-3">
							<Label className="text-slate-200">Paraphrasing Tolerance</Label>
							<Select
								value={localConfig.leniency.leniency_paraphrasing_tolerance}
								onValueChange={(value: ParaphrasingTolerance) =>
									updateSection("leniency", {
										leniency_paraphrasing_tolerance: value,
									})
								}
							>
								<SelectTrigger className="border-blue-600/30 bg-slate-900 text-slate-100">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-blue-600/30 bg-slate-900">
									<SelectItem
										value="none"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										None - Exact wording required
									</SelectItem>
									<SelectItem
										value="low"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Low - Minimal rewording
									</SelectItem>
									<SelectItem
										value="medium"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Medium - Moderate rewording
									</SelectItem>
									<SelectItem
										value="high"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										High - Flexible interpretation
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-3">
							<Label className="text-slate-200">
								Handwriting Interpretation
							</Label>
							<Select
								value={localConfig.leniency.leniency_handwriting_interpretation}
								onValueChange={(value: HandwritingInterpretation) =>
									updateSection("leniency", {
										leniency_handwriting_interpretation: value,
									})
								}
							>
								<SelectTrigger className="border-blue-600/30 bg-slate-900 text-slate-100">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-blue-600/30 bg-slate-900">
									<SelectItem
										value="strict"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Strict
									</SelectItem>
									<SelectItem
										value="moderate"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Moderate
									</SelectItem>
									<SelectItem
										value="lenient"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Lenient
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Partial Marking */}
			<Card className="border-blue-600/20 bg-slate-950">
				<CardHeader>
					<div className="flex items-center gap-2">
						<CheckCircleIcon className="h-5 w-5 text-green-400" />
						<CardTitle className="text-blue-400">Partial Marking</CardTitle>
					</div>
					<CardDescription className="text-slate-400">
						Configure partial credit for incomplete or partially correct answers
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between rounded-lg border border-blue-600/20 bg-slate-900 p-4">
						<div className="space-y-1">
							<Label className="text-slate-200">Enable Partial Marking</Label>
							<p className="text-muted-foreground text-xs">
								Award partial credit for incomplete answers
							</p>
						</div>
						<Switch
							checked={localConfig.partialMarking.partial_marking_enabled}
							onCheckedChange={(checked) =>
								updateSection("partialMarking", {
									partial_marking_enabled: checked,
								})
							}
						/>
					</div>

					{localConfig.partialMarking.partial_marking_enabled && (
						<>
							<div className="flex items-center justify-between rounded-lg border border-blue-600/20 bg-slate-900 p-4">
								<div className="space-y-1">
									<Label className="text-slate-200">
										Correct Method, Wrong Answer
									</Label>
									<p className="text-muted-foreground text-xs">
										Award marks when method is correct but answer is wrong
									</p>
								</div>
								<Switch
									checked={
										localConfig.partialMarking
											.partial_mark_for_correct_method_wrong_answer
									}
									onCheckedChange={(checked) =>
										updateSection("partialMarking", {
											partial_mark_for_correct_method_wrong_answer: checked,
										})
									}
								/>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<Label className="text-slate-200">
										Correct Method Percentage
									</Label>
									<Badge variant="secondary" className="bg-slate-800">
										{
											localConfig.partialMarking
												.partial_mark_for_correct_method_percentage
										}
										%
									</Badge>
								</div>
								<Slider
									value={[
										localConfig.partialMarking
											.partial_mark_for_correct_method_percentage,
									]}
									onValueChange={([value]) =>
										updateSection("partialMarking", {
											partial_mark_for_correct_method_percentage: value,
										})
									}
									min={0}
									max={100}
									step={5}
									className="py-4"
								/>
								<p className="text-muted-foreground text-xs">
									Percentage of marks awarded for correct method
								</p>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Feedback Settings */}
			<Card className="border-blue-600/20 bg-slate-950">
				<CardHeader>
					<div className="flex items-center gap-2">
						<MessageSquareIcon className="h-5 w-5 text-purple-400" />
						<CardTitle className="text-blue-400">Feedback Settings</CardTitle>
					</div>
					<CardDescription className="text-slate-400">
						Control the type and detail of feedback provided to students
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-3">
							<Label className="text-slate-200">Feedback Tone</Label>
							<Select
								value={localConfig.feedback.feedback_tone}
								onValueChange={(value: FeedbackTone) =>
									updateSection("feedback", {
										feedback_tone: value,
									})
								}
							>
								<SelectTrigger className="border-blue-600/30 bg-slate-900 text-slate-100">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-blue-600/30 bg-slate-900">
									<SelectItem
										value="strict"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										📋 Strict - Formal and direct
									</SelectItem>
									<SelectItem
										value="neutral"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										📝 Neutral - Balanced approach
									</SelectItem>
									<SelectItem
										value="encouraging"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										💪 Encouraging - Positive reinforcement
									</SelectItem>
									<SelectItem
										value="balanced"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										⚖️ Balanced - Mix of critique and praise
									</SelectItem>
									<SelectItem
										value="mentoring"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										🎓 Mentoring - Guidance focused
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-3">
							<Label className="text-slate-200">Feedback Detail Level</Label>
							<Select
								value={localConfig.feedback.feedback_verbosity}
								onValueChange={(value: FeedbackVerbosity) =>
									updateSection("feedback", {
										feedback_verbosity: value,
									})
								}
							>
								<SelectTrigger className="border-blue-600/30 bg-slate-900 text-slate-100">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-blue-600/30 bg-slate-900">
									<SelectItem
										value="minimal"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Minimal - Brief comments
									</SelectItem>
									<SelectItem
										value="concise"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Concise - Key points only
									</SelectItem>
									<SelectItem
										value="detailed"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Detailed - Thorough explanations
									</SelectItem>
									<SelectItem
										value="comprehensive"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Comprehensive - Maximum detail
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex items-center justify-between rounded-lg border border-blue-600/20 bg-slate-900 p-4">
						<div className="space-y-1">
							<Label className="text-slate-200">Include Improvement Tips</Label>
							<p className="text-muted-foreground text-xs">
								Provide actionable suggestions for improvement
							</p>
						</div>
						<Switch
							checked={localConfig.feedback.feedback_include_improvements}
							onCheckedChange={(checked) =>
								updateSection("feedback", {
									feedback_include_improvements: checked,
								})
							}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Summary Alert */}
			<Alert className="border-blue-600/20 bg-slate-950">
				<SparklesIcon className="h-4 w-4 text-blue-400" />
				<AlertTitle className="text-blue-400">Configuration Summary</AlertTitle>
				<AlertDescription className="text-slate-400">
					<div className="mt-2 space-y-1 text-sm">
						<p>
							• Leniency:{" "}
							<strong>{localConfig.leniency.global_leniency_level}</strong>
						</p>
						<p>
							• Partial Marking:{" "}
							<strong>
								{localConfig.partialMarking.partial_marking_enabled
									? "Enabled"
									: "Disabled"}
							</strong>
						</p>
						<p>
							• Feedback Tone:{" "}
							<strong>{localConfig.feedback.feedback_tone}</strong>
						</p>
					</div>
				</AlertDescription>
			</Alert>
		</div>
	);
}
