/**
 * Answer Papers API utilities for handling uploads, digitization, and related operations
 */

import { GRADE_API_BASE as API_BASE_URL } from "./api";

export interface AnswerPaper {
	id: string;
	academic_test_id: string;
	student_name: string;
	student_id: string | null;
	raw_document_url: string;
	processed_document_url: string | null;
	digitized_document_url: string | null;
	annotated_document_url: string | null;
	evaluation_status: "pending" | "in_progress" | "completed" | "failed";
	total_score: number | null;
	max_score: number | null;
	percentage: number | null;
	grade: string | null;
	submitted_at: string;
	evaluated_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface PreSignedUrlResponse {
	upload_url: string;
	file_url: string;
}

export interface UploadBatchResponse {
	answer_papers: PreSignedUrlResponse[];
}

export interface AnswerPaperCreateRequest {
	academic_test_id: string;
	name: string;
	raw_document_url: string;
}

/**
 * Fetch all answer papers for an academic test
 */
export async function getAnswerPapers(testId: string): Promise<AnswerPaper[]> {
	try {
		// Use the academic-test specific answer-papers endpoint
		const response = await fetch(
			`${API_BASE_URL}/answer-papers/academic-test/${testId}`,
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch answer papers: ${response.statusText}`);
		}

		const data = await response.json().catch(() => null);

		// Normalize expected shapes: data.data.answer_papers or data.data['answer-papers']
		const raw =
			(data?.data && (data.data.answer_papers || data.data["answer-papers"])) ||
			data?.data ||
			[];

		if (!Array.isArray(raw)) return [];

		// If the shape already matches AnswerPaper[], do a lightweight normalization
		return raw.map((r: unknown) => {
			const o = r as Record<string, unknown>;
			return {
				id: typeof o.id === "string" ? o.id : String(o.id ?? ""),
				academic_test_id:
					typeof o.academic_test_id === "string"
						? o.academic_test_id
						: String(o.academic_test_id ?? ""),
				student_name: (o.name as string) || (o.student_name as string) || "",
				student_id: typeof o.student_id === "string" ? o.student_id : null,
				raw_document_url:
					(o.raw_document_url as string) || (o.rawDocumentUrl as string) || "",
				processed_document_url: (o.processed_document_url as string) || null,
				digitized_document_url: (o.digitized_document_url as string) || null,
				annotated_document_url: (o.annotated_document_url as string) || null,
				evaluation_status:
					typeof o.evaluation_status === "string" &&
					["pending", "in_progress", "completed", "failed"].includes(
						o.evaluation_status as string,
					)
						? (o.evaluation_status as AnswerPaper["evaluation_status"])
						: "pending",
				total_score: typeof o.total_score === "number" ? o.total_score : null,
				max_score: typeof o.max_score === "number" ? o.max_score : null,
				percentage: typeof o.percentage === "number" ? o.percentage : null,
				grade: typeof o.grade === "string" ? o.grade : null,
				submitted_at:
					(o.updated_at as string) ||
					(o.created_at as string) ||
					new Date().toISOString(),
				evaluated_at:
					typeof o.evaluated_at === "string"
						? (o.evaluated_at as string)
						: null,
				created_at: (o.created_at as string) || new Date().toISOString(),
				updated_at:
					(o.updated_at as string) ||
					(o.created_at as string) ||
					new Date().toISOString(),
			} as AnswerPaper;
		});
	} catch (error) {
		console.error("Error fetching answer papers:", error);
		throw error;
	}
}
/**
 * Fetch answer papers using the alternate endpoint
 * GET /grade/v1/answer-papers/academic-test/:id
 * This endpoint returns `data['answer-papers']` in some backends; adapt to
 * that shape and normalize into `AnswerPaper[]`.
 */
export async function getAnswerPapersByAcademicTest(
	testId: string,
): Promise<AnswerPaper[]> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/answer-papers/academic-test/${testId}`,
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch answer papers: ${response.statusText}`);
		}

		const data = await response.json().catch(() => null);

		// Support both `data.answer_papers` and `data['answer-papers']` shapes
		const rawPapers: unknown =
			(data?.data && (data.data["answer-papers"] || data.data.answer_papers)) ||
			data?.data ||
			[];

		if (!Array.isArray(rawPapers)) return [];

		const toStr = (v: unknown): string => (typeof v === "string" ? v : "");
		const toNullableStr = (v: unknown): string | null =>
			typeof v === "string" ? v : v === null ? null : null;
		const toNumberOrNull = (v: unknown): number | null =>
			typeof v === "number" ? v : null;

		const normalize = (obj: unknown): AnswerPaper => {
			const o = obj as Record<string, unknown>;
			const id = toStr(o.id) || toStr(o.Id) || "";
			const created_at = toStr(o.created_at) || new Date().toISOString();
			const updated_at = toStr(o.updated_at) || created_at;

			const rawEval = toStr(o.evaluation_status);
			const allowed = ["pending", "in_progress", "completed", "failed"];
			const evalStatus = allowed.includes(rawEval)
				? (rawEval as AnswerPaper["evaluation_status"])
				: "pending";

			return {
				id,
				academic_test_id:
					toStr(o.academic_test_id) || toStr(o.academicTestId) || testId,
				student_name: toStr(o.name) || toStr(o.student_name) || "",
				student_id: toNullableStr(o.student_id),
				raw_document_url:
					toStr(o.raw_document_url) || toStr(o.rawDocumentUrl) || "",
				processed_document_url:
					toNullableStr(o.processed_document_url) ||
					toNullableStr(o.processedDocumentUrl),
				digitized_document_url:
					toNullableStr(o.digitized_document_url) ||
					toNullableStr(o.digitizedDocumentUrl),
				annotated_document_url:
					toNullableStr(o.annotated_document_url) ||
					toNullableStr(o.annotatedDocumentUrl),
				evaluation_status: evalStatus,
				total_score: toNumberOrNull(o.total_score),
				max_score: toNumberOrNull(o.max_score),
				percentage: toNumberOrNull(o.percentage),
				grade: toNullableStr(o.grade),
				submitted_at:
					toStr(o.updated_at) ||
					toStr(o.created_at) ||
					new Date().toISOString(),
				evaluated_at: toNullableStr(o.evaluated_at),
				created_at,
				updated_at,
			};
		};

		return (rawPapers as unknown[]).map((r) => normalize(r));
	} catch (error) {
		console.error("Error fetching answer papers (by academic test):", error);
		throw error;
	}
}

/**
 * Get pre-signed URLs for file uploads
 */
export async function getPreSignedUrls(
	fileNames: string[],
): Promise<PreSignedUrlResponse[]> {
	if (fileNames.length > 100) {
		throw new Error("Maximum 100 files per upload request");
	}

	// Validate file names
	for (const fileName of fileNames) {
		if (fileName.length < 1 || fileName.length > 255) {
			throw new Error(
				`Invalid file name length: ${fileName} (must be 1-255 characters)`,
			);
		}
		if (!fileName.toLowerCase().endsWith(".pdf")) {
			throw new Error(`Only PDF files allowed: ${fileName}`);
		}
	}

	try {
		const response = await fetch(`${API_BASE_URL}/answer-papers/upload/raw`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				// API expects the key `file_name` (singular) with an array of file names
				file_names: fileNames,
			}),
		});

		if (!response.ok) {
			// Try to parse JSON error body and extract a useful message
			let errorBody: unknown = null;
			try {
				errorBody = await response.json();
			} catch {
				// ignore parse errors
			}

			let msg = `Failed to get pre-signed URLs: ${response.status} ${response.statusText}`;
			if (errorBody && typeof errorBody === "object") {
				const eb = errorBody as Record<string, unknown>;
				msg =
					(typeof eb.error === "string" && eb.error) ||
					(typeof eb.message === "string" && eb.message) ||
					(typeof eb.status_message === "string" && eb.status_message) ||
					JSON.stringify(errorBody);
			} else if (typeof errorBody === "string") {
				msg = errorBody;
			}

			throw new Error(msg);
		}

		const parsed = await response.json().catch(() => null);

		// Normalize response shapes: prefer parsed.data.answer_papers or parsed.answer_papers
		const candidates: unknown =
			(parsed &&
				(parsed.data?.answer_papers || parsed.data?.["answer-papers"])) ||
			parsed?.answer_papers ||
			parsed ||
			[];

		if (!Array.isArray(candidates)) return [];

		// Map to PreSignedUrlResponse if needed
		return (candidates as unknown[]).map((c) => {
			const o = c as Record<string, unknown>;
			return {
				upload_url: (o.upload_url as string) || (o.uploadUrl as string) || "",
				file_url: (o.file_url as string) || (o.fileUrl as string) || "",
			} as PreSignedUrlResponse;
		});
	} catch (error) {
		console.error("Error getting pre-signed URLs:", error);
		throw error;
	}
}

/**
 * Upload a PDF file to S3 using pre-signed URL
 */
export async function uploadFileToS3(
	uploadUrl: string,
	file: File,
	onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
	if (!file.type.includes("pdf")) {
		throw new Error("Only PDF files allowed");
	}

	try {
		const xhr = new XMLHttpRequest();

		if (onProgress) {
			xhr.upload.addEventListener("progress", (e) => {
				if (e.lengthComputable) {
					onProgress(e.loaded, e.total);
				}
			});
		}

		return new Promise((resolve, reject) => {
			xhr.addEventListener("load", () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve();
				} else {
					reject(new Error(`Upload failed with status ${xhr.status}`));
				}
			});

			xhr.addEventListener("error", () => {
				reject(new Error("Upload failed"));
			});

			xhr.addEventListener("abort", () => {
				reject(new Error("Upload aborted"));
			});

			xhr.open("PUT", uploadUrl);
			xhr.setRequestHeader("Content-Type", "application/pdf");
			xhr.send(file);
		});
	} catch (error) {
		console.error("Error uploading file to S3:", error);
		throw error;
	}
}

/**
 * Create an answer paper record
 */
export async function createAnswerPaper(
	request: AnswerPaperCreateRequest,
): Promise<AnswerPaper> {
	try {
		const response = await fetch(`${API_BASE_URL}/answer-papers`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.error ||
					`Failed to create answer paper: ${response.statusText}`,
			);
		}

		const data = await response.json();
		if (data.success && data.data) {
			return data.data;
		}
		return data.data || data;
	} catch (error) {
		console.error("Error creating answer paper:", error);
		throw error;
	}
}

/**
 * Trigger bulk digitization for an academic test
 */
export async function triggerDigitization(testId: string): Promise<void> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/answer-papers/digitize/${testId}`,
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
					`Failed to trigger digitization: ${response.statusText}`,
			);
		}
	} catch (error) {
		console.error("Error triggering digitization:", error);
		throw error;
	}
}

