// Database-aligned Evaluator Configuration Types
// Maps to evaluator_configurations table with JSONB columns

// ============= Core Types =============
export type LeniencyLevel =
	| "very_strict"
	| "strict"
	| "balanced"
	| "lenient"
	| "very_lenient";
export type ScoringScheme =
	| "integer"
	| "decimal_half"
	| "decimal_quarter"
	| "decimal_arbitrary";
export type FeedbackTone =
	| "strict"
	| "neutral"
	| "encouraging"
	| "balanced"
	| "mentoring";
export type FeedbackVerbosity =
	| "minimal"
	| "concise"
	| "detailed"
	| "comprehensive";
export type AnnotationStyle = "standard" | "emoji" | "custom";

// ============= JSONB Field Types =============

export interface ScoringMethodology {
	scoring_scheme: ScoringScheme;
	decimal_precision: number; // 1-3
	negative_marking_enabled: boolean;
	negative_mark_value_mcq: number;
	negative_mark_value_subjective: number;
	zero_for_blank_answers: boolean;
	bonus_marks_enabled: boolean;
	rounding_policy: "round_up" | "round_down" | "round_nearest" | "no_rounding";
	component_wise_marking: boolean;
}

export interface LeniencyStrictness {
	global_leniency_level: LeniencyLevel;
	keyword_matching_threshold: number; // 0.0 - 1.0
	spelling_grammar_penalty_percent: number; // 0 - 100
	numerical_precision_margin: number;
	case_sensitivity: boolean;
	whitespace_sensitivity: boolean;
	synonym_acceptance: boolean;
	paraphrasing_tolerance: "none" | "low" | "medium" | "high";
	out_of_order_points_allowed: boolean;
}

export interface PartialMarkingRules {
	enabled: boolean;
	correct_method_wrong_answer: boolean;
	correct_method_percentage: number; // 0 - 100
	incomplete_answer_allowed: boolean;
	incomplete_threshold: number; // 0 - 100
	keyword_hit_percentage: number; // 0 - 100
	mark_per_keyword: boolean;
	concept_understanding_weight: number; // 0 - 100
	intermediate_steps_weight: number; // 0 - 100
}

export interface FeedbackPreferences {
	enabled: boolean;
	tone: FeedbackTone;
	granularity:
		| "per_point"
		| "per_subquestion"
		| "per_question"
		| "per_section"
		| "summary_only";
	verbosity: FeedbackVerbosity;
	include_positive_points: boolean;
	include_negative_points: boolean;
	suggestion_style:
		| "direct_instruction"
		| "guiding_question"
		| "hint"
		| "resource_reference"
		| "none";
	show_model_answer: "never" | "on_request" | "for_incorrect_only" | "always";
	improvement_roadmap: boolean;
	topic_specific_resources: boolean;
}

export interface AnnotationPreferences {
	score_display: "per_question" | "per_page" | "end_only" | "none";
	symbol_style: AnnotationStyle;
	custom_symbols?: {
		correct: string;
		incorrect: string;
		partial: string;
		missing: string;
	};
	density: "minimal" | "moderate" | "comprehensive";
	highlight_errors: boolean;
	color_coding_enabled: boolean;
}

export interface ConsistencyFairness {
	cross_student_normalization: boolean;
	outlier_detection_enabled: boolean;
	bias_detection_enabled: boolean;
	anonymized_evaluation: boolean;
	consistency_check_threshold: number; // 0.0 - 1.0
	recalibration_trigger_variance: number; // 0.0 - 1.0
}

export interface LearningAdaptation {
	adaptive_feedback_enabled: boolean;
	student_profiling_enabled: boolean;
	difficulty_calibration: boolean;
	learning_style_adaptation: boolean;
	performance_trend_analysis: boolean;
	personalized_recommendations: boolean;
	adaptation_sensitivity: "low" | "medium" | "high";
}

export interface SubjectSpecificRules {
	subject_name: string;
	terminology_strictness: "strict" | "moderate" | "flexible";
	formula_notation_flexibility: boolean;
	diagram_labeling_required: boolean;
	unit_consistency_required: boolean;
	significant_figures_enforcement: boolean;
	step_by_step_required: boolean;
	custom_rubrics: Array<{
		criterion: string;
		weight: number;
		description: string;
	}>;
}

