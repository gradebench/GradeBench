/**
 * Usage Examples and Quick Reference for the API Client
 *
 * This file demonstrates the key features of the type-safe fetch wrapper.
 * All responses are wrapped in StandardResponse format.
 * For complete documentation, see README.md and USAGE_EXAMPLES.md
 *
 * NEW FEATURES (2024-10-20):
 * - maxResponseSize: Optional size limit protection
 * - Edge case handling: Empty bodies, 304 Not Modified, 1xx informational
 * - Better error messages: Body previews for debugging
 * - Enhanced InvalidResponseError: Includes response previews
 */

import {
	createApiClient,
	InvalidResponseError,
	TimeoutError,
} from "./index.js";
import type { StandardResponse } from "./types/response.js";

// ============================================
// 1. BASIC SETUP
// ============================================

// Create a configured API client
const api = createApiClient({
	baseURL: "https://api.example.com",
	defaultHeaders: {
		Authorization: "Bearer your-token-here",
		"X-API-Version": "2024-10-20",
	},
	defaultTimeout: 10000, // 10 seconds
	maxResponseSize: 5 * 1024 * 1024, // NEW: 5MB limit (optional safety feature)
});

// ============================================
// 2. TYPE DEFINITIONS
// ============================================

interface User {
	id: number;
	name: string;
	email: string;
	createdAt: string;
}

interface CreateUserPayload {
	name: string;
	email: string;
	password: string;
}

// Types are now imported from the StandardResponse

// ============================================
// 3. GET REQUESTS
// ============================================

async function exampleGetRequest() {
	// Simple GET request with type safety - returns StandardResponse
	const response = await api.get<User>("/users/1");

	if (response.success && response.data) {
		console.log(response.data.name); // TypeScript knows data is User
	} else if (response.error) {
		console.error("API Error:", response.error.message);
	}

	// GET with query parameters
	const usersResponse = await api.get<User[]>("/users", {
		params: {
			page: 1,
			limit: 20,
			role: "admin",
		},
	});

	if (usersResponse.success && usersResponse.data) {
		console.log(`Found ${usersResponse.data.length} users`);
	}
}

// ============================================
// 4. POST REQUESTS
// ============================================

async function examplePostRequest() {
	// Body is automatically JSON.stringify'd
	// Content-Type: application/json is automatically set
	const response = await api.post<User>("/users", {
		name: "John Doe",
		email: "john@example.com",
		password: "secure-password-123",
	});

	if (response.success && response.data) {
		console.log(`Created user with ID: ${response.data.id}`);
	} else if (response.error) {
		console.error("Failed to create user:", response.error.message);
	}
}

// ============================================
// 5. ERROR HANDLING
// ============================================

async function exampleErrorHandling() {
	// With StandardResponse, errors are returned in the response, not thrown
	const response = await api.get<User>("/users/999");

	if (response.success && response.data) {
		// Success case - data is available
		console.log("User found:", response.data);
	} else if (response.error) {
		// Error case - check the error object
		console.error("API Error:", response.error.message);
		console.error("Error Code:", response.error.code);

		// Handle specific status codes
		switch (response.status_code) {
			case 404:
				console.log("User not found");
				break;
			case 401:
				console.log("Unauthorized - redirecting to login");
				// window.location.href = '/login';
				break;
			case 403:
				console.log("Access forbidden");
				break;
			case 429:
				console.log("Rate limited. Please try again later.");
				break;
			case 500:
			case 502:
			case 503:
				console.log("Server error. Please try again later.");
				break;
			default:
				console.log("An unexpected error occurred");
		}

		// Access error details if available
		if (response.error.details) {
			console.log("Error details:", response.error.details);
		}
	}

	// Only network errors or invalid response formats are thrown
	try {
		await api.get<User>("/users/1");
	} catch (error) {
		// Handle timeout errors (still thrown)
		if (error instanceof TimeoutError) {
			console.error(`Request timed out after ${error.timeout}ms`);
			console.log("Please check your connection and try again.");
		}

		// Handle invalid response format (not StandardResponse)
		if (error instanceof InvalidResponseError) {
			console.error("Response does not match expected format");
			console.error("Body:", error.body);

			// NEW: Check for body preview in error (added for better debugging)
			if (typeof error.body === "object" && error.body !== null) {
				const errorBody = error.body as Record<string, unknown>;

				// Check for enhanced error format with preview
				if ("preview" in errorBody) {
					console.error("Response preview:", errorBody.preview);
				}

				// Check for max size error
				if ("maxSize" in errorBody && "actualSize" in errorBody) {
					console.error(
						`Response too large: ${errorBody.actualSize} bytes (max: ${errorBody.maxSize})`,
					);
				}

				// Check for parse error with details
				if ("error" in errorBody && "message" in errorBody) {
					console.error(`Parse error: ${errorBody.message}`);
				}
			}
		}

		// Handle network errors
		if (error instanceof TypeError) {
			console.error("Network error:", error.message);
			console.log("Unable to connect. Check your internet connection.");
		}
	}
}

