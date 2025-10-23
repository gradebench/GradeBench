// Evaluator Configuration Types based on Granular Configuration System

export type LeniencyLevel =
	| "very_strict"
	| "strict"
	| "balanced"
	| "lenient"
	| "very_lenient";
export type ParaphrasingTolerance = "none" | "low" | "medium" | "high";
export type HandwritingInterpretation = "strict" | "moderate" | "lenient";
export type ScoringScheme =
	| "integer"
	| "decimal_half"
	| "decimal_quarter"
	| "decimal_arbitrary";
export type NegativeMarkingPolicy =
	| "none"
	| "per_question"
	| "per_section"
	| "per_paper";
export type RoundingPolicy =
	| "round_up"
	| "round_down"
	| "round_nearest"
	| "no_rounding";
export type MarkDistributionTransparency = "full" | "partial" | "summary_only";
export type MandatoryComponentFailurePolicy =
	| "zero_entire_question"
	| "zero_component_only"
	| "partial_allowed";
export type FeedbackTone =
	| "strict"
	| "neutral"
	| "encouraging"
	| "balanced"
	| "mentoring";
export type FeedbackGranularity =
	| "per_point"
	| "per_subquestion"
	| "per_question"
	| "per_section"
	| "summary_only";
export type FeedbackVerbosity =
	| "minimal"
	| "concise"
	| "detailed"
	| "comprehensive";
export type FeedbackSuggestionStyle =
	| "direct_instruction"
	| "guiding_question"
	| "hint"
	| "resource_reference"
	| "none";
export type FeedbackShowModelAnswer =
	| "never"
	| "on_request"
	| "for_incorrect_only"
	| "always";
export type AnnotationScoreDisplay =
	| "per_question"
	| "per_page"
	| "end_only"
	| "none";
export type AnnotationSymbolStyle = "standard" | "emoji" | "custom";
export type AnnotationDensity = "minimal" | "moderate" | "comprehensive";
export type MCQMultipleCorrectPolicy =
	| "all_or_nothing"
	| "proportional"
	| "partial_per_correct";
export type InterpretationFlexibility = "strict" | "moderate" | "flexible";
export type AnswerLengthEnforcement = "strict" | "guideline" | "none";
export type RubricWeightageDistribution = "equal" | "custom" | "ai_suggested";
export type LearningAdaptationSensitivity = "low" | "medium" | "high";
export type AuditTimestampPrecision = "second" | "millisecond" | "microsecond";

// Identity Configuration
export interface IdentityConfig {
	evaluator_id: string;
	evaluator_name: string;
	evaluator_philosophy: string;
}

// Leniency & Strictness Configuration
export interface LeniencyConfig {
	global_leniency_level: LeniencyLevel;
	leniency_keyword_matching_threshold: number; // 0.0 - 1.0
	leniency_spelling_grammar_penalty_percent: number; // 0 - 100
	leniency_numerical_precision_margin: number;
	leniency_case_sensitivity: boolean;
	leniency_whitespace_sensitivity: boolean;
	leniency_synonym_acceptance: boolean;
	leniency_paraphrasing_tolerance: ParaphrasingTolerance;
	leniency_out_of_order_points: boolean;
	leniency_handwriting_interpretation: HandwritingInterpretation;
}

// Partial Marking Configuration
export interface PartialMarkingConfig {
	partial_marking_enabled: boolean;
	partial_mark_for_correct_method_wrong_answer: boolean;
	partial_mark_for_correct_method_percentage: number; // 0 - 100
	partial_mark_for_incomplete_answer: boolean;
	partial_mark_incomplete_threshold: number; // 0 - 100
	partial_mark_keyword_hit_percentage: number; // 0 - 100
	partial_mark_per_keyword: boolean;
	partial_mark_concept_understanding: boolean;
	partial_mark_concept_weight_percentage: number; // 0 - 100
	partial_mark_for_intermediate_steps: boolean;
	partial_mark_step_weight_percentage: number; // 0 - 100
}