export interface QuestionTypeRules {
	mcq: {
		multiple_correct_policy:
			| "all_or_nothing"
			| "proportional"
			| "partial_per_correct";
		negative_marking: number;
		unanswered_policy: "zero" | "no_penalty";
	};
	short_answer: {
		word_limit_enforcement: "strict" | "guideline" | "none";
		keyword_minimum_required: number;
		format_strictness: "strict" | "moderate" | "flexible";
	};
	long_answer: {
		word_limit_enforcement: "strict" | "guideline" | "none";
		structure_importance: number; // 0 - 100
		argument_coherence_weight: number; // 0 - 100
		evidence_citation_required: boolean;
	};
	numerical: {
		precision_required: number;
		unit_mandatory: boolean;
		range_tolerance_percent: number;
		scientific_notation_required: boolean;
	};
	diagram: {
		labeling_completeness_weight: number; // 0 - 100
		accuracy_weight: number; // 0 - 100
		neatness_consideration: boolean;
	};
}

export interface AuditCompliance {
	version_control_enabled: boolean;
	timestamp_precision: "second" | "millisecond" | "microsecond";
	evaluator_transparency_level: "full" | "partial" | "minimal";
	decision_trail_logging: boolean;
	manual_override_tracking: boolean;
	compliance_report_generation: boolean;
	gdpr_anonymization: boolean;
}

export interface QualityMetrics {
	inter_rater_reliability_target: number; // 0.0 - 1.0
	confidence_score_threshold: number; // 0.0 - 1.0
	human_review_trigger_threshold: number; // 0.0 - 1.0
	quality_assurance_sampling_rate: number; // 0.0 - 1.0
	performance_monitoring_enabled: boolean;
	error_rate_alerting: boolean;
	continuous_improvement_feedback: boolean;
}

// ============= Main Configuration Interface =============

export interface EvaluatorConfigurationV2 {
	id: string; // UUID
	config_name: string;
	subject: string;

	// JSONB Fields
	scoring_methodology: ScoringMethodology;
	leniency_strictness: LeniencyStrictness;
	partial_marking_rules: PartialMarkingRules;
	feedback_preferences: FeedbackPreferences;
	annotation_preferences: AnnotationPreferences;
	consistency_fairness: ConsistencyFairness;
	learning_adaptation: LearningAdaptation;
	subject_specific_rules: SubjectSpecificRules;
	question_type_rules: QuestionTypeRules;
	audit_compliance: AuditCompliance;
	quality_metrics: QualityMetrics;

	// Timestamps
	created_at?: string;
	updated_at?: string;
}

// ============= Default Configuration Factory =============

