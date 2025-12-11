export interface FetchWithRetryOptions extends RequestInit {
	retries?: number;
	backoff?: number;
	backoffFactor?: number;
}

export async function fetchWithRetry(
	url: string,
	options: FetchWithRetryOptions = {},
): Promise<Response> {
	const {
		retries = 3,
		backoff = 1000,
		backoffFactor = 2,
		...fetchOptions
	} = options;

	let currentBackoff = backoff;

	for (let i = 0; i <= retries; i++) {
		try {
			const response = await fetch(url, fetchOptions);

			// If success, return response immediately
			if (response.ok) {
				return response;
			}

			// If client error (4xx), likely no point in retrying (except maybe 429), so throw immediately
			// unless we decide otherwise. For now, let's treat 4xx as non-retriable unless 429 or 5xx.
			if (response.status >= 400 && response.status < 500 && response.status !== 429) {
				return response; 
			}
            
            // If it's a 5xx or 429, or fetch failed network-wise (caught below), we retry.
            // But if we returned above, we are done.
            // If we are here, it means response.ok is false, and it wasn't a strict 4xx (so it's 5xx or 429).
            // So we throw to verify retry limit.
            throw new Error(`Request failed with status ${response.status}`);

		} catch (error) {
			// If it's the last attempt, throw the error
			if (i === retries) {
				throw error;
			}

			// Wait before retrying
            console.log(`Fetch failed, retrying in ${currentBackoff}ms...`, error);
			await new Promise((resolve) => setTimeout(resolve, currentBackoff));
			currentBackoff *= backoffFactor;
		}
	}

	// Should be unreachable due to throw above
	throw new Error("Max retries exceeded");
}
