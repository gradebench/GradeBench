import type { StandardResponse } from "../types/response.js";
import { safeExecute } from "../utils/safe.util.js";

/**
 * Custom error thrown when the response is not in StandardResponse format.
 * This indicates an unexpected response structure from the API.
 */
export class InvalidResponseError extends Error {
	/** The raw response body that failed to match StandardResponse format */
	public readonly body: unknown;

	/** The original Response object from the fetch API */
	public readonly response: Response;

	/**
	 * Creates a new InvalidResponseError instance.
	 *
	 * @param body - The parsed body that doesn't match StandardResponse
	 * @param response - The original Response object
	 */
	constructor(body: unknown, response: Response) {
		super("Response does not conform to StandardResponse format");
		this.name = "InvalidResponseError";
		this.body = body;
		this.response = response;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidResponseError);
		}
	}
}

/**
 * Custom error thrown when a request exceeds the specified timeout.
 */
export class TimeoutError extends Error {
	/** The timeout duration in milliseconds */
	public readonly timeout: number;

	/**
	 * Creates a new TimeoutError instance.
	 *
	 * @param timeout - The timeout duration in milliseconds
	 * @param message - Optional custom error message
	 */
	constructor(timeout: number, message?: string) {
		super(message || `Request timed out after ${timeout}ms`);
		this.name = "TimeoutError";
		this.timeout = timeout;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, TimeoutError);
		}
	}
}

/**
 * Configuration options for creating an API client instance.
 */
export interface ApiClientConfig {
	/** Base URL to prepend to all requests (e.g., "https://api.example.com") */
	baseURL?: string;

	/** Default headers to include in every request */
	defaultHeaders?: HeadersInit;

	/** Default timeout in milliseconds for all requests */
	defaultTimeout?: number;

	/** Maximum allowed response body size in bytes (optional safety limit) */
	maxResponseSize?: number;
}

/**
 * Options for individual API requests.
 * Extends the standard RequestInit with additional custom options.
 */
export interface RequestOptions extends Omit<RequestInit, "body"> {
	/** Request body - automatically stringified if it's an object */
	body?: BodyInit | Record<string, unknown>;

	/** Request timeout in milliseconds (overrides default) */
	timeout?: number;

	/** Query parameters to append to the URL */
	params?: Record<string, string | number | boolean>;
}

/**
 * The API client interface with HTTP method helpers.
 * All methods return StandardResponse with typed data.
 */
export interface ApiClient {
	/**
	 * Performs a GET request.
	 *
	 * @param url - The endpoint URL (relative to baseURL if configured)
	 * @param options - Additional request options
	 * @returns A promise resolving to StandardResponse with typed data
	 */
	get<TResponse = unknown>(
		url: string,
		options?: Omit<RequestOptions, "body" | "method">,
	): Promise<StandardResponse<TResponse>>;

	/**
	 * Performs a POST request.
	 *
	 * @param url - The endpoint URL (relative to baseURL if configured)
	 * @param body - The request body (automatically stringified if object)
	 * @param options - Additional request options
	 * @returns A promise resolving to StandardResponse with typed data
	 */
	post<TResponse = unknown>(
		url: string,
		body?: RequestOptions["body"],
		options?: Omit<RequestOptions, "body" | "method">,
	): Promise<StandardResponse<TResponse>>;

	/**
	 * Performs a PUT request.
	 *
	 * @param url - The endpoint URL (relative to baseURL if configured)
	 * @param body - The request body (automatically stringified if object)
	 * @param options - Additional request options
	 * @returns A promise resolving to StandardResponse with typed data
	 */
	put<TResponse = unknown>(
		url: string,
		body?: RequestOptions["body"],
		options?: Omit<RequestOptions, "body" | "method">,
	): Promise<StandardResponse<TResponse>>;