// ============================================
// 6. EDGE CASE HANDLING (NEW!)
// ============================================

async function exampleEdgeCases() {
	// Edge Case 1: Empty response bodies (now handled gracefully)
	// Some misconfigured APIs return empty body with JSON content-type
	const emptyResponse = await api.get("/empty-endpoint");
	console.log(emptyResponse.status_code); // 200
	console.log(emptyResponse.data); // null (no error thrown!)
	console.log(emptyResponse.success); // true

	// Edge Case 2: HTTP 304 Not Modified (cache validation)
	const cachedResponse = await api.get("/resource", {
		headers: {
			"If-None-Match": "etag-12345",
		},
	});

	if (cachedResponse.status_code === 304) {
		console.log("Resource not modified - use cached version");
		console.log(cachedResponse.data); // null
	}

	// Edge Case 3: HTTP 204 No Content (common with DELETE operations)
	const deleteResponse = await api.delete("/users/1");

	if (deleteResponse.status_code === 204) {
		console.log("Successfully deleted - no content returned");
		console.log(deleteResponse.data); // null
		console.log(deleteResponse.success); // true
	}

	// Edge Case 4: Response size limit protection (NEW!)
	const limitedApi = createApiClient({
		baseURL: "https://api.example.com",
		maxResponseSize: 1024 * 1024, // 1MB limit
	});

	try {
		// If backend returns response larger than 1MB
		await limitedApi.get("/huge-data");
	} catch (error) {
		if (error instanceof InvalidResponseError) {
			const body = error.body as Record<string, unknown>;
			console.error("Response too large!");
			console.log("Max allowed:", body.maxSize);
			console.log("Actual size:", body.actualSize);
			console.log("Preview:", body.preview);
		}
	}

	// Edge Case 5: Better error messages with body preview (NEW!)
	try {
		// Backend returns HTML instead of JSON (misconfigured)
		await api.get("/broken-endpoint");
	} catch (error) {
		if (error instanceof InvalidResponseError) {
			const body = error.body as Record<string, unknown>;

			console.error("Error:", body.error);
			console.error("Details:", body.message);
			console.error(
				"Response preview:",
				body.preview, // First 200 chars of actual response
			);
			// Output might be: "<html><body>Error 500</body></html>..."
		}
	}

	// Edge Case 6: 1xx Informational responses (rare but handled)
	const uploadResponse = await api.request("/long-upload", {
		method: "POST",
		body: JSON.stringify({ data: "large file" }),
	});

	// If server sends 102 Processing
	if (uploadResponse.status_code === 102) {
		console.log("Server is still processing...");
		console.log(uploadResponse.success); // false (1xx not considered success)
		console.log(uploadResponse.data); // null
	}
}
// ============================================
// 7. ADVANCED FEATURES
// ============================================

async function exampleAdvancedFeatures() {
	// Custom timeout for slow endpoints
	await api.get("/reports/generate", {
		timeout: 60000, // 60 seconds
	});

	// Manual cancellation with AbortController
	const controller = new AbortController();

	const searchPromise = api.get<User[]>("/users/search", {
		params: { q: "john" },
		signal: controller.signal,
	});

	// Cancel after 5 seconds
	setTimeout(() => controller.abort(), 5000);

	try {
		const results = await searchPromise;
		console.log(results);
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			console.log("Search cancelled");
		}
	}
}

// ============================================
// 8. RETRY LOGIC
// ============================================

