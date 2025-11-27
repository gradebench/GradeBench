import { createApiClient, type StandardResponse } from "@gb/fetch";
import type { FlagResult } from "../types/flag.types";

const launchpadAPI = createApiClient({
	baseURL: process.env.NEXT_PUBLIC_API_URL as string,

	defaultHeaders: {
		"Content-Type": "application/json",
	},

	defaultTimeout: 10000,
});

export const evaluateFlag = async (
	name: string,
): Promise<StandardResponse<FlagResult>> => {
	try {
		return await launchpadAPI.get<FlagResult>(
			`/launchpad/v1/eval/flags/${name}`,
		);
	} catch (_error) {
		return {
			success: false,
			data: null,
			error: {
				code: "FAILED_TO_FETCH",
				message: "Failed to fetch flag evaluation",
				details: null,
			},
			metadata: {
				service: "launchpad",
				timestamp: new Date().toISOString(),
			},
		} as StandardResponse<FlagResult>;
	}
};
