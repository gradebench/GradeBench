// Test Creation Types
import type { EvaluatorConfiguration } from "./evaluator-config";

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
	evaluatorConfig?: EvaluatorConfiguration;
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
