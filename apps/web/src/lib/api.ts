// Client-safe API host. Uses NEXT_PUBLIC_API_BASE_URL when provided.
export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8083";

// Backwards-compatible full API base that includes the path segment used
// by the backend. Many files in the app previously expected the base
// constant to include `/grade/v1` (e.g. `${API_BASE_URL}/academic-tests`).
// Export `GRADE_API_BASE` so callers can opt-in to the versioned prefix.
export const GRADE_API_BASE = `${API_BASE_URL.replace(/\/$/, "")}/grade/v1`;
