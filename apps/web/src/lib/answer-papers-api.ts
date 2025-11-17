/**
 * Answer Papers API utilities for handling uploads, digitization, and related operations
 */

const API_BASE_URL = "http://localhost:8083/grade/v1";

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
		const response = await fetch(
			`${API_BASE_URL}/academic-tests/${testId}/answer-papers`,
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch answer papers: ${response.statusText}`);
		}

		const data = await response.json();

		// Handle various response structures
		if (data.success && data.data) {
			return data.data.answer_papers || [];
		}
		return data.data?.answer_papers || data.data || [];
	} catch (error) {
		console.error("Error fetching answer papers:", error);
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
				file_names: fileNames,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.error ||
					`Failed to get pre-signed URLs: ${response.statusText}`,
			);
		}

		const data: UploadBatchResponse = await response.json();
		return data.answer_papers || [];
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
		const response = await fetch(`${API_BASE_URL}/answer-papers/`, {
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