	/**
	 * Performs a PATCH request.
	 *
	 * @param url - The endpoint URL (relative to baseURL if configured)
	 * @param body - The request body (automatically stringified if object)
	 * @param options - Additional request options
	 * @returns A promise resolving to StandardResponse with typed data
	 */
	patch<TResponse = unknown>(
		url: string,
		body?: RequestOptions["body"],
		options?: Omit<RequestOptions, "body" | "method">,
	): Promise<StandardResponse<TResponse>>;

	/**
	 * Performs a DELETE request.
	 *
	 * @param url - The endpoint URL (relative to baseURL if configured)
	 * @param options - Additional request options
	 * @returns A promise resolving to StandardResponse with typed data
	 */
	delete<TResponse = unknown>(
		url: string,
		options?: Omit<RequestOptions, "body" | "method">,
	): Promise<StandardResponse<TResponse>>;

	/**
	 * Performs a raw fetch request with all the wrapper's enhancements.
	 *
	 * @param url - The endpoint URL (relative to baseURL if configured)
	 * @param options - Request options
	 * @returns A promise resolving to StandardResponse with typed data
	 */
	request<TResponse = unknown>(
		url: string,
		options?: RequestOptions,
	): Promise<StandardResponse<TResponse>>;
}

/**
 * Checks if a value is a plain JavaScript object (not an array, null, or other special types).
 *
 * @param value - The value to check
 * @returns True if the value is a plain object
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value) &&
		Object.prototype.toString.call(value) === "[object Object]"
	);
}

/**
 * Type guard to check if a value is a StandardResponse.
 *
 * @param value - The value to check
 * @returns True if the value matches StandardResponse structure
 */
function isStandardResponse(
	value: unknown,
): value is StandardResponse<unknown> {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const obj = value as Record<string, unknown>;

	return (
		typeof obj.success === "boolean" &&
		typeof obj.status_code === "number" &&
		typeof obj.status_message === "string" &&
		("data" in obj || obj.data === null) &&
		("error" in obj || obj.error === null) &&
		typeof obj.metadata === "object" &&
		obj.metadata !== null
	);
}

/**
 * Merges multiple Headers objects or HeadersInit values.
 *
 * @param sources - The header sources to merge
 * @returns A new Headers object with all merged headers
 */
function mergeHeaders(...sources: (HeadersInit | undefined)[]): Headers {
	const merged = new Headers();

	for (const source of sources) {
		if (!source) continue;

		if (source instanceof Headers) {
			source.forEach((value, key) => {
				merged.set(key, value);
			});
		} else if (Array.isArray(source)) {
			for (const [key, value] of source) {
				merged.set(key, value);
			}
		} else {
			for (const [key, value] of Object.entries(source)) {
				merged.set(key, value);
			}
		}
	}

	return merged;
}

/**
 * Appends query parameters to a URL.
 *
 * @param url - The base URL
 * @param params - The query parameters to append
 * @returns The URL with appended query parameters
 */
function appendQueryParams(
	url: string,
	params?: Record<string, string | number | boolean>,
): string {
	if (!params || Object.keys(params).length === 0) {
		return url;
	}

	const urlObj = new URL(url, "http://localhost"); // Use dummy base for relative URLs
	for (const [key, value] of Object.entries(params)) {
		urlObj.searchParams.append(key, String(value));
	}

	// Return just the pathname + search if it was a relative URL
	return url.startsWith("http")
		? urlObj.toString()
		: `${urlObj.pathname}${urlObj.search}`;
}

/**
 * Attempts to parse a response body as JSON.
 * Always expects StandardResponse format from the API.
 *
 * @param response - The Response object to parse
 * @param maxResponseSize - Optional maximum response size in bytes
 * @returns The parsed StandardResponse body
 * @throws InvalidResponseError if the response doesn't match StandardResponse format
 */
