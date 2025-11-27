// Comprehensive Granular Evaluator Configuration Types v3
// Based on the complete specification with all 150+ parameters

// ============= Enums & Type Definitions =============

// Identity
export type ExamType =
	| "High School Final"
	| "College Midterm"
	| "Professional Certification"
	| "Entrance Exam"
	| "Board Exam"
	| "Competitive Exam"
	| "Custom";

// Scoring Methodology
export type ScoringSchemeDefault = "integer" | "decimal";
export type NegativeMarkingPolicy =
	| "none"
	| "per_question"
	| "per_option"
	| "custom";
export type RoundingPolicy =
	| "round_up"
	| "round_down"
	| "round_nearest"
	| "no_rounding";

// Leniency & Strictness
export type LeniencyLevel =
	| "very_strict"
	| "strict"
	| "moderate"
	| "lenient"
	| "very_lenient";

// Feedback
export type FeedbackTone =
	| "encouraging"
	| "neutral"
	| "strict"
	| "professional"
	| "conversational";
export type FeedbackGranularity =
	| "per_point"
	| "per_sub_question"
	| "per_question"
	| "summary_only";
export type FeedbackVerbosity =
	| "concise"
	| "moderate"
	| "detailed"
	| "comprehensive";
export type FeedbackSuggestionStyle =
	| "direct_instruction"
	| "guiding_question"
	| "hints"
	| "none";
export type FeedbackShowModelAnswer =
	| "never"
	| "on_request"
	| "for_incorrect_only"
	| "always";
export type FeedbackReadingLevel =
	| "elementary"
	| "middle_school"
	| "high_school"
	| "college"
	| "graduate";

// Annotation
export type AnnotationStyle =
	| "minimal"
	| "moderate"
	| "detailed"
	| "comprehensive";
export type AnnotationSymbolSet = "standard" | "emoji" | "custom";

// Learning & Adaptation
export type AdaptationLearningRate =
	| "slow"
	| "moderate"
	| "fast"
	| "aggressive";

// Question Types
export type InterpretationFlexibility = "strict" | "moderate" | "flexible";

// ============= Interface Definitions =============

// Identity Configuration
export interface IdentityConfig {
	subject: string; // e.g., "Mathematics", "Literature", "Physics"
	exam_type: ExamType | string;
	grading_philosophy: string; // Free text description
}

// Scoring Methodology Configuration
export interface ScoringMethodologyConfig {
	scoring_scheme_default: ScoringSchemeDefault;
	decimal_precision: number; // 0-3
	allow_negative_marking: boolean;
	negative_marking_policy: NegativeMarkingPolicy | string;
	negative_mark_value_mcq: number; // e.g., -0.25, -1.0
	negative_mark_value_subjective: number;
	rounding_policy: RoundingPolicy | string;
	total_marks_cap: boolean;
	grace_marks_enabled: boolean;
	grace_marks_threshold: number; // 0.0-5.0
}

// Leniency & Strictness Configuration
export interface LeniencyStrictnessConfig {
	leniency_level: LeniencyLevel;
	leniency_keyword_matching_threshold: number; // 0.0-1.0
	leniency_spelling_grammar_penalty_percent: number; // 0-100
	leniency_numerical_precision_margin: number; // e.g., ±5%
	leniency_unit_mismatch_penalty: number; // 0-100
	leniency_formatting_penalty: number; // 0-100
	allow_partial_marks_for_wrong_method: boolean;
	allow_alternative_approaches: boolean;
	strictness_conceptual_error_penalty: number; // 0-100
	strictness_require_working_shown: boolean;
	working_required_penalty_percent: number; // 0-100
}

// Partial Marking Rules Configuration
export interface PartialMarkingRulesConfig {
	partial_marking_enabled: boolean;
	partial_mark_for_correct_method_wrong_answer: number; // 0-100
	partial_mark_for_partial_steps: number; // 0-100
	partial_mark_keyword_hit_threshold: number; // 0-1.0
	partial_mark_minimum_award: number;
	deduction_per_spelling_error: number;
	max_spelling_error_deduction: number;
	deduction_per_grammar_error: number;
	max_grammar_error_deduction: number;
	deduction_for_incorrect_units: number;
	deduction_for_missing_units: number;
	keyword_hit_percentage_for_full_marks: number; // 0-100
	concept_coverage_weight: number; // 0-1.0
	step_by_step_evaluation_enabled: boolean;
}