// Deductions Configuration
export interface DeductionsConfig {
	deduction_per_spelling_error: number;
	deduction_per_grammar_error: number;
	deduction_for_incorrect_units: number;
	deduction_for_missing_units: number;
	deduction_for_calculation_error: number;
	deduction_for_conceptual_error: number;
	deduction_for_irrelevant_content: number;
	deduction_max_per_question: number;
}

// Scoring Methodology Configuration
export interface ScoringMethodologyConfig {
	scoring_scheme_default: ScoringScheme;
	decimal_precision: number; // 1 - 3
	negative_marking_enabled: boolean;
	negative_marking_policy: NegativeMarkingPolicy;
	negative_mark_value_mcq: number;
	negative_mark_value_subjective: number;
	zero_for_blank_answers: boolean;
	bonus_marks_enabled: boolean;
	bonus_marks_max_per_question: number;
	bonus_marks_criteria: string;
	rounding_policy: RoundingPolicy;
	mark_distribution_transparency: MarkDistributionTransparency;
	component_wise_marking: boolean;
	mandatory_component_failure_policy: MandatoryComponentFailurePolicy;
}

// Feedback Mechanisms Configuration
export interface FeedbackConfig {
	feedback_enabled: boolean;
	feedback_tone: FeedbackTone;
	feedback_granularity: FeedbackGranularity;
	feedback_verbosity: FeedbackVerbosity;
	feedback_include_positive_points: boolean;
	feedback_include_negative_points: boolean;
	feedback_suggestion_style: FeedbackSuggestionStyle;
	feedback_include_improvements: boolean;
	feedback_include_explanations: boolean;
	feedback_reference_model_answer: boolean;
	feedback_show_model_answer: FeedbackShowModelAnswer;
	feedback_highlight_keywords_missing: boolean;
	feedback_highlight_misconceptions: boolean;
	feedback_language: string; // ISO 639-1
	feedback_personalization: boolean;
	feedback_comparative: boolean;
	feedback_max_length_words: number;
}

// Annotation System Configuration
export interface AnnotationConfig {
	annotation_enabled: boolean;
	annotation_inline_comments: boolean;
	annotation_margin_notes: boolean;
	annotation_highlights: boolean;
	annotation_highlights_correct_color: string;
	annotation_highlights_incorrect_color: string;
	annotation_highlights_partial_color: string;
	annotation_underlines: boolean;
	annotation_strikethroughs: boolean;
	annotation_checkmarks: boolean;
	annotation_crosses: boolean;
	annotation_score_display: AnnotationScoreDisplay;
	annotation_symbol_style: AnnotationSymbolStyle;
	annotation_font_size: number; // 6 - 20
	annotation_font_family: string;
	annotation_density: AnnotationDensity;
	annotation_include_mark_breakdown: boolean;
}

// Question Type Handling Configuration
export interface QuestionTypeConfig {
	answer_type_mcq_enabled: boolean;
	answer_type_short_answer_enabled: boolean;
	answer_type_long_answer_enabled: boolean;
	answer_type_numerical_enabled: boolean;
	answer_type_diagram_enabled: boolean;
	answer_type_code_enabled: boolean;
	answer_type_fill_blank_enabled: boolean;
	answer_type_true_false_enabled: boolean;
	answer_type_matching_enabled: boolean;
	mcq_multiple_correct_policy: MCQMultipleCorrectPolicy;
	numerical_significant_figures_check: boolean;
	numerical_significant_figures_required: number;
	numerical_unit_matching_required: boolean;
	numerical_scientific_notation_acceptance: boolean;
	diagram_labeling_weight_percentage: number; // 0 - 100
	diagram_accuracy_weight_percentage: number; // 0 - 100
	diagram_neatness_weight_percentage: number; // 0 - 100
	code_syntax_correctness_weight: number; // 0 - 100
	code_logic_correctness_weight: number; // 0 - 100
	code_efficiency_weight: number; // 0 - 100
	code_style_weight: number; // 0 - 100
	code_test_case_execution: boolean;
	code_partial_pass_test_cases: boolean;
	essay_structure_weight_percentage: number; // 0 - 100
	essay_content_weight_percentage: number; // 0 - 100
	essay_language_weight_percentage: number; // 0 - 100
	essay_creativity_weight_percentage: number; // 0 - 100
	essay_minimum_word_count: number;
	essay_maximum_word_count: number;
	essay_word_count_penalty: number;
}