async function parseResponseBody<T>(
	response: Response,
	maxResponseSize?: number,
): Promise<StandardResponse<T>> {
	const contentType = response.headers.get("content-type");
	const contentLength = response.headers.get("content-length");
	const status = response.status;

	// Handle no-content responses (1xx informational, 204 No Content, 304 Not Modified)
	const isNoContentStatus =
		(status >= 100 && status < 200) || // 1xx Informational
		status === 204 || // No Content
		status === 304 || // Not Modified
		contentLength === "0"; // Explicit empty body

	if (isNoContentStatus) {
		// Return a standardized empty response
		return {
			success: status >= 200 && status < 300,
			status_code: status,
			status_message: response.statusText,
			data: null,
			error: null,
			metadata: {
				service: "unknown",
				timestamp: new Date().toISOString(),
			},
		} as StandardResponse<T>;
	}

	// Non-JSON response is not expected
	if (!contentType?.includes("application/json")) {
		throw new InvalidResponseError(
			"Response is not JSON (expected StandardResponse format)",
			response,
		);
	}

	// Read response body as text first (enables better error handling)
	const [text, readError] = await safeExecute(() => response.text());

	if (readError) {
		throw new InvalidResponseError(
			`Failed to read response body: ${readError instanceof Error ? readError.message : String(readError)}`,
			response,
		);
	}

	// Check for empty body (edge case: JSON content-type but no content)
	if (!text || text.trim() === "") {
		// Return synthetic response for empty body
		return {
			success: status >= 200 && status < 300,
			status_code: status,
			status_message: response.statusText,
			data: null,
			error: null,
			metadata: {
				service: "unknown",
				timestamp: new Date().toISOString(),
			},
		} as StandardResponse<T>;
	}

	// Check response size limit if configured
	if (maxResponseSize && text.length > maxResponseSize) {
		throw new InvalidResponseError(
			{
				error: "Response body exceeds maximum size limit",
				maxSize: maxResponseSize,
				actualSize: text.length,
				preview: text.substring(0, 200),
			},
			response,
		);
	}

	// Parse JSON from text
	const [data, parseError] = await safeExecute(() => JSON.parse(text));

	if (parseError) {
		// JSON parsing failed - include preview of malformed content
		throw new InvalidResponseError(
			{
				error: "Failed to parse JSON response",
				message:
					parseError instanceof Error ? parseError.message : String(parseError),
				preview: text.substring(0, 200),
			},
			response,
		);
	}

	// Validate that the response matches StandardResponse structure
	if (!isStandardResponse(data)) {
		throw new InvalidResponseError(data, response);
	}

	return data as StandardResponse<T>;
}

/**
 * Creates a configured API client with reusable settings.
 *
 * This factory function returns an API client instance with convenient
 * HTTP method helpers (get, post, put, patch, delete) that automatically
 * handle JSON serialization, error handling, timeouts, and more.
 *
 * All responses are wrapped in StandardResponse format for consistency.
 *
 * @param config - Configuration options for the API client
 * @returns An API client instance with HTTP method helpers
 *
 * @example
 * ```typescript
 * // Create a client with base configuration
 * const api = createApiClient({
 *   baseURL: 'https://api.example.com',
 *   defaultHeaders: {
 *     'Authorization': 'Bearer your-token-here'
 *   },
 *   defaultTimeout: 5000
 * });
 *
 * // Make a GET request
 * const response = await api.get<User>('/users/1');
 * if (response.success && response.data) {
 *   console.log(response.data.name);
 * }
 *
 * // Make a POST request with body
 * const createResponse = await api.post<User>('/users', {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 * ```
 */
