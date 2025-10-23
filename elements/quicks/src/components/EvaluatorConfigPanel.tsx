"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@gb/ui/components/ui/accordion";
import { Badge } from "@gb/ui/components/ui/badge";
import { Button } from "@gb/ui/components/ui/button";
import { Card, CardContent } from "@gb/ui/components/ui/card";
import { Input } from "@gb/ui/components/ui/input";
import { Label } from "@gb/ui/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@gb/ui/components/ui/select";
import { Separator } from "@gb/ui/components/ui/separator";
import { Slider } from "@gb/ui/components/ui/slider";
import { Switch } from "@gb/ui/components/ui/switch";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@gb/ui/components/ui/tabs";
import { Textarea } from "@gb/ui/components/ui/textarea";
import {
	AlertCircleIcon,
	CheckCircleIcon,
	InfoIcon,
	RotateCcwIcon,
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
			{/* Header with Quick Actions */}
			<div className="flex items-start justify-between">
				<div className="space-y-1">
					<h3 className="font-semibold text-2xl">Evaluator Configuration</h3>
					<p className="text-muted-foreground text-sm">
						Fine-tune how the AI evaluator grades answers. Use presets or
						customize each parameter.
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							const defaultConfig = createDefaultEvaluatorConfig();
							setLocalConfig(defaultConfig);
							onChange(defaultConfig);
						}}
					>
						<RotateCcwIcon className="mr-2 h-4 w-4" />
						Reset to Default
					</Button>
					<Button variant="outline" size="sm">
						<SparklesIcon className="mr-2 h-4 w-4" />
						Load Preset
					</Button>
				</div>
			</div>

			<Card className="border-2">
				<CardContent className="pt-6">
					<Tabs defaultValue="identity" className="w-full">
						<TabsList className="grid h-auto w-full grid-cols-5">
							<TabsTrigger value="identity" className="flex-col gap-1 py-2">
								<InfoIcon className="h-4 w-4" />
								<span className="text-xs">Identity</span>
							</TabsTrigger>
							<TabsTrigger value="leniency" className="flex-col gap-1 py-2">
								<AlertCircleIcon className="h-4 w-4" />
								<span className="text-xs">Leniency</span>
							</TabsTrigger>
							<TabsTrigger value="marking" className="flex-col gap-1 py-2">
								<CheckCircleIcon className="h-4 w-4" />
								<span className="text-xs">Marking</span>
							</TabsTrigger>
							<TabsTrigger value="feedback" className="flex-col gap-1 py-2">
								<InfoIcon className="h-4 w-4" />
								<span className="text-xs">Feedback</span>
							</TabsTrigger>
							<TabsTrigger value="advanced" className="flex-col gap-1 py-2">
								<SparklesIcon className="h-4 w-4" />
								<span className="text-xs">Advanced</span>
							</TabsTrigger>
						</TabsList>
						{/* Identity Tab */}
						<TabsContent value="identity" className="mt-6 space-y-6">
							<div className="rounded-lg border bg-muted/50 p-4">
								<div className="flex items-start gap-3">
									<InfoIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
									<div className="space-y-1">
										<p className="font-medium text-sm">About This Section</p>
										<p className="text-muted-foreground text-sm">
											Define the evaluator's identity and overall philosophy.
											This helps set the tone for how answers will be assessed.
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										Evaluator Name
										<Badge variant="secondary" className="text-xs">
											Required
										</Badge>
									</Label>
									<Input
										value={localConfig.identity.evaluator_name}
										onChange={(e) =>
											updateSection("identity", {
												evaluator_name: e.target.value,
											})
										}
										placeholder="e.g., UPSC Standard Evaluator"
										className="h-10"
									/>
									<p className="text-muted-foreground text-xs">
										Give your evaluator a descriptive name for easy
										identification.
									</p>
								</div>

								<Separator />

								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										Evaluation Philosophy
										<Badge variant="secondary" className="text-xs">
											Optional
										</Badge>
									</Label>
									<Textarea
										value={localConfig.identity.evaluator_philosophy}
										onChange={(e) =>
											updateSection("identity", {
												evaluator_philosophy: e.target.value,
											})
										}
										placeholder="Describe the overall grading approach, principles, and expectations..."
										rows={5}
										className="resize-none"
									/>
									<p className="text-muted-foreground text-xs">
										Explain the core principles that guide this evaluator's
										assessment strategy.
									</p>
								</div>
							</div>
						</TabsContent>
						{/* Leniency Tab */}
						<TabsContent value="leniency" className="mt-6 space-y-6">
							<div className="rounded-lg border bg-muted/50 p-4">
								<div className="flex items-start gap-3">
									<AlertCircleIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
									<div className="space-y-1">
										<p className="font-medium text-sm">Leniency Controls</p>
										<p className="text-muted-foreground text-sm">
											Adjust how strictly or leniently the evaluator grades
											answers. These settings affect interpretation, partial
											credit, and error tolerance.
										</p>
									</div>
								</div>
							</div>

							<Accordion type="multiple" className="w-full space-y-2">
								<AccordionItem
									value="global"
									className="rounded-lg border px-4"
								>
									<AccordionTrigger className="hover:no-underline">
										<div className="flex items-center gap-2">
											<span className="font-semibold">
												Global Leniency Settings
											</span>
											<Badge variant="outline" className="text-xs">
												Primary
											</Badge>
										</div>
									</AccordionTrigger>
									<AccordionContent className="space-y-4 pt-4 pb-4">
										<div className="space-y-2">
											<Label className="text-sm">Global Leniency Level</Label>
											<Select
												value={localConfig.leniency.global_leniency_level}
												onValueChange={(value: LeniencyLevel) =>
													updateSection("leniency", {
														global_leniency_level: value,
													})
												}
											>
												<SelectTrigger className="h-10">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="very_strict">
														🔴 Very Strict - Minimal tolerance
													</SelectItem>
													<SelectItem value="strict">
														🟠 Strict - Limited flexibility
													</SelectItem>
													<SelectItem value="balanced">
														🟡 Balanced - Standard approach
													</SelectItem>
													<SelectItem value="lenient">
														🟢 Lenient - More accommodating
													</SelectItem>
													<SelectItem value="very_lenient">
														🔵 Very Lenient - Maximum flexibility
													</SelectItem>
												</SelectContent>
											</Select>
											<p className="text-muted-foreground text-xs">
												Controls the overall strictness of evaluation across all
												criteria.
											</p>
										</div>

										<Separator />

										<div className="space-y-2">
											<Label className="text-sm">
												Keyword Matching Threshold
											</Label>
											<div className="flex items-center gap-3">
												<Input
													type="number"
													step="0.1"
													min="0"
													max="1"
													value={
														localConfig.leniency
															.leniency_keyword_matching_threshold
													}
													onChange={(e) =>
														updateSection("leniency", {
															leniency_keyword_matching_threshold:
																Number.parseFloat(e.target.value),
														})
													}
													className="h-10"
												/>
												<Badge variant="secondary">
													{(
														localConfig.leniency
															.leniency_keyword_matching_threshold * 100
													).toFixed(0)}
													%
												</Badge>
											</div>
											<p className="text-muted-foreground text-xs">
												Higher values require closer keyword matches (0.7 = 70%
												similarity required).
											</p>
										</div>

										<Separator />

										<div className="space-y-2">
											<Label className="text-sm">Paraphrasing Tolerance</Label>
											<Select
												value={
													localConfig.leniency.leniency_paraphrasing_tolerance
												}
												onValueChange={(value: ParaphrasingTolerance) =>
													updateSection("leniency", {
														leniency_paraphrasing_tolerance: value,
													})
												}
											>
												<SelectTrigger className="h-10">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="none">
														None - Exact wording required
													</SelectItem>
													<SelectItem value="low">
														Low - Minimal rewording
													</SelectItem>
													<SelectItem value="medium">
														Medium - Moderate rewording
													</SelectItem>
													<SelectItem value="high">
														High - Flexible interpretation
													</SelectItem>
												</SelectContent>
											</Select>
											<p className="text-muted-foreground text-xs">
												How much the student's wording can differ from the model
												answer.
											</p>
										</div>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem
									value="spelling"
									className="rounded-lg border px-4"
								>
									<AccordionTrigger className="hover:no-underline">
										<span className="font-semibold">
											Spelling & Grammar Tolerance
										</span>
									</AccordionTrigger>
									<AccordionContent className="space-y-4 pt-4 pb-4">
										<div className="space-y-2">
											<Label className="text-sm">
												Spelling/Grammar Penalty (%)
											</Label>
											<div className="flex items-center gap-3">
												<Input
													type="number"
													step="1"
													min="0"
													max="100"
													value={
														localConfig.leniency
															.leniency_spelling_grammar_penalty_percent
													}
													onChange={(e) =>
														updateSection("leniency", {
															leniency_spelling_grammar_penalty_percent:
																Number.parseInt(e.target.value, 10),
														})
													}
													className="h-10"
												/>
												<Badge variant="secondary">
													{
														localConfig.leniency
															.leniency_spelling_grammar_penalty_percent
													}
													%
												</Badge>
											</div>
											<p className="text-muted-foreground text-xs">
												Percentage penalty for spelling and grammar errors
											</p>
										</div>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem
									value="handwriting"
									className="rounded-lg border px-4"
								>
									<AccordionTrigger className="hover:no-underline">
										<span className="font-semibold">
											Handwriting Interpretation
										</span>
									</AccordionTrigger>
									<AccordionContent className="space-y-4 pt-4 pb-4">
										<div className="space-y-2">
											<Label className="text-sm">Interpretation Level</Label>
											<Select
												value={
													localConfig.leniency
														.leniency_handwriting_interpretation
												}
												onValueChange={(value) =>
													updateSection("leniency", {
														leniency_handwriting_interpretation:
															value as HandwritingInterpretation,
													})
												}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="strict">Strict</SelectItem>
													<SelectItem value="moderate">Moderate</SelectItem>
													<SelectItem value="lenient">Lenient</SelectItem>
												</SelectContent>
											</Select>
											<p className="text-muted-foreground text-xs">
												How strictly to interpret handwritten text
											</p>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</TabsContent>{" "}
						{/* Marking Tab */}
						<TabsContent value="marking" className="mt-6 space-y-6">
							<div className="rounded-lg border bg-muted/50 p-4">
								<div className="flex items-start gap-3">
									<CheckCircleIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
									<div className="space-y-1">
										<p className="font-medium text-sm">Marking Scheme</p>
										<p className="text-muted-foreground text-sm">
											Configure how marks are calculated, distributed, and
											rounded for this evaluation.
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<Label className="text-sm">Enable Partial Marking</Label>
										<p className="text-muted-foreground text-xs">
											Award partial credit for incomplete or partially correct
											answers
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

								<div className="flex items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<Label className="text-sm">
											Partial Mark for Correct Method
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

								<Separator />

								<div className="space-y-2">
									<Label className="text-sm">Correct Method Percentage</Label>
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
										Percentage of marks awarded for correct method (
										{
											localConfig.partialMarking
												.partial_mark_for_correct_method_percentage
										}
										%)
									</p>
								</div>
							</div>
						</TabsContent>
						{/* Feedback Tab */}
						<TabsContent value="feedback" className="mt-6 space-y-6">
							<div className="rounded-lg border bg-muted/50 p-4">
								<div className="flex items-start gap-3">
									<InfoIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
									<div className="space-y-1">
										<p className="font-medium text-sm">Feedback Settings</p>
										<p className="text-muted-foreground text-sm">
											Control how detailed and what type of feedback students
											receive.
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div className="space-y-2">
									<Label className="text-sm">Feedback Tone</Label>
									<Select
										value={localConfig.feedback.feedback_tone}
										onValueChange={(value: FeedbackTone) =>
											updateSection("feedback", {
												feedback_tone: value,
											})
										}
									>
										<SelectTrigger className="h-10">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="strict">
												📋 Strict - Formal and direct
											</SelectItem>
											<SelectItem value="neutral">
												📝 Neutral - Balanced approach
											</SelectItem>
											<SelectItem value="encouraging">
												💪 Encouraging - Positive reinforcement
											</SelectItem>
											<SelectItem value="balanced">
												⚖️ Balanced - Mix of critique and praise
											</SelectItem>
											<SelectItem value="mentoring">
												🎓 Mentoring - Guidance focused
											</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-muted-foreground text-xs">
										The overall tone of feedback provided to students.
									</p>
								</div>

								<Separator />

								<div className="space-y-2">
									<Label className="text-sm">Feedback Verbosity</Label>
									<Select
										value={localConfig.feedback.feedback_verbosity}
										onValueChange={(value: FeedbackVerbosity) =>
											updateSection("feedback", {
												feedback_verbosity: value,
											})
										}
									>
										<SelectTrigger className="h-10">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="minimal">
												Minimal - Brief comments
											</SelectItem>
											<SelectItem value="concise">
												Concise - Key points only
											</SelectItem>
											<SelectItem value="detailed">
												Detailed - Thorough explanations
											</SelectItem>
											<SelectItem value="comprehensive">
												Comprehensive - Maximum detail
											</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-muted-foreground text-xs">
										How detailed the feedback should be.
									</p>
								</div>

								<Separator />

								<div className="flex items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<Label className="text-sm">Include Improvement Tips</Label>
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
							</div>
						</TabsContent>
						{/* Advanced Tab */}
						<TabsContent value="advanced" className="mt-6 space-y-6">
							<div className="rounded-lg border bg-muted/50 p-4">
								<div className="flex items-start gap-3">
									<SparklesIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
									<div className="space-y-1">
										<p className="font-medium text-sm">Advanced Settings</p>
										<p className="text-muted-foreground text-sm">
											Fine-tune specialized evaluation parameters. Use the
											Identity tab to customize evaluation philosophy and
											instructions.
										</p>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
