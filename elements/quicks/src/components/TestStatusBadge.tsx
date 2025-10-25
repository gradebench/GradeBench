"use client";

import { Badge } from "@gb/ui/src/components/ui/badge";
import { getStatusConfig } from "../lib/status-utils";
import type { QuickTest } from "../types/test";

interface TestStatusBadgeProps {
	status: QuickTest["status"];
}

export function TestStatusBadge({ status }: TestStatusBadgeProps) {
	const config = getStatusConfig(status);
	const Icon = config.icon;

	return (
		<Badge variant="outline" className={config.className}>
			<Icon className="mr-1 h-3 w-3" />
			{config.label}
		</Badge>
	);
}