export function createDefaultEvaluatorConfigV2(
	configName = "Default Configuration",
	subject = "General",
): EvaluatorConfigurationV2 {
	return {
		id: crypto.randomUUID(),
		config_name: configName,
		subject: subject,

		scoring_methodology: {
			scoring_scheme: "decimal_half",
			decimal_precision: 2,
			negative_marking_enabled: false,
			negative_mark_value_mcq: 0.25,
			negative_mark_value_subjective: 0,
			zero_for_blank_answers: true,
			bonus_marks_enabled: false,
			rounding_policy: "round_nearest",
			component_wise_marking: true,
		},

		leniency_strictness: {
			global_leniency_level: "balanced",
			keyword_matching_threshold: 0.7,
			spelling_grammar_penalty_percent: 5,
			numerical_precision_margin: 0.01,
			case_sensitivity: false,
			whitespace_sensitivity: false,
			synonym_acceptance: true,
			paraphrasing_tolerance: "medium",
			out_of_order_points_allowed: true,
		},

		partial_marking_rules: {
			enabled: true,
			correct_method_wrong_answer: true,
			correct_method_percentage: 50,
			incomplete_answer_allowed: true,
			incomplete_threshold: 60,
			keyword_hit_percentage: 70,
			mark_per_keyword: false,
			concept_understanding_weight: 40,
			intermediate_steps_weight: 30,
		},

		feedback_preferences: {
			enabled: true,
			tone: "balanced",
			granularity: "per_question",
			verbosity: "detailed",
			include_positive_points: true,
			include_negative_points: true,
			suggestion_style: "guiding_question",
			show_model_answer: "for_incorrect_only",
			improvement_roadmap: true,
			topic_specific_resources: true,
		},

		annotation_preferences: {
			score_display: "per_question",
			symbol_style: "standard",
			density: "moderate",
			highlight_errors: true,
			color_coding_enabled: true,
		},

		consistency_fairness: {
			cross_student_normalization: true,
			outlier_detection_enabled: true,
			bias_detection_enabled: true,
			anonymized_evaluation: true,
			consistency_check_threshold: 0.85,
			recalibration_trigger_variance: 0.15,
		},

		learning_adaptation: {
			adaptive_feedback_enabled: true,
			student_profiling_enabled: false,
			difficulty_calibration: true,
			learning_style_adaptation: false,
			performance_trend_analysis: true,
			personalized_recommendations: true,
			adaptation_sensitivity: "medium",
		},

		subject_specific_rules: {
			subject_name: subject,
			terminology_strictness: "moderate",
			formula_notation_flexibility: true,
			diagram_labeling_required: true,
			unit_consistency_required: true,
			significant_figures_enforcement: false,
			step_by_step_required: false,
			custom_rubrics: [],
		},

		question_type_rules: {
			mcq: {
				multiple_correct_policy: "all_or_nothing",
				negative_marking: 0.25,
				unanswered_policy: "zero",
			},
			short_answer: {
				word_limit_enforcement: "guideline",
				keyword_minimum_required: 3,
				format_strictness: "moderate",
			},
			long_answer: {
				word_limit_enforcement: "guideline",
				structure_importance: 30,
				argument_coherence_weight: 40,
				evidence_citation_required: false,
			},
			numerical: {
				precision_required: 2,
				unit_mandatory: true,
				range_tolerance_percent: 2,
				scientific_notation_required: false,
			},
			diagram: {
				labeling_completeness_weight: 50,
				accuracy_weight: 50,
				neatness_consideration: false,
			},
		},

		audit_compliance: {
			version_control_enabled: true,
			timestamp_precision: "second",
			evaluator_transparency_level: "full",
			decision_trail_logging: true,
			manual_override_tracking: true,
			compliance_report_generation: false,
			gdpr_anonymization: true,
		},

		quality_metrics: {
			inter_rater_reliability_target: 0.85,
			confidence_score_threshold: 0.75,
			human_review_trigger_threshold: 0.6,
			quality_assurance_sampling_rate: 0.1,
			performance_monitoring_enabled: true,
			error_rate_alerting: true,
			continuous_improvement_feedback: true,
		},

		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	};
}

// ============= Preset Configurations =============

export const EVALUATOR_PRESETS = {
	STRICT_ACADEMIC: {
		name: "Strict Academic",
		description: "High standards for academic excellence",
		overrides: {
			leniency_strictness: { global_leniency_level: "strict" as LeniencyLevel },
			partial_marking_rules: { enabled: false },
		},
	},
	LENIENT_LEARNING: {
		name: "Lenient Learning",
		description: "Encouraging environment for learning",
		overrides: {
			leniency_strictness: {
				global_leniency_level: "lenient" as LeniencyLevel,
			},
			feedback_preferences: { tone: "encouraging" as FeedbackTone },
		},
	},
	COMPETITIVE_EXAM: {
		name: "Competitive Exam",
		description: "Configuration for competitive examinations",
		overrides: {
			scoring_methodology: {
				negative_marking_enabled: true,
				scoring_scheme: "decimal_quarter" as ScoringScheme,
			},
			leniency_strictness: { global_leniency_level: "strict" as LeniencyLevel },
		},
	},
	UPSC_MAINS: {
		name: "UPSC Mains",
		description: "Optimized for UPSC Mains evaluation",
		overrides: {
			feedback_preferences: {
				verbosity: "comprehensive" as FeedbackVerbosity,
				granularity: "per_point" as const,
			},
			partial_marking_rules: {
				enabled: true,
				concept_understanding_weight: 60,
			},
		},
	},
} as const;
