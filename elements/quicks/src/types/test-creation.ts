// Test Creation Types
import type { EvaluatorConfigurationV3 } from "./evaluator-config-v3";

export type ExamCategory =
	| "upsc"
	| "engineering"
	| "medical"
	| "banking"
	| "school"
	| "university"
	| "competitive"
	| "certification"
	| "custom";

export type UPSCSubject =
	| "general_studies_1"
	| "general_studies_2"
	| "general_studies_3"
	| "general_studies_4"
	| "essay"
	| "optional_subject";

export type QuestionType =
	| "mcq"
	| "short_answer"
	| "long_answer"
	| "numerical"
	| "diagram"
	| "code"
	| "fill_blank"
	| "true_false"
	| "matching"
	| "essay";

export interface TestQuestion {
	id: string;
	questionNumber: number;
	questionText: string;
	questionType: QuestionType;
	marks: number;
	wordLimit?: number;
	timeLimit?: number; // in minutes
	subQuestions?: TestQuestion[];
	mandatory: boolean;
}

export interface QuestionPaper {
	id: string; // uuid
	raw_file_name?: string | null;
	raw_data_url: string;
	digitized_data_url?: string | null;

	subject?: string | null;
	exam_type?: string | null;
	total_marks?: number | null;
	duration_minutes?: number | null;
	academic_year?: string | null;
	grade_level?: string | null;
	institution?: string | null;
	instructions?: string[] | null;

	updated_at?: string | null; // ISO timestamp
	created_at?: string | null; // ISO timestamp
}

export interface TestBasicInfo {
	testId: string;
	title: string;
	category: ExamCategory;
	subject: string; // Can be UPSCSubject or custom
	customSubject?: string;
	totalMarks: number;
	totalQuestions: number;
	duration: number; // in minutes
	description?: string;
	instructions?: string;
	/** Optional list of associated question papers (uploaded files and metadata) */
	questionPapers?: QuestionPaper[];
	createdAt: string;
	updatedAt?: string;
}

// Comprehensive model answer types matching JSON schema
export interface NumericalAnswer {
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

export interface KeywordItem {
	keyword: string;
	is_mandatory?: boolean;
	weight?: number;
	synonyms?: string[];
}

export interface ConceptItem {
	concept_name: string;
	concept_description: string;
	weight?: number;
}

export interface CodeAnswer {
	language: string;
	expected_code: string;
	test_cases?: {
		input: string;
		expected_output: string;
		marks_weight?: number;
	}[];
	required_constructs?: string[];
}

export interface DiagramAnswer {
	reference_diagram_url?: string;
	required_elements?: {
		element_name: string;
		element_type: string;
		is_mandatory?: boolean;
		coordinates?: { x: number; y: number };
	}[];
}

export interface MethodStep {
	step_number: number;
	step_description: string;
	step_marks: number;
	required_keywords?: string[];
}

export interface EssayCriteria {
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

export interface AcceptableVariation {
	variation_description: string;
	variation_answer?: string;
	marks_awarded: number;
}

export interface AnswerComponent {
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
	marks_allocated: number;
	is_mandatory?: boolean;
	exact_answer?: string;
	numerical_answer?: NumericalAnswer;
	keywords?: KeywordItem[];
	concepts?: ConceptItem[];
	code_answer?: CodeAnswer;
	diagram_answer?: DiagramAnswer;
	method_steps?: MethodStep[];
	essay_criteria?: EssayCriteria;
	acceptable_variations?: AcceptableVariation[];
}

export interface CommonError {
	error_description: string;
	penalty: number;
	feedback_template?: string;
}

export interface QuestionAnswer {
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
	answer_components: AnswerComponent[];
	overall_guidance?: string;
	common_errors?: CommonError[];
}

export interface ModelAnswerKeyData {
	model_answer_id: string;
	paper_id: string;
	question_answers: QuestionAnswer[];
	evaluator_notes?: string;
	approved_by?: string;
	approval_timestamp?: string;
	version?: string;
	created_at?: string;
	updated_at?: string;
}

// Legacy interface for backward compatibility
export interface ModelAnswer {
	questionId: string;
	answerText: string;
	keyPoints: string[];
	keywords: string[];
	concepts: string[];
	acceptableVariations: string[];
	mandatoryComponents: string[];
	optionalComponents: string[];
	scoringBreakdown?: {
		component: string;
		marks: number;
		description: string;
	}[];
}

export interface TestCreationData {
	basicInfo: TestBasicInfo;
	questions: TestQuestion[];
	modelAnswers: ModelAnswer[];
	modelAnswerKeyData?: ModelAnswerKeyData;
	evaluatorConfig?: EvaluatorConfigurationV3;
}
export interface DynamicRubric {
	id: string;
	testId: string;
	questionId: string;
	criteria: RubricCriterion[];
	totalMarks: number;
	generatedAt: string;
	version: number;
}

export interface RubricCriterion {
	id: string;
	name: string;
	description: string;
	maxMarks: number;
	weight: number;
	indicators: {
		level: "excellent" | "good" | "satisfactory" | "poor" | "inadequate";
		description: string;
		marksRange: { min: number; max: number };
	}[];
}
