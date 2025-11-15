"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@gb/ui/src/components/ui/accordion";
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
	SaveIcon,
	SlidersIcon,
	SparklesIcon,
} from "lucide-react";
import { useState } from "react";
import {
	createDefaultEvaluatorConfigV3,
	type EvaluatorConfigurationV3,
	type FeedbackTone,
	type FeedbackVerbosity,
	type LeniencyLevel,
} from "../types/evaluator-config-v3";

interface EvaluatorConfigPanelV3Props {
	onConfigSelected?: (config: EvaluatorConfigurationV3) => void;
	initialConfigId?: string;
	onSave?: () => Promise<void>;
}

const TEMPLATE_CONFIGS = {
	standard: {
		name: "Standard Evaluation",
		description: "Balanced approach suitable for most academic assessments",
		icon: "📋",
		leniency: "moderate" as LeniencyLevel,
		tone: "professional" as FeedbackTone,
		verbosity: "moderate" as FeedbackVerbosity,
	},
	strict: {
		name: "Strict Evaluation",
		description: "High standards with minimal tolerance for errors",
		icon: "🔴",
		leniency: "strict" as LeniencyLevel,
		tone: "strict" as FeedbackTone,
		verbosity: "detailed" as FeedbackVerbosity,
	},
	lenient: {
		name: "Lenient Evaluation",
		description: "More forgiving approach with focus on encouragement",
		icon: "🟢",
		leniency: "lenient" as LeniencyLevel,
		tone: "encouraging" as FeedbackTone,
		verbosity: "concise" as FeedbackVerbosity,
	},
	competitive: {
		name: "Competitive Exam",
		description: "Optimized for UPSC, JEE, NEET style evaluations",
		icon: "🎯",
		leniency: "strict" as LeniencyLevel,
		tone: "professional" as FeedbackTone,
		verbosity: "comprehensive" as FeedbackVerbosity,
	},
};