// Feedback Preferences Configuration
export interface FeedbackPreferencesConfig {
	feedback_tone: FeedbackTone;
	feedback_granularity: FeedbackGranularity;
	feedback_verbosity: FeedbackVerbosity;
	feedback_suggestion_style: FeedbackSuggestionStyle;
	feedback_include_positive_points: boolean;
	feedback_include_improvement_tips: boolean;
	feedback_highlight_common_mistakes: boolean;
	feedback_compare_to_model_answer: boolean;
	feedback_include_mark_breakdown: boolean;
	feedback_language: string; // e.g., "English", "Spanish"
	feedback_reading_level: FeedbackReadingLevel;
	feedback_personalization_enabled: boolean;
}

// Annotation Preferences Configuration
export interface AnnotationPreferencesConfig {
	annotation_enabled: boolean;
	annotation_style: AnnotationStyle | string;
	annotation_use_checkmarks: boolean;
	annotation_use_crosses: boolean;
	annotation_use_highlights: boolean;
	annotation_highlight_correct_color: string; // hex color
	annotation_highlight_incorrect_color: string; // hex color
	annotation_highlight_partial_color: string; // hex color
	annotation_use_underlines: boolean;
	annotation_use_strikethroughs: boolean;
	annotation_use_margin_notes: boolean;
	annotation_use_inline_comments: boolean;
	annotation_show_scores_inline: boolean;
	annotation_symbol_set: AnnotationSymbolSet;
}

// Consistency & Fairness Configuration
export interface ConsistencyFairnessConfig {
	consistency_check_enabled: boolean;
	consistency_similarity_threshold: number; // 0.0-1.0
	bias_detection_enabled: boolean;
	anonymize_evaluation: boolean;
	cross_question_consistency_check: boolean;
}

// Learning & Adaptation Configuration
export interface LearningAdaptationConfig {
	adaptation_learning_rate: AdaptationLearningRate | string;
	adaptation_confidence_threshold: number; // 0.0-1.0
	adaptation_sample_size_for_autonomy: number; // 5-50
	adaptation_enable_auto_recommendations: boolean;
	adaptation_user_approval_required: boolean;
}

// Subject-Specific Rules Configuration
export interface SubjectSpecificRulesConfig {
	subject_specific_override_enabled: boolean;

	// Mathematics
	subject_math_require_working: boolean;
	subject_math_formula_weight: number; // 0-1.0
	subject_math_calculation_weight: number; // 0-1.0

	// Literature
	subject_literature_thematic_analysis_weight: number; // 0-1.0
	subject_literature_textual_evidence_required: boolean;
	subject_literature_interpretation_creativity_weight: number; // 0-1.0

	// Science
	subject_science_diagram_label_weight: number; // 0-1.0
	subject_science_experimental_design_weight: number; // 0-1.0

	// History
	subject_history_chronology_accuracy_weight: number; // 0-1.0
	subject_history_source_citation_required: boolean;

	// Computer Science
	subject_code_syntax_weight: number; // 0-1.0
	subject_code_logic_weight: number; // 0-1.0
	subject_code_efficiency_weight: number; // 0-1.0
	subject_code_style_weight: number; // 0-1.0
	subject_code_execution_required: boolean;
}

// Question Type Rules Configuration
export interface QuestionTypeRulesConfig {
	// MCQ
	question_type_mcq_strict_matching: boolean;
	question_type_mcq_guess_penalty: number;

	// Numerical
	question_type_numerical_precision_digits: number; // 1-10
	question_type_numerical_scientific_notation_required: boolean;

	// Essay
	question_type_essay_min_word_count_enforced: boolean;
	question_type_essay_structure_weight: number; // 0-1.0
	question_type_essay_argument_coherence_weight: number; // 0-1.0
	question_type_essay_evidence_quality_weight: number; // 0-1.0

	// Code
	question_type_code_test_case_weight: number; // 0-1.0

	// Diagram
	question_type_diagram_accuracy_weight: number; // 0-1.0
	question_type_diagram_labeling_weight: number; // 0-1.0
}

// Audit & Compliance Configuration
export interface AuditComplianceConfig {
	audit_trail_enabled: boolean;
	audit_log_modifications: boolean;
	audit_log_learning_changes: boolean;
	audit_retention_days: number;
	evaluation_timestamp_required: boolean;
	evaluator_signature_required: boolean;
	version_control_enabled: boolean;
}

// Quality Metrics Configuration
export interface QualityMetricsConfig {
	accuracy_target_margin_percent: number; // e.g., 5.0
	consistency_threshold: number; // 0.0-1.0
	speed_multiplier_target: number; // e.g., 10.0
	explainability_required: boolean;
	confidence_score_display: boolean;
}

// ============= Main Configuration Interface =============

