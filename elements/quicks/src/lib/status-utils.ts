import { CheckCircleIcon, ClockIcon, PauseCircleIcon } from "lucide-react";
import type { QuickTest } from "../types/test.js";

export const getStatusConfig = (status: QuickTest["status"]) => {
	const configs = {
		completed: {
			className: "bg-green-500/10 text-green-400 border border-green-500/20",
			icon: CheckCircleIcon,
			label: "Completed",
		},
		evaluating: {
			className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
			icon: ClockIcon,
			label: "In Progress",
		},
		draft: {
			className: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
			icon: PauseCircleIcon,
			label: "Pending",
		},
		uploading: {
			className: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
			icon: ClockIcon,
			label: "Uploading",
		},
		failed: {
			className: "bg-red-500/10 text-red-400 border border-red-500/20",
			icon: PauseCircleIcon,
			label: "Failed",
		},
	};

	return configs[status as keyof typeof configs] || configs.draft;
};
