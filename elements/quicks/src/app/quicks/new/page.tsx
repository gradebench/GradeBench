"use client";

import { useId, useState } from "react";
import { Button } from "@gb/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gb/ui/components/ui/card";
import { Input } from "@gb/ui/components/ui/input";
import { Label } from "@gb/ui/components/ui/label";
import { Textarea } from "@gb/ui/components/ui/textarea";
import { DashboardLayout } from "../../../components/shared/DashboardLayout.js";
import { FeatureGuard } from "../../../components/shared/FeatureGuard.js";
import { useRouter } from "next/navigation";

export default function TestSetupPage() {
	const router = useRouter();
	const nameId = useId();
	const descId = useId();
	const [formData, setFormData] = useState({ name: "", description: "" });

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const testId = Date.now().toString();
		router.push(`/quicks/${testId}/upload`);
	};

	return (
		<FeatureGuard>
			<DashboardLayout title="Create New Test" description="Set up your quick assessment test">
				<Card className="max-w-2xl">
					<CardHeader>
						<CardTitle>Test Setup</CardTitle>
						<CardDescription>Configure your test details</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor={nameId}>Test Name</Label>
								<Input
									id={nameId}
									placeholder="Enter test name"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={descId}>Description (Optional)</Label>
								<Textarea
									id={descId}
									placeholder="Enter test description"
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									rows={4}
								/>
							</div>
							<div className="flex gap-3">
								<Button type="submit">Continue to Upload</Button>
								<Button type="button" variant="outline" onClick={() => router.push("/quicks")}>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</DashboardLayout>
		</FeatureGuard>
	);
}
