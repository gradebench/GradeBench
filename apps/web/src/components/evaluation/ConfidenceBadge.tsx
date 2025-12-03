import { Badge } from "@gb/ui/src/components/ui/badge";
import { cn } from "@gb/ui/src/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ConfidenceBadgeProps {
	confidence: number;
	size?: "sm" | "md" | "lg";
}

export function ConfidenceBadge({
	confidence,
	size = "md",
}: ConfidenceBadgeProps) {
	// Validate and sanitize confidence value
	const safeConfidence = Number.isFinite(confidence)
		? Math.max(0, Math.min(100, confidence))
		: 0;

	const getConfidenceLevel = (): {
		level: "high" | "medium" | "low";
		color: "green" | "amber" | "red";
		icon: React.ElementType;
		label: string;
		className: string;
	} => {
		if (safeConfidence >= 70)
			return {
				level: "high",
				color: "green",
				icon: CheckCircle2,
				label: "High",
				className: "border-green-600 bg-green-950/30 text-green-400",
			};
		if (safeConfidence >= 40)
			return {
				level: "medium",
				color: "amber",
				icon: AlertTriangle,
				label: "Review",
				className: "border-amber-600 bg-amber-950/30 text-amber-400",
			};
		return {
			level: "low",
			color: "red",
			icon: AlertCircle,
			label: "Manual",
			className: "border-red-600 bg-red-950/30 text-red-400",
		};
	};

	const { icon: Icon, label, className } = getConfidenceLevel();

	const sizeClasses = {
		sm: "h-3 w-3",
		md: "h-3.5 w-3.5",
		lg: "h-4 w-4",
	};

	return (
		<Badge variant="outline" className={cn("gap-1.5", className)}>
			<Icon className={sizeClasses[size]} />
			{safeConfidence}% {label}
		</Badge>
	);
}