// Subject-Specific Overrides Configuration
export interface SubjectSpecificConfig {
	// Math
	subject_math_enabled: boolean;
	subject_math_formula_correctness_weight: number; // 0 - 100
	subject_math_step_showing_required: boolean;
	subject_math_final_answer_weight: number; // 0 - 100
	// Literature
	subject_literature_enabled: boolean;
	subject_literature_thematic_analysis_weight: number; // 0 - 100
	subject_literature_textual_evidence_required: boolean;
	subject_literature_interpretation_flexibility: InterpretationFlexibility;
	// Science
	subject_science_enabled: boolean;
	subject_science_experimental_method_weight: number; // 0 - 100
	subject_science_units_mandatory: boolean;
	// History
	subject_history_enabled: boolean;
	subject_history_date_accuracy_weight: number; // 0 - 100
	subject_history_date_range_tolerance_years: number;
	subject_history_source_citation_required: boolean;
	// Programming
	subject_programming_enabled: boolean;
	subject_programming_language: string;
	subject_programming_comments_required: boolean;
	subject_programming_runtime_efficiency_check: boolean;
	// Language
	subject_language_enabled: boolean;
	subject_language_grammar_weight: number; // 0 - 100
	subject_language_vocabulary_weight: number; // 0 - 100
	subject_language_fluency_weight: number; // 0 - 100
}

// Answer Constraints Configuration
export interface AnswerConstraintsConfig {
	answer_length_minimum_words: number;
	answer_length_maximum_words: number;
	answer_length_enforcement: AnswerLengthEnforcement;
	answer_completeness_threshold: number; // 0 - 100
	answer_relevance_threshold: number; // 0.0 - 1.0
	answer_coherence_check: boolean;
	answer_allow_bullet_points: boolean;
	answer_allow_diagrams_as_explanation: boolean;
	answer_original_thinking_bonus: boolean;
}

// Model Answer Settings Configuration
export interface ModelAnswerConfig {
	model_answer_variation_count: number;
	model_answer_mandatory_components: boolean;
	model_answer_optional_components: boolean;
	model_answer_keyword_weights: boolean;
	model_answer_concept_hierarchy: boolean;
}

// Rubric Settings Configuration
export interface RubricConfig {
	rubric_auto_generation: boolean;
	rubric_keyword_extraction: boolean;
	rubric_concept_mapping: boolean;
	rubric_weightage_distribution: RubricWeightageDistribution;
	rubric_error_pattern_detection: boolean;
	rubric_update_from_learning: boolean;
}

// Learning & Adaptation Configuration
export interface LearningAdaptationConfig {
	learning_mode_enabled: boolean;
	learning_adaptation_sensitivity: LearningAdaptationSensitivity;
	learning_sample_size_required: number;
	learning_confidence_threshold: number; // 0.0 - 1.0
	learning_track_discrepancies: boolean;
	learning_suggest_config_updates: boolean;
	learning_suggest_rubric_updates: boolean;
	learning_suggest_model_answer_updates: boolean;
}

// Quality Control Configuration
export interface QualityControlConfig {
	quality_control_spot_check_percentage: number; // 0 - 100
	quality_control_flag_low_confidence: boolean;
	quality_control_confidence_threshold: number; // 0.0 - 1.0
	quality_control_flag_score_outliers: boolean;
	quality_control_outlier_std_deviation: number;
}

// Consistency & Fairness Configuration
export interface ConsistencyFairnessConfig {
	consistency_check_enabled: boolean;
	consistency_similarity_threshold: number; // 0.0 - 1.0
	consistency_score_variance_tolerance: number;
	fairness_bias_detection: boolean;
	fairness_anonymization: boolean;
}

