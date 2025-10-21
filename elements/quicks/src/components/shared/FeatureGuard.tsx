"use client";

import { FEATURE_FLAGS } from "../../lib/feature-flags.js";
import type { ReactNode } from "react";

export function FeatureGuard({ children }: { children: ReactNode }) {
	if (!FEATURE_FLAGS.QUICK_TESTS) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-2">Feature Not Available</h1>
					<p className="text-muted-foreground">Quick Tests feature is currently disabled.</p>
				</div>
			</div>
		);
	}
	return <>{children}</>;
}