/**
 * Delete an answer paper
 */
export async function deleteAnswerPaper(paperId: string): Promise<void> {
	try {
		const response = await fetch(`${API_BASE_URL}/answer-papers/${paperId}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.error ||
					`Failed to delete answer paper: ${response.statusText}`,
			);
		}
	} catch (error) {
		console.error("Error deleting answer paper:", error);
		throw error;
	}
}

/**
 * Execute the complete upload sequence
 */
export async function uploadAnswerPapers(
	testId: string,
	files: File[],
	fileNames: string[],
	onProgress?: (fileIndex: number, loaded: number, total: number) => void,
): Promise<AnswerPaper[]> {
	const createdPapers: AnswerPaper[] = [];

	try {
		// Step 1: Get pre-signed URLs
		const preSignedUrls = await getPreSignedUrls(fileNames);

		if (preSignedUrls.length !== files.length) {
			throw new Error("Mismatch between requested URLs and files");
		}

		// Step 2: Upload files to S3
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const preSignedUrl = preSignedUrls[i];

			await uploadFileToS3(preSignedUrl.upload_url, file, (loaded, total) => {
				onProgress?.(i, loaded, total);
			});
		}

		// Step 3: Create answer paper records
		for (let i = 0; i < files.length; i++) {
			const preSignedUrl = preSignedUrls[i];
			const file = files[i];

			const paperData = await createAnswerPaper({
				academic_test_id: testId,
				name: file.name.replace(/\.pdf$/i, ""),
				raw_document_url: preSignedUrl.file_url,
			});

			createdPapers.push(paperData);
		}

		// Step 4: Trigger bulk digitization
		await triggerDigitization(testId);

		return createdPapers;
	} catch (error) {
		console.error("Error in upload sequence:", error);
		throw error;
	}
}

/**
 * Poll for processed documents to show real-time updates
 */
export async function pollForProcessedDocuments(
	testId: string,
	intervalMs: number = 3000,
	maxAttempts: number = 100,
): Promise<AnswerPaper[]> {
	let attempts = 0;

	return new Promise((resolve, reject) => {
		const pollInterval = setInterval(async () => {
			try {
				attempts++;
				const papers = await getAnswerPapers(testId);

				const allProcessed = papers.every(
					(p) => p.processed_document_url !== null,
				);

				if (allProcessed || attempts >= maxAttempts) {
					clearInterval(pollInterval);
					resolve(papers);
				}
			} catch (error) {
				clearInterval(pollInterval);
				reject(error);
			}
		}, intervalMs);
	});
}

/**
 * Trigger bulk evaluation for an academic test
 */
export async function startEvaluation(testId: string): Promise<void> {
	try {
		const response = await fetch(`${API_BASE_URL}/tests/${testId}/evaluate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.error ||
					`Failed to trigger evaluation: ${response.statusText}`,
			);
		}
	} catch (error) {
		console.error("Error triggering evaluation:", error);
		throw error;
	}
}

