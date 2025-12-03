import { Card, CardContent } from "@gb/ui/src/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
	icon: LucideIcon;
	label: string;
	value: string | number;
	color: "green" | "amber" | "red" | "blue";
}

export function StatsCard({ icon: Icon, label, value, color }: StatsCardProps) {
	const colorClasses = {
		green: "bg-green-950 border-green-600 text-green-400",
		amber: "bg-amber-950 border-amber-600 text-amber-400",
		red: "bg-red-950 border-red-600 text-red-400",
		blue: "bg-blue-950 border-blue-600 text-blue-400",
	};

	return (
		<Card className={`border-2 ${colorClasses[color]}`}>
			<CardContent className="flex items-center gap-3 p-4">
				<Icon className="h-8 w-8" />
				<div>
					<p className="font-bold text-2xl">{value}</p>
					<p className="text-xs opacity-80">{label}</p>
				</div>
			</CardContent>
		</Card>
	);
}