export function createApiClient(config: ApiClientConfig = {}): ApiClient {
	const {
		baseURL = "",
		defaultHeaders = {},
		defaultTimeout,
		maxResponseSize,
	} = config;

	/**
	 * The core request function that handles all the heavy lifting.
	 * Always returns a StandardResponse or throws an error for non-HTTP failures.
	 */
	async function request<TResponse = unknown>(
		url: string,
		options: RequestOptions = {},
	): Promise<StandardResponse<TResponse>> {
		const { body, headers, timeout, params, ...restOptions } = options;

		// Build the full URL
		let fullURL = url;
		if (baseURL && !url.startsWith("http")) {
			fullURL = `${baseURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
		}
		fullURL = appendQueryParams(fullURL, params);

		// Prepare headers
		const mergedHeaders = mergeHeaders(defaultHeaders, headers);

		// Handle body serialization
		let processedBody: BodyInit | undefined;
		if (body !== undefined) {
			if (isPlainObject(body)) {
				processedBody = JSON.stringify(body);

				// Set Content-Type and Accept only if not already set
				if (!mergedHeaders.has("content-type")) {
					mergedHeaders.set("content-type", "application/json");
				}
				if (!mergedHeaders.has("accept")) {
					mergedHeaders.set("accept", "application/json");
				}
			} else {
				processedBody = body as BodyInit;
			}
		}

		// Setup timeout with AbortController
		const effectiveTimeout = timeout ?? defaultTimeout;
		const controller = new AbortController();
		let timeoutId: NodeJS.Timeout | number | undefined;

		if (effectiveTimeout) {
			timeoutId = setTimeout(() => {
				controller.abort();
			}, effectiveTimeout);
		}

		// Merge abort signals if user provided one
		const userSignal = restOptions.signal;
		if (userSignal) {
			// If user's signal is already aborted, abort our controller too
			if (userSignal.aborted) {
				controller.abort();
			} else {
				// Listen for user's signal and abort our controller
				userSignal.addEventListener("abort", () => controller.abort());
			}
		}

		// Make the fetch request using safeExecute
		const [response, fetchError] = await safeExecute(() =>
			fetch(fullURL, {
				...restOptions,
				headers: mergedHeaders,
				body: processedBody,
				signal: controller.signal,
			}),
		);

		// Clear timeout if it was set
		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
		}

		// Handle fetch errors (network errors, timeouts, aborts)
		if (fetchError) {
			// Handle abort/timeout errors
			if (fetchError instanceof Error && fetchError.name === "AbortError") {
				if (effectiveTimeout) {
					throw new TimeoutError(effectiveTimeout);
				}
				// Re-throw if it was a user-initiated abort
				throw fetchError;
			}

			// Re-throw network errors and other fetch failures
			throw fetchError;
		}

		// Parse the response body (always expect StandardResponse format)
		// This will throw InvalidResponseError if format doesn't match
		const standardResponse = await parseResponseBody<TResponse>(
			response,
			maxResponseSize,
		);

		// Return the StandardResponse for all status codes (1xx, 2xx, 3xx, 4xx, 5xx)
		return standardResponse;
	}

	// Return the API client with convenience methods
	return {
		request,

		get<TResponse = unknown>(
			url: string,
			options?: Omit<RequestOptions, "body" | "method">,
		): Promise<StandardResponse<TResponse>> {
			return request<TResponse>(url, { ...options, method: "GET" });
		},

		post<TResponse = unknown>(
			url: string,
			body?: RequestOptions["body"],
			options?: Omit<RequestOptions, "body" | "method">,
		): Promise<StandardResponse<TResponse>> {
			return request<TResponse>(url, { ...options, method: "POST", body });
		},

		put<TResponse = unknown>(
			url: string,
			body?: RequestOptions["body"],
			options?: Omit<RequestOptions, "body" | "method">,
		): Promise<StandardResponse<TResponse>> {
			return request<TResponse>(url, { ...options, method: "PUT", body });
		},

		patch<TResponse = unknown>(
			url: string,
			body?: RequestOptions["body"],
			options?: Omit<RequestOptions, "body" | "method">,
		): Promise<StandardResponse<TResponse>> {
			return request<TResponse>(url, { ...options, method: "PATCH", body });
		},

		delete<TResponse = unknown>(
			url: string,
			options?: Omit<RequestOptions, "body" | "method">,
		): Promise<StandardResponse<TResponse>> {
			return request<TResponse>(url, { ...options, method: "DELETE" });
		},
	};
}

/**
 * Default API client instance (no base configuration).
 * For most use cases, prefer creating your own configured instance with `createApiClient()`.
 */
export const api = createApiClient();
