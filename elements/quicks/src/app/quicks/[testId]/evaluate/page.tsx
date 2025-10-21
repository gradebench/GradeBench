"use client";

import { useState, useEffect } from "react";
import { Button } from "@gb/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gb/ui/components/ui/card";
import { Progress } from "@gb/ui/components/ui/progress";
import { DashboardLayout } from "../../../../components/shared/DashboardLayout.js";
import { FeatureGuard } from "../../../../components/shared/FeatureGuard.js";
import { useRouter, useParams } from "next/navigation";

export default function EvaluationDashboard() {
	const router = useRouter();
	const params = useParams();
	const [progress, setProgress] = useState(0);
	const [status, setStatus] = useState<"evaluating" | "completed">("evaluating");

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
			<DashboardLayout title="Evaluation Dashboard" description="Monitor your test evaluation progress">
				<div className="max-w-2xl space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Evaluation Progress</CardTitle>
							<CardDescription>
								{status === "evaluating" ? "Evaluating test responses..." : "Evaluation completed!"}
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
								<div className="p-4 bg-muted rounded-lg">
									<p className="text-2xl font-bold">20</p>
									<p className="text-xs text-muted-foreground">Total Questions</p>
								</div>
								<div className="p-4 bg-muted rounded-lg">
									<p className="text-2xl font-bold">{Math.floor((progress / 100) * 20)}</p>
									<p className="text-xs text-muted-foreground">Evaluated</p>
								</div>
								<div className="p-4 bg-muted rounded-lg">
									<p className="text-2xl font-bold">{20 - Math.floor((progress / 100) * 20)}</p>
									<p className="text-xs text-muted-foreground">Remaining</p>
								</div>
							</div>
							{status === "completed" && (
								<Button onClick={() => router.push(`/quicks/${params.testId}/results`)} className="w-full">
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
