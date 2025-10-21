"use client";

import { Button } from "@gb/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gb/ui/components/ui/card";
import { DashboardLayout } from "../../components/shared/DashboardLayout.js";
import { FeatureGuard } from "../../components/shared/FeatureGuard.js";
import { TestHistoryTable } from "../../components/shared/TestHistoryTable.js";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import type { QuickTest } from "../../types/test.js";

const mockTests: QuickTest[] = [
	{ id: "1", name: "Math Assessment", status: "completed", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15"), totalQuestions: 20, evaluatedQuestions: 20, score: 85 },
	{ id: "2", name: "Science Quiz", status: "evaluating", createdAt: new Date("2024-01-14"), updatedAt: new Date("2024-01-14"), totalQuestions: 15, evaluatedQuestions: 10 },
	{ id: "3", name: "History Test", status: "draft", createdAt: new Date("2024-01-13"), updatedAt: new Date("2024-01-13") },
];

export default function QuicksDashboard() {
	const currentPage = 1;
	const totalPages = 1;

	return (
		<FeatureGuard>
			<DashboardLayout
				title="Quick Tests"
				description="Create and manage your quick assessment tests"
				action={
					<Link href="/quicks/new">
						<Button>
							<PlusIcon />
							New Test
						</Button>
					</Link>
				}
			>
				<Card>
					<CardHeader>
						<CardTitle>Test History</CardTitle>
						<CardDescription>View and manage all your quick tests</CardDescription>
					</CardHeader>
					<CardContent>
						<TestHistoryTable
							tests={mockTests}
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={() => {}}
						/>
					</CardContent>
				</Card>
			</DashboardLayout>
		</FeatureGuard>
	);
}
