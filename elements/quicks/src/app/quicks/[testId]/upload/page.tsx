"use client";

import { useState } from "react";
import { Button } from "@gb/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gb/ui/components/ui/card";
import { DashboardLayout } from "../../../../components/shared/DashboardLayout.js";
import { FeatureGuard } from "../../../../components/shared/FeatureGuard.js";
import { UploadIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function UploadPage() {
	const router = useRouter();
	const params = useParams();
	const [file, setFile] = useState<File | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) setFile(e.target.files[0]);
	};

	const handleUpload = () => {
		if (file) router.push(`/quicks/${params.testId}/evaluate`);
	};

	return (
		<FeatureGuard>
			<DashboardLayout title="Upload Test Data" description="Upload your test questions and answers">
				<Card className="max-w-2xl">
					<CardHeader>
						<CardTitle>Upload Files</CardTitle>
						<CardDescription>Upload CSV or JSON file with test questions</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="border-2 border-dashed rounded-lg p-12 text-center">
							<UploadIcon className="mx-auto size-12 text-muted-foreground mb-4" />
							<div className="space-y-2">
								<p className="text-sm font-medium">Drop your file here or click to browse</p>
								<p className="text-xs text-muted-foreground">Supports CSV, JSON (Max 10MB)</p>
							</div>
							<input
								type="file"
								accept=".csv,.json"
								onChange={handleFileChange}
								className="mt-4"
							/>
						</div>
						{file && (
							<div className="p-4 bg-muted rounded-lg">
								<p className="text-sm font-medium">Selected: {file.name}</p>
								<p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
							</div>
						)}
						<div className="flex gap-3">
							<Button onClick={handleUpload} disabled={!file}>
								Continue to Evaluation
							</Button>
							<Button variant="outline" onClick={() => router.push("/quicks")}>
								Cancel
							</Button>
						</div>
					</CardContent>
				</Card>
			</DashboardLayout>
		</FeatureGuard>
	);
}