export interface EvaluatorConfigurationV3 {
	// System fields
	id: string; // UUID
	config_name: string;
	description?: string;

	// Configuration sections
	identity: IdentityConfig;
	scoring_methodology: ScoringMethodologyConfig;
	leniency_strictness: LeniencyStrictnessConfig;
	partial_marking_rules: PartialMarkingRulesConfig;
	feedback_preferences: FeedbackPreferencesConfig;
	annotation_preferences: AnnotationPreferencesConfig;
	consistency_fairness: ConsistencyFairnessConfig;
	learning_adaptation: LearningAdaptationConfig;
	subject_specific_rules: SubjectSpecificRulesConfig;
	question_type_rules: QuestionTypeRulesConfig;
	audit_compliance: AuditComplianceConfig;
	quality_metrics: QualityMetricsConfig;

	// Metadata
	created_at?: string;
	updated_at?: string;
	created_by?: string;
	is_active?: boolean;
	is_default?: boolean;
}

// ============= Default Configuration Factory =============

export function createDefaultEvaluatorConfigV3(
	configName = "Default Configuration",
	subject = "General",
): EvaluatorConfigurationV3 {
	return {
		id: crypto.randomUUID(),
		config_name: configName,
		description: "Default evaluator configuration",

		identity: {
			subject: subject,
			exam_type: "Custom",
			grading_philosophy:
				"Fair and balanced evaluation with focus on conceptual understanding",
		},

		scoring_methodology: {
			scoring_scheme_default: "decimal",
			decimal_precision: 2,
			allow_negative_marking: false,
			negative_marking_policy: "none",
			negative_mark_value_mcq: 0,
			negative_mark_value_subjective: 0,
			rounding_policy: "round_nearest",
			total_marks_cap: true,
			grace_marks_enabled: false,
			grace_marks_threshold: 0,
		},

		leniency_strictness: {
			leniency_level: "moderate",
			leniency_keyword_matching_threshold: 0.7,
			leniency_spelling_grammar_penalty_percent: 5,
			leniency_numerical_precision_margin: 0.05,
			leniency_unit_mismatch_penalty: 10,
			leniency_formatting_penalty: 5,
			allow_partial_marks_for_wrong_method: true,
			allow_alternative_approaches: true,
			strictness_conceptual_error_penalty: 50,
			strictness_require_working_shown: false,
			working_required_penalty_percent: 20,
		},

		partial_marking_rules: {
			partial_marking_enabled: true,
			partial_mark_for_correct_method_wrong_answer: 50,
			partial_mark_for_partial_steps: 30,
			partial_mark_keyword_hit_threshold: 0.6,
			partial_mark_minimum_award: 0.5,
			deduction_per_spelling_error: 0.25,
			max_spelling_error_deduction: 2,
			deduction_per_grammar_error: 0.25,
			max_grammar_error_deduction: 2,
			deduction_for_incorrect_units: 0.5,
			deduction_for_missing_units: 0.5,
			keyword_hit_percentage_for_full_marks: 80,
			concept_coverage_weight: 0.6,
			step_by_step_evaluation_enabled: true,
		},

		feedback_preferences: {
			feedback_tone: "professional",
			feedback_granularity: "per_question",
			feedback_verbosity: "moderate",
			feedback_suggestion_style: "guiding_question",
			feedback_include_positive_points: true,
			feedback_include_improvement_tips: true,
			feedback_highlight_common_mistakes: true,
			feedback_compare_to_model_answer: false,
			feedback_include_mark_breakdown: true,
			feedback_language: "English",
			feedback_reading_level: "high_school",
			feedback_personalization_enabled: false,
		},

		annotation_preferences: {
			annotation_enabled: true,
			annotation_style: "moderate",
			annotation_use_checkmarks: true,
			annotation_use_crosses: true,
			annotation_use_highlights: true,
			annotation_highlight_correct_color: "#00FF00",
			annotation_highlight_incorrect_color: "#FF0000",
			annotation_highlight_partial_color: "#FFA500",
			annotation_use_underlines: true,
			annotation_use_strikethroughs: false,
			annotation_use_margin_notes: true,
			annotation_use_inline_comments: true,
			annotation_show_scores_inline: true,
			annotation_symbol_set: "standard",
		},

		consistency_fairness: {
			consistency_check_enabled: true,
			consistency_similarity_threshold: 0.85,
			bias_detection_enabled: true,
			anonymize_evaluation: true,
			cross_question_consistency_check: true,
		},

		learning_adaptation: {
			adaptation_learning_rate: "moderate",
			adaptation_confidence_threshold: 0.75,
			adaptation_sample_size_for_autonomy: 10,
			adaptation_enable_auto_recommendations: true,
			adaptation_user_approval_required: true,
		},

		subject_specific_rules: {
			subject_specific_override_enabled: false,
			subject_math_require_working: true,
			subject_math_formula_weight: 0.4,
			subject_math_calculation_weight: 0.6,
			subject_literature_thematic_analysis_weight: 0.5,
			subject_literature_textual_evidence_required: true,
			subject_literature_interpretation_creativity_weight: 0.3,
			subject_science_diagram_label_weight: 0.3,
			subject_science_experimental_design_weight: 0.4,
			subject_history_chronology_accuracy_weight: 0.3,
			subject_history_source_citation_required: false,
			subject_code_syntax_weight: 0.2,
			subject_code_logic_weight: 0.5,
			subject_code_efficiency_weight: 0.2,
			subject_code_style_weight: 0.1,
			subject_code_execution_required: true,
		},

		question_type_rules: {
			question_type_mcq_strict_matching: true,
			question_type_mcq_guess_penalty: 0,
			question_type_numerical_precision_digits: 2,
			question_type_numerical_scientific_notation_required: false,
			question_type_essay_min_word_count_enforced: false,
			question_type_essay_structure_weight: 0.3,
			question_type_essay_argument_coherence_weight: 0.4,
			question_type_essay_evidence_quality_weight: 0.3,
			question_type_code_test_case_weight: 0.7,
			question_type_diagram_accuracy_weight: 0.5,
			question_type_diagram_labeling_weight: 0.5,
		},

		audit_compliance: {
			audit_trail_enabled: true,
			audit_log_modifications: true,
			audit_log_learning_changes: true,
			audit_retention_days: 365,
			evaluation_timestamp_required: true,
			evaluator_signature_required: false,
			version_control_enabled: true,
		},

		quality_metrics: {
			accuracy_target_margin_percent: 5,
			consistency_threshold: 0.85,
			speed_multiplier_target: 10,
			explainability_required: true,
			confidence_score_display: true,
		},

		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		is_active: true,
		is_default: false,
	};
}

