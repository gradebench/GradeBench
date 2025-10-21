import { createApiClient, type StandardResponse } from "@gb/fetch";
import type { FlagResult } from "@/types/flag.types.js";

const launchpadAPI = createApiClient({
	baseURL:
		process.env.NODE_ENV === "production"
			? process.env.NEXT_PUBLIC_API_URL
			: "http://localhost:8081",

	defaultHeaders: {
		"Content-Type": "application/json",
	},

	defaultTimeout: 10000,
});

export const evaluateFlag = (
	name: string,
): Promise<StandardResponse<FlagResult>> => {
	return launchpadAPI.get<FlagResult>(`/launchpad/v1/eval/flags/${name}`);
};