// Audit & Reporting Configuration
export interface AuditReportingConfig {
	audit_trail_enabled: boolean;
	audit_log_all_evaluations: boolean;
	audit_log_all_modifications: boolean;
	audit_log_config_changes: boolean;
	audit_log_rubric_changes: boolean;
	audit_timestamp_precision: AuditTimestampPrecision;
	report_generation_enabled: boolean;
	report_include_class_statistics: boolean;
	report_include_question_analysis: boolean;
	report_include_common_mistakes: boolean;
	report_include_individual_summaries: boolean;
	report_include_comparison_metrics: boolean;
	report_visualization_enabled: boolean;
}

// Export & Output Configuration
export interface ExportOutputConfig {
	export_format_pdf: boolean;
	export_format_csv: boolean;
	export_format_json: boolean;
	export_format_excel: boolean;
	export_include_annotations: boolean;
	export_include_feedback: boolean;
}

// Technical Processing Configuration
export interface TechnicalProcessingConfig {
	handwriting_recognition_enabled: boolean;
	handwriting_recognition_confidence_min: number; // 0.0 - 1.0
	handwriting_recognition_manual_review_threshold: number; // 0.0 - 1.0
	mathematical_equation_parsing: boolean;
	diagram_image_recognition: boolean;
	multi_language_support: boolean;
	language_auto_detection: boolean;
}

// Academic Integrity Configuration
export interface AcademicIntegrityConfig {
	plagiarism_detection_enabled: boolean;
	plagiarism_threshold_percentage: number; // 0 - 100
	plagiarism_check_external_sources: boolean;
	plagiarism_check_peer_answers: boolean;
	ai_generated_content_detection: boolean;
	answer_originality_score: boolean;
}

// Complete Evaluator Configuration
export interface EvaluatorConfiguration {
	identity: IdentityConfig;
	leniency: LeniencyConfig;
	partialMarking: PartialMarkingConfig;
	deductions: DeductionsConfig;
	scoringMethodology: ScoringMethodologyConfig;
	feedback: FeedbackConfig;
	annotation: AnnotationConfig;
	questionTypes: QuestionTypeConfig;
	subjectSpecific: SubjectSpecificConfig;
	answerConstraints: AnswerConstraintsConfig;
	modelAnswer: ModelAnswerConfig;
	rubric: RubricConfig;
	learningAdaptation: LearningAdaptationConfig;
	qualityControl: QualityControlConfig;
	consistencyFairness: ConsistencyFairnessConfig;
	auditReporting: AuditReportingConfig;
	exportOutput: ExportOutputConfig;
	technicalProcessing: TechnicalProcessingConfig;
	academicIntegrity: AcademicIntegrityConfig;
}

