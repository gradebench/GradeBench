export interface QuickTest {
	id: string;
	name: string;
	status: "draft" | "uploading" | "evaluating" | "completed" | "failed";
	createdAt: Date;
	updatedAt: Date;
	totalQuestions?: number;
	evaluatedQuestions?: number;
	score?: number;
}

export interface TestHistory {
	tests: QuickTest[];
	total: number;
	page: number;
	pageSize: number;
}
