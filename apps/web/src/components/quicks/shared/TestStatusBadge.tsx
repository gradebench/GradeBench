import { Badge } from "@gb/ui/components/ui/badge";
import type { QuickTest } from "@/types/quicks/test";

const statusConfig = {
	draft: { label: "Draft", variant: "secondary" as const },
	uploading: { label: "Uploading", variant: "default" as const },
	evaluating: { label: "Evaluating", variant: "default" as const },
	completed: { label: "Completed", variant: "default" as const },
	failed: { label: "Failed", variant: "destructive" as const },
};

export function TestStatusBadge({ status }: { status: QuickTest["status"] }) {
	const config = statusConfig[status];
	return <Badge variant={config.variant}>{config.label}</Badge>;
}