/**
 * Trigger evaluation for a single answer paper
 */
export async function evaluateAnswerPaper(
	paperId: string,
	studentId?: string | null,
): Promise<void> {
	try {
		// Use studentId if available, otherwise fall back to paperId
		// The backend expects a user identifier in the URL to create an agent session
		const id = studentId || paperId;
		const response = await fetch(`${API_BASE_URL}/evaluations/${id}/evaluate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ paper_id: paperId }),
		});

		if (!response.ok) {
			throw new Error(
				`Failed to evaluate answer paper: ${response.statusText}`,
			);
		}
	} catch (error) {
		console.error("Error evaluating answer paper:", error);
		throw error;
	}
}

/**
 * Trigger annotation for a single answer paper
 */
export async function annotateAnswerPaper(
	paperId: string,
	studentId?: string | null,
): Promise<void> {
	try {
		// Use studentId if available, otherwise fall back to paperId
		const id = studentId || paperId;
		const response = await fetch(`${API_BASE_URL}/annotations/${id}/annotate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ paper_id: paperId }),
		});

		if (!response.ok) {
			throw new Error(
				`Failed to annotate answer paper: ${response.statusText}`,
			);
		}
	} catch (error) {
		console.error("Error annotating answer paper:", error);
		throw error;
	}
}