// Default configuration factory
export const createDefaultEvaluatorConfig = (): EvaluatorConfiguration => ({
	identity: {
		evaluator_id: crypto.randomUUID(),
		evaluator_name: "Default Evaluator",
		evaluator_philosophy:
			"Fair and balanced evaluation with focus on understanding",
	},
	leniency: {
		global_leniency_level: "balanced",
		leniency_keyword_matching_threshold: 0.7,
		leniency_spelling_grammar_penalty_percent: 5,
		leniency_numerical_precision_margin: 0.05,
		leniency_case_sensitivity: false,
		leniency_whitespace_sensitivity: false,
		leniency_synonym_acceptance: true,
		leniency_paraphrasing_tolerance: "medium",
		leniency_out_of_order_points: true,
		leniency_handwriting_interpretation: "moderate",
	},
	partialMarking: {
		partial_marking_enabled: true,
		partial_mark_for_correct_method_wrong_answer: true,
		partial_mark_for_correct_method_percentage: 50,
		partial_mark_for_incomplete_answer: true,
		partial_mark_incomplete_threshold: 60,
		partial_mark_keyword_hit_percentage: 70,
		partial_mark_per_keyword: true,
		partial_mark_concept_understanding: true,
		partial_mark_concept_weight_percentage: 40,
		partial_mark_for_intermediate_steps: true,
		partial_mark_step_weight_percentage: 30,
	},
	deductions: {
		deduction_per_spelling_error: 0.25,
		deduction_per_grammar_error: 0.25,
		deduction_for_incorrect_units: 0.5,
		deduction_for_missing_units: 0.5,
		deduction_for_calculation_error: 1.0,
		deduction_for_conceptual_error: 2.0,
		deduction_for_irrelevant_content: 0.5,
		deduction_max_per_question: 5.0,
	},
	scoringMethodology: {
		scoring_scheme_default: "decimal_half",
		decimal_precision: 2,
		negative_marking_enabled: false,
		negative_marking_policy: "none",
		negative_mark_value_mcq: 0.25,
		negative_mark_value_subjective: 0,
		zero_for_blank_answers: true,
		bonus_marks_enabled: true,
		bonus_marks_max_per_question: 2,
		bonus_marks_criteria: "Exceptional insight or creativity",
		rounding_policy: "round_nearest",
		mark_distribution_transparency: "full",
		component_wise_marking: true,
		mandatory_component_failure_policy: "partial_allowed",
	},
	feedback: {
		feedback_enabled: true,
		feedback_tone: "balanced",
		feedback_granularity: "per_question",
		feedback_verbosity: "detailed",
		feedback_include_positive_points: true,
		feedback_include_negative_points: true,
		feedback_suggestion_style: "guiding_question",
		feedback_include_improvements: true,
		feedback_include_explanations: true,
		feedback_reference_model_answer: true,
		feedback_show_model_answer: "for_incorrect_only",
		feedback_highlight_keywords_missing: true,
		feedback_highlight_misconceptions: true,
		feedback_language: "en",
		feedback_personalization: false,
		feedback_comparative: false,
		feedback_max_length_words: 200,
	},
	annotation: {
		annotation_enabled: true,
		annotation_inline_comments: true,
		annotation_margin_notes: true,
		annotation_highlights: true,
		annotation_highlights_correct_color: "#00FF00",
		annotation_highlights_incorrect_color: "#FF0000",
		annotation_highlights_partial_color: "#FFAA00",
		annotation_underlines: true,
		annotation_strikethroughs: true,
		annotation_checkmarks: true,
		annotation_crosses: true,
		annotation_score_display: "per_question",
		annotation_symbol_style: "standard",
		annotation_font_size: 12,
		annotation_font_family: "Helvetica",
		annotation_density: "moderate",
		annotation_include_mark_breakdown: true,
	},
	questionTypes: {
		answer_type_mcq_enabled: true,
		answer_type_short_answer_enabled: true,
		answer_type_long_answer_enabled: true,
		answer_type_numerical_enabled: true,
		answer_type_diagram_enabled: true,
		answer_type_code_enabled: false,
		answer_type_fill_blank_enabled: true,
		answer_type_true_false_enabled: true,
		answer_type_matching_enabled: true,
		mcq_multiple_correct_policy: "proportional",
		numerical_significant_figures_check: false,
		numerical_significant_figures_required: 3,
		numerical_unit_matching_required: true,
		numerical_scientific_notation_acceptance: true,
		diagram_labeling_weight_percentage: 40,
		diagram_accuracy_weight_percentage: 40,
		diagram_neatness_weight_percentage: 20,
		code_syntax_correctness_weight: 30,
		code_logic_correctness_weight: 50,
		code_efficiency_weight: 10,
		code_style_weight: 10,
		code_test_case_execution: false,
		code_partial_pass_test_cases: true,
		essay_structure_weight_percentage: 30,
		essay_content_weight_percentage: 50,
		essay_language_weight_percentage: 15,
		essay_creativity_weight_percentage: 5,
		essay_minimum_word_count: 200,
		essay_maximum_word_count: 1000,
		essay_word_count_penalty: 0.5,
	},
	subjectSpecific: {
		subject_math_enabled: false,
		subject_math_formula_correctness_weight: 30,
		subject_math_step_showing_required: true,
		subject_math_final_answer_weight: 40,
		subject_literature_enabled: false,
		subject_literature_thematic_analysis_weight: 40,
		subject_literature_textual_evidence_required: true,
		subject_literature_interpretation_flexibility: "moderate",
		subject_science_enabled: false,
		subject_science_experimental_method_weight: 30,
		subject_science_units_mandatory: true,
		subject_history_enabled: false,
		subject_history_date_accuracy_weight: 20,
		subject_history_date_range_tolerance_years: 5,
		subject_history_source_citation_required: false,
		subject_programming_enabled: false,
		subject_programming_language: "python",
		subject_programming_comments_required: false,
		subject_programming_runtime_efficiency_check: false,
		subject_language_enabled: false,
		subject_language_grammar_weight: 40,
		subject_language_vocabulary_weight: 30,
		subject_language_fluency_weight: 30,
	},
	answerConstraints: {
		answer_length_minimum_words: 50,
		answer_length_maximum_words: 500,
		answer_length_enforcement: "guideline",
		answer_completeness_threshold: 60,
		answer_relevance_threshold: 0.7,
		answer_coherence_check: true,
		answer_allow_bullet_points: true,
		answer_allow_diagrams_as_explanation: true,
		answer_original_thinking_bonus: true,
	},
	modelAnswer: {
		model_answer_variation_count: 3,
		model_answer_mandatory_components: true,
		model_answer_optional_components: true,
		model_answer_keyword_weights: true,
		model_answer_concept_hierarchy: true,
	},
	rubric: {
		rubric_auto_generation: true,
		rubric_keyword_extraction: true,
		rubric_concept_mapping: true,
		rubric_weightage_distribution: "ai_suggested",
		rubric_error_pattern_detection: true,
		rubric_update_from_learning: false,
	},
	learningAdaptation: {
		learning_mode_enabled: true,
		learning_adaptation_sensitivity: "medium",
		learning_sample_size_required: 10,
		learning_confidence_threshold: 0.85,
		learning_track_discrepancies: true,
		learning_suggest_config_updates: true,
		learning_suggest_rubric_updates: true,
		learning_suggest_model_answer_updates: true,
	},
	qualityControl: {
		quality_control_spot_check_percentage: 10,
		quality_control_flag_low_confidence: true,
		quality_control_confidence_threshold: 0.7,
		quality_control_flag_score_outliers: true,
		quality_control_outlier_std_deviation: 2.0,
	},
	consistencyFairness: {
		consistency_check_enabled: true,
		consistency_similarity_threshold: 0.8,
		consistency_score_variance_tolerance: 2.0,
		fairness_bias_detection: true,
		fairness_anonymization: true,
	},
	auditReporting: {
		audit_trail_enabled: true,
		audit_log_all_evaluations: true,
		audit_log_all_modifications: true,
		audit_log_config_changes: true,
		audit_log_rubric_changes: true,
		audit_timestamp_precision: "millisecond",
		report_generation_enabled: true,
		report_include_class_statistics: true,
		report_include_question_analysis: true,
		report_include_common_mistakes: true,
		report_include_individual_summaries: true,
		report_include_comparison_metrics: true,
		report_visualization_enabled: true,
	},
	exportOutput: {
		export_format_pdf: true,
		export_format_csv: true,
		export_format_json: true,
		export_format_excel: true,
		export_include_annotations: true,
		export_include_feedback: true,
	},
	technicalProcessing: {
		handwriting_recognition_enabled: true,
		handwriting_recognition_confidence_min: 0.7,
		handwriting_recognition_manual_review_threshold: 0.5,
		mathematical_equation_parsing: true,
		diagram_image_recognition: true,
		multi_language_support: false,
		language_auto_detection: false,
	},
	academicIntegrity: {
		plagiarism_detection_enabled: true,
		plagiarism_threshold_percentage: 30,
		plagiarism_check_external_sources: false,
		plagiarism_check_peer_answers: true,
		ai_generated_content_detection: true,
		answer_originality_score: true,
	},
});
