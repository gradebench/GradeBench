export const FEATURE_FLAGS = {
	QUICK_TESTS: process.env.NEXT_PUBLIC_ENABLE_QUICK_TESTS === "true",
} as const;