export function EvaluatorConfigPanelV3({
	onConfigSelected,
	onSave,
}: EvaluatorConfigPanelV3Props) {
	const [selectedTemplate, setSelectedTemplate] = useState<
		keyof typeof TEMPLATE_CONFIGS | null
	>("standard");
	const [localConfig, setLocalConfig] = useState<EvaluatorConfigurationV3>(
		createDefaultEvaluatorConfigV3("Standard Evaluation", "General"),
	);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const selectTemplate = (templateKey: keyof typeof TEMPLATE_CONFIGS) => {
		setSelectedTemplate(templateKey);
		const template = TEMPLATE_CONFIGS[templateKey];
		const config = createDefaultEvaluatorConfigV3(template.name, "General");

		// Apply template-specific configurations
		config.leniency_strictness.leniency_level = template.leniency;
		config.feedback_preferences.feedback_tone = template.tone;
		config.feedback_preferences.feedback_verbosity = template.verbosity;

		// Apply improved default values
		config.scoring_methodology.rounding_policy = "round_nearest";
		config.scoring_methodology.decimal_precision = 2;
		config.scoring_methodology.grace_marks_enabled = false;
		config.scoring_methodology.grace_marks_threshold = 0;
		config.scoring_methodology.allow_negative_marking = false;
		config.scoring_methodology.scoring_scheme_default = "decimal";
		config.scoring_methodology.negative_mark_value_mcq = 0;
		config.scoring_methodology.negative_marking_policy = "none";

		config.leniency_strictness.leniency_formatting_penalty = 5;
		config.leniency_strictness.allow_alternative_approaches = true;
		config.leniency_strictness.leniency_unit_mismatch_penalty = 10;
		config.leniency_strictness.strictness_require_working_shown = false;
		config.leniency_strictness.working_required_penalty_percent = 20;
		config.leniency_strictness.leniency_keyword_matching_threshold = 0.7;
		config.leniency_strictness.leniency_numerical_precision_margin = 0.05;
		config.leniency_strictness.strictness_conceptual_error_penalty = 50;
		config.leniency_strictness.allow_partial_marks_for_wrong_method = true;
		config.leniency_strictness.leniency_spelling_grammar_penalty_percent = 5;

		config.partial_marking_rules.concept_coverage_weight = 0.6;
		config.partial_marking_rules.partial_marking_enabled = true;
		config.partial_marking_rules.partial_mark_minimum_award = 0.5;
		config.partial_marking_rules.deduction_for_missing_units = 0.5;
		config.partial_marking_rules.deduction_per_grammar_error = 0.25;
		config.partial_marking_rules.max_grammar_error_deduction = 2;
		config.partial_marking_rules.deduction_per_spelling_error = 0.25;
		config.partial_marking_rules.max_spelling_error_deduction = 2;
		config.partial_marking_rules.deduction_for_incorrect_units = 0.5;
		config.partial_marking_rules.partial_mark_for_partial_steps = 30;
		config.partial_marking_rules.step_by_step_evaluation_enabled = true;
		config.partial_marking_rules.partial_mark_keyword_hit_threshold = 0.6;
		config.partial_marking_rules.keyword_hit_percentage_for_full_marks = 80;
		config.partial_marking_rules.partial_mark_for_correct_method_wrong_answer = 50;

		config.feedback_preferences.feedback_language = "English";
		config.feedback_preferences.feedback_granularity = "per_question";
		config.feedback_preferences.feedback_reading_level = "high_school";
		config.feedback_preferences.feedback_suggestion_style = "guiding_question";
		config.feedback_preferences.feedback_include_mark_breakdown = true;
		config.feedback_preferences.feedback_compare_to_model_answer = false;
		config.feedback_preferences.feedback_include_positive_points = true;
		config.feedback_preferences.feedback_personalization_enabled = false;
		config.feedback_preferences.feedback_include_improvement_tips = true;
		config.feedback_preferences.feedback_highlight_common_mistakes = true;

		config.annotation_preferences.annotation_style = "moderate";
		config.annotation_preferences.annotation_enabled = true;
		config.annotation_preferences.annotation_symbol_set = "standard";
		config.annotation_preferences.annotation_use_crosses = true;
		config.annotation_preferences.annotation_use_checkmarks = true;
		config.annotation_preferences.annotation_use_highlights = true;
		config.annotation_preferences.annotation_use_underlines = true;
		config.annotation_preferences.annotation_use_margin_notes = true;
		config.annotation_preferences.annotation_show_scores_inline = true;
		config.annotation_preferences.annotation_use_strikethroughs = false;
		config.annotation_preferences.annotation_highlight_correct_color =
			"#00FF00";
		config.annotation_preferences.annotation_highlight_partial_color =
			"#FFA500";
		config.annotation_preferences.annotation_highlight_incorrect_color =
			"#FF0000";

		config.consistency_fairness.anonymize_evaluation = true;
		config.consistency_fairness.bias_detection_enabled = true;
		config.consistency_fairness.consistency_check_enabled = true;
		config.consistency_fairness.consistency_similarity_threshold = 0.85;
		config.consistency_fairness.cross_question_consistency_check = true;

		config.subject_specific_rules.subject_math_formula_weight = 0.4;
		config.subject_specific_rules.subject_math_calculation_weight = 0.6;

		config.question_type_rules.question_type_numerical_precision_digits = 2;

		config.quality_metrics.consistency_threshold = 0.85;
		config.quality_metrics.explainability_required = true;
		config.quality_metrics.speed_multiplier_target = 10;
		config.quality_metrics.confidence_score_display = true;
		config.quality_metrics.accuracy_target_margin_percent = 5;

		setLocalConfig(config);
	};
	const updateSection = <T extends keyof EvaluatorConfigurationV3>(
		section: T,
		updates: Partial<EvaluatorConfigurationV3[T]>,
	) => {
		setLocalConfig({
			...localConfig,
			[section]: { ...(localConfig[section] as object), ...updates },
		});
	};

	const handleSaveConfig = async () => {
		setIsSaving(true);
		setError(null);
		setSuccess(null);

		try {
			const simplifiedConfig = {
				config_name: localConfig.config_name,
				subject: localConfig.identity.subject,
				scoring_methodology: {
					rounding_policy: localConfig.scoring_methodology.rounding_policy,
					decimal_precision: localConfig.scoring_methodology.decimal_precision,
					grace_marks_enabled:
						localConfig.scoring_methodology.grace_marks_enabled,
					grace_marks_threshold:
						localConfig.scoring_methodology.grace_marks_threshold,
					allow_negative_marking:
						localConfig.scoring_methodology.allow_negative_marking,
					scoring_scheme_default:
						localConfig.scoring_methodology.scoring_scheme_default,
					negative_mark_value_mcq:
						localConfig.scoring_methodology.negative_mark_value_mcq,
					negative_marking_policy:
						localConfig.scoring_methodology.negative_marking_policy,
				},
				leniency_strictness: {
					leniency_level: localConfig.leniency_strictness.leniency_level,
					leniency_formatting_penalty:
						localConfig.leniency_strictness.leniency_formatting_penalty,
					allow_alternative_approaches:
						localConfig.leniency_strictness.allow_alternative_approaches,
					leniency_unit_mismatch_penalty:
						localConfig.leniency_strictness.leniency_unit_mismatch_penalty,
					strictness_require_working_shown:
						localConfig.leniency_strictness.strictness_require_working_shown,
					working_required_penalty_percent:
						localConfig.leniency_strictness.working_required_penalty_percent,
					leniency_keyword_matching_threshold:
						localConfig.leniency_strictness.leniency_keyword_matching_threshold,
					leniency_numerical_precision_margin:
						localConfig.leniency_strictness.leniency_numerical_precision_margin,
					strictness_conceptual_error_penalty:
						localConfig.leniency_strictness.strictness_conceptual_error_penalty,
					allow_partial_marks_for_wrong_method:
						localConfig.leniency_strictness
							.allow_partial_marks_for_wrong_method,
					leniency_spelling_grammar_penalty_percent:
						localConfig.leniency_strictness
							.leniency_spelling_grammar_penalty_percent,
				},
				partial_marking_rules: {
					concept_coverage_weight:
						localConfig.partial_marking_rules.concept_coverage_weight,
					partial_marking_enabled:
						localConfig.partial_marking_rules.partial_marking_enabled,
					partial_mark_minimum_award:
						localConfig.partial_marking_rules.partial_mark_minimum_award,
					deduction_for_missing_units:
						localConfig.partial_marking_rules.deduction_for_missing_units,
					deduction_per_grammar_error:
						localConfig.partial_marking_rules.deduction_per_grammar_error,
					max_grammar_error_deduction:
						localConfig.partial_marking_rules.max_grammar_error_deduction,
					deduction_per_spelling_error:
						localConfig.partial_marking_rules.deduction_per_spelling_error,
					max_spelling_error_deduction:
						localConfig.partial_marking_rules.max_spelling_error_deduction,
					deduction_for_incorrect_units:
						localConfig.partial_marking_rules.deduction_for_incorrect_units,
					partial_mark_for_partial_steps:
						localConfig.partial_marking_rules.partial_mark_for_partial_steps,
					step_by_step_evaluation_enabled:
						localConfig.partial_marking_rules.step_by_step_evaluation_enabled,
					partial_mark_keyword_hit_threshold:
						localConfig.partial_marking_rules
							.partial_mark_keyword_hit_threshold,
					keyword_hit_percentage_for_full_marks:
						localConfig.partial_marking_rules
							.keyword_hit_percentage_for_full_marks,
					partial_mark_for_correct_method_wrong_answer:
						localConfig.partial_marking_rules
							.partial_mark_for_correct_method_wrong_answer,
				},
				feedback_preferences: {
					feedback_tone: localConfig.feedback_preferences.feedback_tone,
					feedback_enabled: true,
					feedback_language: localConfig.feedback_preferences.feedback_language,
					feedback_verbosity:
						localConfig.feedback_preferences.feedback_verbosity,
					feedback_granularity:
						localConfig.feedback_preferences.feedback_granularity,
					feedback_reading_level:
						localConfig.feedback_preferences.feedback_reading_level,
					feedback_suggestion_style:
						localConfig.feedback_preferences.feedback_suggestion_style,
					feedback_include_mark_breakdown:
						localConfig.feedback_preferences.feedback_include_mark_breakdown,
					feedback_compare_to_model_answer:
						localConfig.feedback_preferences.feedback_compare_to_model_answer,
					feedback_include_positive_points:
						localConfig.feedback_preferences.feedback_include_positive_points,
					feedback_personalization_enabled:
						localConfig.feedback_preferences.feedback_personalization_enabled,
					feedback_include_improvement_tips:
						localConfig.feedback_preferences.feedback_include_improvement_tips,
					feedback_highlight_common_mistakes:
						localConfig.feedback_preferences.feedback_highlight_common_mistakes,
				},
				annotation_preferences: {
					annotation_style: localConfig.annotation_preferences.annotation_style,
					annotation_enabled:
						localConfig.annotation_preferences.annotation_enabled,
					annotation_symbol_set:
						localConfig.annotation_preferences.annotation_symbol_set,
					annotation_use_crosses:
						localConfig.annotation_preferences.annotation_use_crosses,
					annotation_use_checkmarks:
						localConfig.annotation_preferences.annotation_use_checkmarks,
					annotation_use_highlights:
						localConfig.annotation_preferences.annotation_use_highlights,
					annotation_use_underlines:
						localConfig.annotation_preferences.annotation_use_underlines,
					annotation_use_margin_notes:
						localConfig.annotation_preferences.annotation_use_margin_notes,
					annotation_highlight_correct: true,
					annotation_highlight_partial: true,
					annotation_show_scores_inline:
						localConfig.annotation_preferences.annotation_show_scores_inline,
					annotation_use_strikethroughs:
						localConfig.annotation_preferences.annotation_use_strikethroughs,
					annotation_highlight_incorrect: true,
					annotation_highlight_correct_color:
						localConfig.annotation_preferences
							.annotation_highlight_correct_color,
					annotation_highlight_partial_color:
						localConfig.annotation_preferences
							.annotation_highlight_partial_color,
					annotation_highlight_incorrect_color:
						localConfig.annotation_preferences
							.annotation_highlight_incorrect_color,
				},
				consistency_fairness: {
					anonymize_evaluation:
						localConfig.consistency_fairness.anonymize_evaluation,
					bias_detection_enabled:
						localConfig.consistency_fairness.bias_detection_enabled,
					consistency_check_enabled:
						localConfig.consistency_fairness.consistency_check_enabled,
					consistency_similarity_threshold:
						localConfig.consistency_fairness.consistency_similarity_threshold,
					cross_question_consistency_check:
						localConfig.consistency_fairness.cross_question_consistency_check,
				},
				subject_specific_rules: {
					subject_math_require_units: false,
					subject_math_formula_weight:
						localConfig.subject_specific_rules.subject_math_formula_weight,
					subject_math_calculation_weight:
						localConfig.subject_specific_rules.subject_math_calculation_weight,
					subject_math_allow_alternate_methods: true,
				},
				question_type_rules: {
					question_type_mcq_partial_credit: false,
					question_type_numerical_tolerance: 0.01,
					question_type_mcq_negative_marking:
						localConfig.scoring_methodology.allow_negative_marking,
					question_type_numerical_precision_digits:
						localConfig.question_type_rules
							.question_type_numerical_precision_digits,
				},
				quality_metrics: {
					consistency_threshold:
						localConfig.quality_metrics.consistency_threshold,
					explainability_required:
						localConfig.quality_metrics.explainability_required,
					speed_multiplier_target:
						localConfig.quality_metrics.speed_multiplier_target,
					confidence_score_display:
						localConfig.quality_metrics.confidence_score_display,
					accuracy_target_margin_percent:
						localConfig.quality_metrics.accuracy_target_margin_percent,
				},
			};

			const response = await fetch(
				"http://localhost:8083/grade/v1/evaluator-configurations",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(simplifiedConfig),
				},
			);

			if (!response.ok) {
				throw new Error(`API Error: ${response.status}`);
			}

			const result = await response.json();

			if (result.success && result.data) {
				setSuccess("Configuration saved successfully!");
				onConfigSelected?.(result.data);
				if (onSave) await onSave();

				// Clear success message after 5 seconds
				setTimeout(() => setSuccess(null), 5000);
			} else {
				throw new Error(
					result.error?.message || "Failed to save configuration",
				);
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to save configuration",
			);
		} finally {
			setIsSaving(false);
		}
	};

	if (onSave && typeof window !== "undefined") {
		(
			window as unknown as { __evaluatorConfigSave?: () => Promise<void> }
		).__evaluatorConfigSave = handleSaveConfig;
	}

	return (
		<div className="space-y-6">
			<Card className="border-blue-600/20 bg-slate-950">
				<CardHeader>
					<div className="flex items-center justify-between">
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
							onClick={handleSaveConfig}
							disabled={isSaving}
							className="bg-blue-600 hover:bg-blue-700"
						>
							<SaveIcon className="mr-2 h-4 w-4" />
							{isSaving ? "Saving..." : "Save Configuration"}
						</Button>
					</div>
				</CardHeader>
			</Card>
			{error && (
				<Alert className="border-red-500/30 bg-red-950/20">
					<AlertCircleIcon className="h-5 w-5 text-red-400" />
					<AlertTitle className="font-semibold text-lg text-red-300">
						Error
					</AlertTitle>
					<AlertDescription className="text-red-200">{error}</AlertDescription>
				</Alert>
			)}
			{success && (
				<Alert className="border-green-500/30 bg-green-950/20">
					<CheckCircleIcon className="h-5 w-5 text-green-400" />
					<AlertTitle className="font-semibold text-green-300 text-lg">
						Success
					</AlertTitle>
					<AlertDescription className="text-green-200">
						{success}
					</AlertDescription>
				</Alert>
			)}{" "}
			<Card className="border-blue-600/20 bg-slate-950">
				<CardHeader>
					<div className="flex items-center gap-2">
						<SparklesIcon className="h-5 w-5 text-blue-400" />
						<CardTitle className="text-blue-400">Choose Template</CardTitle>
					</div>
					<CardDescription className="text-slate-400">
						Select a starting template for your evaluation
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-3 md:grid-cols-4">
						{Object.entries(TEMPLATE_CONFIGS).map(([key, template]) => (
							<Card
								key={key}
								className={`cursor-pointer border-2 transition-all ${
									selectedTemplate === key
										? "border-blue-500 bg-blue-950/30 shadow-blue-500/20 shadow-lg"
										: "border-blue-600/20 bg-slate-900 hover:border-blue-500/50"
								}`}
								onClick={() =>
									selectTemplate(key as keyof typeof TEMPLATE_CONFIGS)
								}
							>
								<CardContent className="p-4">
									<div className="mb-2 flex items-center justify-between">
										<span className="text-2xl">{template.icon}</span>
										{selectedTemplate === key && (
											<CheckCircleIcon className="h-4 w-4 text-blue-400" />
										)}
									</div>
									<h4 className="mb-1 font-semibold text-blue-400 text-sm">
										{template.name}
									</h4>
									<p className="mb-2 text-slate-400 text-xs">
										{template.description}
									</p>
									<Badge
										variant="outline"
										className="border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs"
									>
										{template.leniency}
									</Badge>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>
			<Accordion
				type="multiple"
				defaultValue={["identity", "scoring", "leniency"]}
				className="space-y-3"
			>
				<AccordionItem
					value="identity"
					className="overflow-hidden rounded-lg border border-blue-600/20 bg-gradient-to-br from-slate-950/80 to-slate-900/50 backdrop-blur-sm"
				>
					<AccordionTrigger className="px-6 transition-all hover:bg-slate-900/30 hover:no-underline">
						<div className="flex items-center gap-2">
							<InfoIcon className="h-5 w-5 text-blue-400" />
							<span className="font-semibold text-blue-400">
								Identity & Philosophy
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="space-y-4 px-6 pb-6">
						<div className="space-y-2">
							<Label className="text-slate-200">Configuration Name</Label>
							<Input
								value={localConfig.config_name}
								onChange={(e) =>
									setLocalConfig({
										...localConfig,
										config_name: e.target.value,
									})
								}
								placeholder="e.g., UPSC Standard Evaluator"
								className="border-blue-600/30 bg-slate-900 text-slate-100"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-slate-200">Subject</Label>
							<Input
								value={localConfig.identity.subject}
								onChange={(e) =>
									updateSection("identity", {
										subject: e.target.value,
									})
								}
								placeholder="e.g., Mathematics, History, Science"
								className="border-blue-600/30 bg-slate-900 text-slate-100"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-slate-200">Exam Type</Label>
							<Input
								value={localConfig.identity.exam_type}
								onChange={(e) =>
									updateSection("identity", {
										exam_type: e.target.value,
									})
								}
								placeholder="e.g., High School Final, College Midterm"
								className="border-blue-600/30 bg-slate-900 text-slate-100"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-slate-200">Grading Philosophy</Label>
							<Textarea
								value={localConfig.identity.grading_philosophy}
								onChange={(e) =>
									updateSection("identity", {
										grading_philosophy: e.target.value,
									})
								}
								placeholder="Describe the overall grading approach and principles..."
								rows={4}
								className="resize-none border-blue-600/30 bg-slate-900 text-slate-100"
							/>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem
					value="scoring"
					className="overflow-hidden rounded-lg border border-blue-600/20 bg-gradient-to-br from-slate-950/80 to-slate-900/50 backdrop-blur-sm"
				>
					<AccordionTrigger className="px-6 transition-all hover:bg-slate-900/30 hover:no-underline">
						<div className="flex items-center gap-2">
							<SlidersIcon className="h-5 w-5 text-blue-400" />
							<span className="font-semibold text-blue-400">
								Scoring Methodology
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="space-y-6 px-6 pb-6">
						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-3">
								<Label className="text-slate-200">Scoring Scheme</Label>
								<Select
									value={localConfig.scoring_methodology.scoring_scheme_default}
									onValueChange={(value: "integer" | "decimal") =>
										updateSection("scoring_methodology", {
											scoring_scheme_default: value,
										})
									}
								>
									<SelectTrigger className="border-blue-600/30 bg-slate-900 text-slate-100">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="border-blue-600/30 bg-slate-900">
										<SelectItem
											value="integer"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Integer
										</SelectItem>
										<SelectItem
											value="decimal"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Decimal
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-3">
								<Label className="text-slate-200">Decimal Precision</Label>
								<Select
									value={localConfig.scoring_methodology.decimal_precision.toString()}
									onValueChange={(value) =>
										updateSection("scoring_methodology", {
											decimal_precision: parseInt(value, 10),
										})
									}
								>
									<SelectTrigger className="border-blue-600/30 bg-slate-900 text-slate-100">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="border-blue-600/30 bg-slate-900">
										<SelectItem
											value="0"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											0
										</SelectItem>
										<SelectItem
											value="1"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											1
										</SelectItem>
										<SelectItem
											value="2"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											2
										</SelectItem>
										<SelectItem
											value="3"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											3
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-3">
								<Label className="text-slate-200">Rounding Policy</Label>
								<Select
									value={localConfig.scoring_methodology.rounding_policy}
									onValueChange={(value) =>
										updateSection("scoring_methodology", {
											rounding_policy: value,
										})
									}
								>
									<SelectTrigger className="border-blue-600/30 bg-slate-900 text-slate-100">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="border-blue-600/30 bg-slate-900">
										<SelectItem
											value="round_up"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Round Up
										</SelectItem>
										<SelectItem
											value="round_down"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Round Down
										</SelectItem>
										<SelectItem
											value="round_nearest"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Round Nearest
										</SelectItem>
										<SelectItem
											value="no_rounding"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											No Rounding
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-3">
								<Label className="text-slate-200">
									Negative Marking Policy
								</Label>
								<Select
									value={
										localConfig.scoring_methodology.negative_marking_policy
									}
									onValueChange={(value) =>
										updateSection("scoring_methodology", {
											negative_marking_policy: value,
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
											None
										</SelectItem>
										<SelectItem
											value="per_question"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Per Question
										</SelectItem>
										<SelectItem
											value="per_option"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Per Option
										</SelectItem>
										<SelectItem
											value="custom"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Custom
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg border border-blue-600/20 bg-slate-900 p-4">
							<div className="space-y-1">
								<Label className="text-slate-200">Allow Negative Marking</Label>
								<p className="text-muted-foreground text-xs">
									Deduct marks for incorrect answers
								</p>
							</div>
							<Switch
								checked={localConfig.scoring_methodology.allow_negative_marking}
								onCheckedChange={(checked) =>
									updateSection("scoring_methodology", {
										allow_negative_marking: checked,
									})
								}
							/>
						</div>

						<div className="flex items-center justify-between rounded-lg border border-blue-600/20 bg-slate-900 p-4">
							<div className="space-y-1">
								<Label className="text-slate-200">Grace Marks Enabled</Label>
								<p className="text-muted-foreground text-xs">
									Allow awarding grace marks
								</p>
							</div>
							<Switch
								checked={localConfig.scoring_methodology.grace_marks_enabled}
								onCheckedChange={(checked) =>
									updateSection("scoring_methodology", {
										grace_marks_enabled: checked,
									})
								}
							/>
						</div>

						{localConfig.scoring_methodology.grace_marks_enabled && (
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<Label className="text-slate-200">
										Grace Marks Threshold
									</Label>
									<Badge variant="secondary" className="bg-slate-800">
										{localConfig.scoring_methodology.grace_marks_threshold}
									</Badge>
								</div>
								<Slider
									value={[
										localConfig.scoring_methodology.grace_marks_threshold,
									]}
									onValueChange={([value]) =>
										updateSection("scoring_methodology", {
											grace_marks_threshold: value,
										})
									}
									min={0}
									max={5}
									step={0.5}
									className="py-4"
								/>
							</div>
						)}
					</AccordionContent>
				</AccordionItem>

				<AccordionItem
					value="leniency"
					className="rounded-lg border border-blue-600/20 bg-slate-950 px-6"
				>
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<AlertCircleIcon className="h-5 w-5 text-yellow-400" />
							<span className="font-semibold text-blue-400">
								Leniency & Strictness
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="space-y-6 pt-4">
						<div className="space-y-3">
							<Label className="text-slate-200">Global Leniency Level</Label>
							<Select
								value={localConfig.leniency_strictness.leniency_level}
								onValueChange={(value: LeniencyLevel) =>
									updateSection("leniency_strictness", {
										leniency_level: value,
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
										🔴 Very Strict
									</SelectItem>
									<SelectItem
										value="strict"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										🟠 Strict
									</SelectItem>
									<SelectItem
										value="moderate"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										🟡 Moderate
									</SelectItem>
									<SelectItem
										value="lenient"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										🟢 Lenient
									</SelectItem>
									<SelectItem
										value="very_lenient"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										🔵 Very Lenient
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
											localConfig.leniency_strictness
												.leniency_keyword_matching_threshold * 100
										).toFixed(0)}
										%
									</Badge>
								</div>
								<Slider
									value={[
										localConfig.leniency_strictness
											.leniency_keyword_matching_threshold * 100,
									]}
									onValueChange={([value]) =>
										updateSection("leniency_strictness", {
											leniency_keyword_matching_threshold: value / 100,
										})
									}
									min={0}
									max={100}
									step={5}
									className="py-4"
								/>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<Label className="text-slate-200">
										Spelling/Grammar Penalty
									</Label>
									<Badge variant="secondary" className="bg-slate-800">
										{
											localConfig.leniency_strictness
												.leniency_spelling_grammar_penalty_percent
										}
										%
									</Badge>
								</div>
								<Slider
									value={[
										localConfig.leniency_strictness
											.leniency_spelling_grammar_penalty_percent,
									]}
									onValueChange={([value]) =>
										updateSection("leniency_strictness", {
											leniency_spelling_grammar_penalty_percent: value,
										})
									}
									min={0}
									max={20}
									step={1}
									className="py-4"
								/>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem
					value="partial"
					className="rounded-lg border border-blue-600/20 bg-slate-950 px-6"
				>
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<CheckCircleIcon className="h-5 w-5 text-green-400" />
							<span className="font-semibold text-blue-400">
								Partial Marking
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="space-y-6 pt-4">
						<div className="flex items-center justify-between rounded-lg border border-blue-600/20 bg-slate-900 p-4">
							<div className="space-y-1">
								<Label className="text-slate-200">Enable Partial Marking</Label>
								<p className="text-muted-foreground text-xs">
									Award partial credit for incomplete answers
								</p>
							</div>
							<Switch
								checked={
									localConfig.partial_marking_rules.partial_marking_enabled
								}
								onCheckedChange={(checked) =>
									updateSection("partial_marking_rules", {
										partial_marking_enabled: checked,
									})
								}
							/>
						</div>

						{localConfig.partial_marking_rules.partial_marking_enabled && (
							<>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Label className="text-slate-200">
											Correct Method, Wrong Answer
										</Label>
										<Badge variant="secondary" className="bg-slate-800">
											{
												localConfig.partial_marking_rules
													.partial_mark_for_correct_method_wrong_answer
											}
											%
										</Badge>
									</div>
									<Slider
										value={[
											localConfig.partial_marking_rules
												.partial_mark_for_correct_method_wrong_answer,
										]}
										onValueChange={([value]) =>
											updateSection("partial_marking_rules", {
												partial_mark_for_correct_method_wrong_answer: value,
											})
										}
										min={0}
										max={100}
										step={5}
										className="py-4"
									/>
								</div>

								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Label className="text-slate-200">
											Partial Steps Percentage
										</Label>
										<Badge variant="secondary" className="bg-slate-800">
											{
												localConfig.partial_marking_rules
													.partial_mark_for_partial_steps
											}
											%
										</Badge>
									</div>
									<Slider
										value={[
											localConfig.partial_marking_rules
												.partial_mark_for_partial_steps,
										]}
										onValueChange={([value]) =>
											updateSection("partial_marking_rules", {
												partial_mark_for_partial_steps: value,
											})
										}
										min={0}
										max={100}
										step={5}
										className="py-4"
									/>
								</div>
							</>
						)}
					</AccordionContent>
				</AccordionItem>

				<AccordionItem
					value="feedback"
					className="rounded-lg border border-blue-600/20 bg-slate-950 px-6"
				>
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<MessageSquareIcon className="h-5 w-5 text-purple-400" />
							<span className="font-semibold text-blue-400">
								Feedback Settings
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="space-y-6 pt-4">
						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-3">
								<Label className="text-slate-200">Feedback Tone</Label>
								<Select
									value={localConfig.feedback_preferences.feedback_tone}
									onValueChange={(value: FeedbackTone) =>
										updateSection("feedback_preferences", {
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
											📋 Strict
										</SelectItem>
										<SelectItem
											value="neutral"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											📝 Neutral
										</SelectItem>
										<SelectItem
											value="encouraging"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											💪 Encouraging
										</SelectItem>
										<SelectItem
											value="professional"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											⚖️ Professional
										</SelectItem>
										<SelectItem
											value="conversational"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											🎓 Conversational
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-3">
								<Label className="text-slate-200">Feedback Detail Level</Label>
								<Select
									value={localConfig.feedback_preferences.feedback_verbosity}
									onValueChange={(value: FeedbackVerbosity) =>
										updateSection("feedback_preferences", {
											feedback_verbosity: value,
										})
									}
								>
									<SelectTrigger className="border-blue-600/30 bg-slate-900 text-slate-100">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="border-blue-600/30 bg-slate-900">
										<SelectItem
											value="concise"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Concise
										</SelectItem>
										<SelectItem
											value="moderate"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Moderate
										</SelectItem>
										<SelectItem
											value="detailed"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Detailed
										</SelectItem>
										<SelectItem
											value="comprehensive"
											className="text-slate-100 focus:bg-blue-600/20"
										>
											Comprehensive
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg border border-blue-600/20 bg-slate-900 p-4">
							<div className="space-y-1">
								<Label className="text-slate-200">
									Include Improvement Tips
								</Label>
								<p className="text-muted-foreground text-xs">
									Provide actionable suggestions
								</p>
							</div>
							<Switch
								checked={
									localConfig.feedback_preferences
										.feedback_include_improvement_tips
								}
								onCheckedChange={(checked) =>
									updateSection("feedback_preferences", {
										feedback_include_improvement_tips: checked,
									})
								}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem
					value="annotation"
					className="rounded-lg border border-blue-600/20 bg-slate-950 px-6"
				>
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<SparklesIcon className="h-5 w-5 text-pink-400" />
							<span className="font-semibold text-blue-400">
								Annotation Preferences
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="space-y-6 pt-4">
						<div className="flex items-center justify-between rounded-lg border border-blue-600/20 bg-slate-900 p-4">
							<div className="space-y-1">
								<Label className="text-slate-200">Enable Annotations</Label>
								<p className="text-muted-foreground text-xs">
									Generate annotated PDFs
								</p>
							</div>
							<Switch
								checked={localConfig.annotation_preferences.annotation_enabled}
								onCheckedChange={(checked) =>
									updateSection("annotation_preferences", {
										annotation_enabled: checked,
									})
								}
							/>
						</div>

						{localConfig.annotation_preferences.annotation_enabled && (
							<>
								<div className="space-y-3">
									<Label className="text-slate-200">Annotation Style</Label>
									<Select
										value={localConfig.annotation_preferences.annotation_style}
										onValueChange={(value) =>
											updateSection("annotation_preferences", {
												annotation_style: value,
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
												Minimal
											</SelectItem>
											<SelectItem
												value="moderate"
												className="text-slate-100 focus:bg-blue-600/20"
											>
												Moderate
											</SelectItem>
											<SelectItem
												value="detailed"
												className="text-slate-100 focus:bg-blue-600/20"
											>
												Detailed
											</SelectItem>
											<SelectItem
												value="comprehensive"
												className="text-slate-100 focus:bg-blue-600/20"
											>
												Comprehensive
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="grid gap-4 md:grid-cols-3">
									<div className="space-y-2">
										<Label className="text-slate-200 text-sm">
											Correct Color
										</Label>
										<Input
											type="color"
											value={
												localConfig.annotation_preferences
													.annotation_highlight_correct_color
											}
											onChange={(e) =>
												updateSection("annotation_preferences", {
													annotation_highlight_correct_color: e.target.value,
												})
											}
											className="h-10 border-blue-600/30 bg-slate-900"
										/>
									</div>
									<div className="space-y-2">
										<Label className="text-slate-200 text-sm">
											Incorrect Color
										</Label>
										<Input
											type="color"
											value={
												localConfig.annotation_preferences
													.annotation_highlight_incorrect_color
											}
											onChange={(e) =>
												updateSection("annotation_preferences", {
													annotation_highlight_incorrect_color: e.target.value,
												})
											}
											className="h-10 border-blue-600/30 bg-slate-900"
										/>
									</div>
									<div className="space-y-2">
										<Label className="text-slate-200 text-sm">
											Partial Color
										</Label>
										<Input
											type="color"
											value={
												localConfig.annotation_preferences
													.annotation_highlight_partial_color
											}
											onChange={(e) =>
												updateSection("annotation_preferences", {
													annotation_highlight_partial_color: e.target.value,
												})
											}
											className="h-10 border-blue-600/30 bg-slate-900"
										/>
									</div>
								</div>
							</>
						)}
					</AccordionContent>
				</AccordionItem>

				<AccordionItem
					value="consistency"
					className="rounded-lg border border-blue-600/20 bg-slate-950 px-6"
				>
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<CheckCircleIcon className="h-5 w-5 text-cyan-400" />
							<span className="font-semibold text-blue-400">
								Consistency & Fairness
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="space-y-6 pt-4">
						<div className="flex items-center justify-between rounded-lg border border-blue-600/20 bg-slate-900 p-4">
							<div className="space-y-1">
								<Label className="text-slate-200">Bias Detection</Label>
								<p className="text-muted-foreground text-xs">
									Monitor for potential biases
								</p>
							</div>
							<Switch
								checked={
									localConfig.consistency_fairness.bias_detection_enabled
								}
								onCheckedChange={(checked) =>
									updateSection("consistency_fairness", {
										bias_detection_enabled: checked,
									})
								}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem
					value="learning"
					className="rounded-lg border border-blue-600/20 bg-slate-950 px-6"
				>
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<SparklesIcon className="h-5 w-5 text-purple-400" />
							<span className="font-semibold text-blue-400">
								Learning & Adaptation
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="space-y-6 pt-4">
						<div className="space-y-3">
							<Label className="text-slate-200">Learning Rate</Label>
							<Select
								value={localConfig.learning_adaptation.adaptation_learning_rate}
								onValueChange={(value) =>
									updateSection("learning_adaptation", {
										adaptation_learning_rate: value,
									})
								}
							>
								<SelectTrigger className="border-blue-600/30 bg-slate-900 text-slate-100">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-blue-600/30 bg-slate-900">
									<SelectItem
										value="slow"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Slow
									</SelectItem>
									<SelectItem
										value="moderate"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Moderate
									</SelectItem>
									<SelectItem
										value="fast"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Fast
									</SelectItem>
									<SelectItem
										value="aggressive"
										className="text-slate-100 focus:bg-blue-600/20"
									>
										Aggressive
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem
					value="subject"
					className="rounded-lg border border-blue-600/20 bg-slate-950 px-6"
				>
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<InfoIcon className="h-5 w-5 text-orange-400" />
							<span className="font-semibold text-blue-400">
								Subject-Specific Rules
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="space-y-6 pt-4">
						<div className="space-y-4">
							<h4 className="font-semibold text-slate-200 text-sm">
								Mathematics
							</h4>
							<div className="flex items-center justify-between rounded-lg border border-blue-600/20 bg-slate-900 p-4">
								<Label className="text-slate-200">Require Working</Label>
								<Switch
									checked={
										localConfig.subject_specific_rules
											.subject_math_require_working
									}
									onCheckedChange={(checked) =>
										updateSection("subject_specific_rules", {
											subject_math_require_working: checked,
										})
									}
								/>
							</div>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Label className="text-slate-200 text-sm">
											Formula Weight
										</Label>
										<Badge variant="secondary" className="bg-slate-800">
											{(
												localConfig.subject_specific_rules
													.subject_math_formula_weight * 100
											).toFixed(0)}
											%
										</Badge>
									</div>
									<Slider
										value={[
											localConfig.subject_specific_rules
												.subject_math_formula_weight * 100,
										]}
										onValueChange={([value]) =>
											updateSection("subject_specific_rules", {
												subject_math_formula_weight: value / 100,
											})
										}
										min={0}
										max={100}
										step={5}
										className="py-4"
									/>
								</div>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Label className="text-slate-200 text-sm">
											Calculation Weight
										</Label>
										<Badge variant="secondary" className="bg-slate-800">
											{(
												localConfig.subject_specific_rules
													.subject_math_calculation_weight * 100
											).toFixed(0)}
											%
										</Badge>
									</div>
									<Slider
										value={[
											localConfig.subject_specific_rules
												.subject_math_calculation_weight * 100,
										]}
										onValueChange={([value]) =>
											updateSection("subject_specific_rules", {
												subject_math_calculation_weight: value / 100,
											})
										}
										min={0}
										max={100}
										step={5}
										className="py-4"
									/>
								</div>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem
					value="question"
					className="rounded-lg border border-blue-600/20 bg-slate-950 px-6"
				>
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<SlidersIcon className="h-5 w-5 text-teal-400" />
							<span className="font-semibold text-blue-400">
								Question Type Rules
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="space-y-6 pt-4">
						<div className="space-y-3">
							<Label className="text-slate-200">
								Numerical Precision Digits
							</Label>
							<Select
								value={localConfig.question_type_rules.question_type_numerical_precision_digits.toString()}
								onValueChange={(value) =>
									updateSection("question_type_rules", {
										question_type_numerical_precision_digits: parseInt(
											value,
											10,
										),
									})
								}
							>
								<SelectTrigger className="border-blue-600/30 bg-slate-900 text-slate-100">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-blue-600/30 bg-slate-900">
									{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
										<SelectItem
											key={n}
											value={n.toString()}
											className="text-slate-100 focus:bg-blue-600/20"
										>
											{n}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem
					value="quality"
					className="rounded-lg border border-blue-600/20 bg-slate-950 px-6"
				>
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<CheckCircleIcon className="h-5 w-5 text-emerald-400" />
							<span className="font-semibold text-blue-400">
								Quality Metrics
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="space-y-6 pt-4">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label className="text-slate-200">Consistency Threshold</Label>
								<Badge variant="secondary" className="bg-slate-800">
									{(
										localConfig.quality_metrics.consistency_threshold * 100
									).toFixed(0)}
									%
								</Badge>
							</div>
							<Slider
								value={[
									localConfig.quality_metrics.consistency_threshold * 100,
								]}
								onValueChange={([value]) =>
									updateSection("quality_metrics", {
										consistency_threshold: value / 100,
									})
								}
								min={0}
								max={100}
								step={5}
								className="py-4"
							/>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<Alert className="border-blue-600/20 bg-slate-950">
				<SparklesIcon className="h-4 w-4 text-blue-400" />
				<AlertTitle className="text-blue-400">Configuration Summary</AlertTitle>
				<AlertDescription className="text-slate-400">
					<div className="mt-2 space-y-1 text-sm">
						<p>
							• Template:{" "}
							<strong className="text-blue-300">
								{selectedTemplate && TEMPLATE_CONFIGS[selectedTemplate].name}
							</strong>
						</p>
						<p>
							• Leniency:{" "}
							<strong className="text-blue-300">
								{localConfig.leniency_strictness.leniency_level}
							</strong>
						</p>
						<p>
							• Partial Marking:{" "}
							<strong className="text-blue-300">
								{localConfig.partial_marking_rules.partial_marking_enabled
									? "Enabled"
									: "Disabled"}
							</strong>
						</p>
						<p>
							• Feedback Tone:{" "}
							<strong className="text-blue-300">
								{localConfig.feedback_preferences.feedback_tone}
							</strong>
						</p>
					</div>
				</AlertDescription>
			</Alert>
		</div>
	);
}
