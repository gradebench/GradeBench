const API_BASE_URL = "http://localhost:8083/grade/v1";

export interface AcademicTest {
	id: string;
	name: string;
	test_type: string;
	status: string;
	question_paper_url: string;
	model_answer_paper_url: string | null;
	total_marks: number;
	created_at: string;
	updated_at: string;
	dynamic_rubric: Record<string, unknown> | null;
}
export async function getAcademicTest(testId: string): Promise<AcademicTest> {
	try {
		const response = await fetch(`${API_BASE_URL}/academic-tests/${testId}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch academic test: ${response.statusText}`);
		}

		const data = await response.json();

		if (data.success && data.data) {
			return data.data;
		}
		return data.data || data;
	} catch (error) {
		console.error("Error fetching academic test:", error);
		throw error;
	}
}

export async function generateDynamicRubric(testId: string): Promise<void> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/academic-tests/${testId}/generate-dynamic-rubric`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.error ||
					`Failed to generate dynamic rubric: ${response.statusText}`,
			);
		}
	} catch (error) {
		console.error("Error generating dynamic rubric:", error);
		throw error;
	}
}

export async function pollForDynamicRubric(
	testId: string,
	intervalMs: number = 3000,
	maxAttempts: number = 100,
): Promise<AcademicTest> {
	let attempts = 0;

	return new Promise((resolve, reject) => {
		const pollInterval = setInterval(async () => {
			try {
				attempts++;

				const test = await getAcademicTest(testId);

				if (test.dynamic_rubric || attempts >= maxAttempts) {
					clearInterval(pollInterval);
					resolve(test);
				}
			} catch (error) {
				clearInterval(pollInterval);
				reject(error);
			}
		}, intervalMs);
	});
}
