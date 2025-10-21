"use client";

import { Button } from "@gb/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@gb/ui/components/ui/card";
import { Progress } from "@gb/ui/components/ui/progress";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import { FeatureGuard } from "@gb-element/quicks/components/FeatureGuard";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EvaluationDashboard() {
	const router = useRouter();
	const params = useParams();
	const [progress, setProgress] = useState(0);
	const [status, setStatus] = useState<"evaluating" | "completed">(
		"evaluating",
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					setStatus("completed");
					return 100;
				}
				return prev + 10;
			});
		}, 500);
		return () => clearInterval(interval);
	}, []);

	return (
		<FeatureGuard>
			<DashboardLayout
				title="Evaluation Dashboard"
				description="Monitor your test evaluation progress"
			>
				<div className="max-w-2xl space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Evaluation Progress</CardTitle>
							<CardDescription>
								{status === "evaluating"
									? "Evaluating test responses..."
									: "Evaluation completed!"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Progress</span>
									<span className="font-medium">{progress}%</span>
								</div>
								<Progress value={progress} />
							</div>
							<div className="grid grid-cols-3 gap-4 text-center">
								<div className="rounded-lg bg-muted p-4">
									<p className="font-bold text-2xl">20</p>
									<p className="text-muted-foreground text-xs">
										Total Questions
									</p>
								</div>
								<div className="rounded-lg bg-muted p-4">
									<p className="font-bold text-2xl">
										{Math.floor((progress / 100) * 20)}
									</p>
									<p className="text-muted-foreground text-xs">Evaluated</p>
								</div>
								<div className="rounded-lg bg-muted p-4">
									<p className="font-bold text-2xl">
										{20 - Math.floor((progress / 100) * 20)}
									</p>
									<p className="text-muted-foreground text-xs">Remaining</p>
								</div>
							</div>
							{status === "completed" && (
								<Button
									onClick={() =>
										router.push(`/quicks/${params.testId}/results`)
									}
									className="w-full"
								>
									View Results
								</Button>
							)}
						</CardContent>
					</Card>
				</div>
			</DashboardLayout>
		</FeatureGuard>
	);
}