// ============= Preset Configurations =============

export const EVALUATOR_PRESETS_V3 = {
	STRICT_ACADEMIC: {
		name: "Strict Academic",
		description: "High standards for academic excellence",
		overrides: {
			leniency_strictness: {
				leniency_level: "strict" as LeniencyLevel,
				allow_partial_marks_for_wrong_method: false,
			},
			partial_marking_rules: {
				partial_marking_enabled: false,
			},
		},
	},
	LENIENT_LEARNING: {
		name: "Lenient Learning",
		description: "Encouraging environment for learning",
		overrides: {
			leniency_strictness: {
				leniency_level: "lenient" as LeniencyLevel,
			},
			feedback_preferences: {
				feedback_tone: "encouraging" as FeedbackTone,
			},
		},
	},
	COMPETITIVE_EXAM: {
		name: "Competitive Exam",
		description: "Configuration for competitive examinations",
		overrides: {
			scoring_methodology: {
				allow_negative_marking: true,
				negative_marking_policy: "per_question" as NegativeMarkingPolicy,
				negative_mark_value_mcq: 0.25,
			},
			leniency_strictness: {
				leniency_level: "strict" as LeniencyLevel,
			},
		},
	},
	MATHEMATICS_FOCUSED: {
		name: "Mathematics Focused",
		description: "Optimized for mathematics evaluation",
		overrides: {
			subject_specific_rules: {
				subject_specific_override_enabled: true,
				subject_math_require_working: true,
				subject_math_formula_weight: 0.5,
				subject_math_calculation_weight: 0.5,
			},
		},
	},
	ESSAY_COMPREHENSIVE: {
		name: "Essay Comprehensive",
		description: "Detailed essay evaluation",
		overrides: {
			question_type_rules: {
				question_type_essay_min_word_count_enforced: true,
				question_type_essay_structure_weight: 0.3,
				question_type_essay_argument_coherence_weight: 0.4,
				question_type_essay_evidence_quality_weight: 0.3,
			},
			feedback_preferences: {
				feedback_verbosity: "comprehensive" as FeedbackVerbosity,
			},
		},
	},
} as const;

// ============= Helper Types =============

export type EvaluatorConfigurationV3Update = Partial<
	Omit<EvaluatorConfigurationV3, "id" | "created_at">
>;

export type EvaluatorConfigurationV3Create = Omit<
	EvaluatorConfigurationV3,
	"id" | "created_at" | "updated_at"
>;
