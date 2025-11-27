// Launchpad kit - Feature flags and configuration
export interface FeatureFlags {
	enableNewFeatures: boolean;
	enableBetaFeatures: boolean;
}

export const defaultFeatureFlags: FeatureFlags = {
	enableNewFeatures: false,
	enableBetaFeatures: false,
};

export function getFeatureFlag(flag: keyof FeatureFlags): boolean {
	return defaultFeatureFlags[flag];
}

// Export the service and types
export { evaluateFlag } from "./services/flag.service";
export type { FlagResult } from "./types/flag.types";