async function fetchWithRetry<T>(
	fetcher: () => Promise<StandardResponse<T>>,
	maxRetries = 3,
	delay = 1000,
): Promise<StandardResponse<T>> {
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			const response = await fetcher();

			// Only retry on 5xx server errors
			const shouldRetry =
				response.status_code >= 500 && response.status_code < 600;
			const isLastAttempt = attempt === maxRetries - 1;

			if (!shouldRetry || isLastAttempt) {
				return response;
			}

			// Exponential backoff
			const backoffDelay = delay * 2 ** attempt;
			console.log(
				`Retry attempt ${attempt + 1} after ${backoffDelay}ms (status ${response.status_code})`,
			);
			await new Promise((resolve) => setTimeout(resolve, backoffDelay));
		} catch (error) {
			// Only network errors are thrown (not HTTP errors)
			const isLastAttempt = attempt === maxRetries - 1;

			if (isLastAttempt) {
				throw error;
			}

			// Exponential backoff
			const backoffDelay = delay * 2 ** attempt;
			console.log(
				`Retry attempt ${attempt + 1} after ${backoffDelay}ms (network error)`,
			);
			await new Promise((resolve) => setTimeout(resolve, backoffDelay));
		}
	}

	throw new Error("Max retries exceeded");
}

async function exampleRetry() {
	// Automatically retry on server errors (5xx)
	const response = await fetchWithRetry(() => api.get<User>("/users/1"));

	if (response.success && response.data) {
		console.log("User:", response.data);
	}
}

// ============================================
// 9. MULTIPLE CLIENT INSTANCES
// ============================================

function exampleMultipleClients() {
	// Authenticated client
	const authApi = createApiClient({
		baseURL: "https://api.example.com",
		defaultHeaders: {
			Authorization: "Bearer user-token",
		},
	});

	// Public client
	const publicApi = createApiClient({
		baseURL: "https://api.example.com",
	});

	// Third-party API client
	const stripeApi = createApiClient({
		baseURL: "https://api.stripe.com",
		defaultHeaders: {
			Authorization: "Bearer sk_test_...",
		},
		maxResponseSize: 2 * 1024 * 1024, // 2MB limit for Stripe API
	});

	return { authApi, publicApi, stripeApi };
}

// ============================================
// 10. COMPLETE EXAMPLE WITH ALL METHODS
// ============================================

async function completeExample() {
	try {
		// GET - Fetch a user
		const userResponse = await api.get<User>("/users/1");
		if (userResponse.success && userResponse.data) {
			console.log("Fetched user:", userResponse.data.name);
		}

		// POST - Create a new user
		const newUserResponse = await api.post<User>("/users", {
			name: "Jane Doe",
			email: "jane@example.com",
			password: "password123",
		} satisfies CreateUserPayload);

		if (!newUserResponse.success || !newUserResponse.data) {
			console.error("Failed to create user:", newUserResponse.error?.message);
			return;
		}

		console.log("Created user:", newUserResponse.data.id);
		const userId = newUserResponse.data.id;

		// PUT - Full update
		const updatedUserResponse = await api.put<User>(`/users/${userId}`, {
			name: "Jane Smith",
			email: "jane.smith@example.com",
			password: "newpassword",
		});
		if (updatedUserResponse.success && updatedUserResponse.data) {
			console.log("Updated user:", updatedUserResponse.data.name);
		}

		// PATCH - Partial update
		const patchedUserResponse = await api.patch<User>(`/users/${userId}`, {
			name: "Jane Johnson",
		});
		if (patchedUserResponse.success && patchedUserResponse.data) {
			console.log("Patched user:", patchedUserResponse.data.name);
		}

		// DELETE - Remove user
		const deleteResponse = await api.delete(`/users/${userId}`);
		if (deleteResponse.success) {
			console.log("Deleted user");
		}
	} catch (error) {
		// Only non-HTTP errors are thrown (network, timeout, invalid response)
		if (error instanceof TimeoutError) {
			console.error(`Timeout after ${error.timeout}ms`);
		} else if (error instanceof InvalidResponseError) {
			console.error("Invalid response format:", error.body);
		} else {
			console.error("Unexpected error:", error);
		}
	}
}

// ============================================
// EXPORT FOR TESTING
// ============================================

export {
	exampleGetRequest,
	examplePostRequest,
	exampleErrorHandling,
	exampleEdgeCases,
	exampleAdvancedFeatures,
	exampleRetry,
	exampleMultipleClients,
	completeExample,
	fetchWithRetry,
};
