export interface QuickTest {
	id: string;
	name: string;
	status: "draft" | "uploading" | "evaluating" | "completed" | "failed";
	totalQuestions?: number;
	evaluatedQuestions?: number;
	score?: number;
	createdAt: string;
	updatedAt?: string;
}

export interface QuickTestQuestion {
	id: string;
	testId: string;
	question: string;
	modelAnswer?: string;
	studentAnswer?: string;
	score?: number;
	maxScore: number;
	feedback?: string;
}
