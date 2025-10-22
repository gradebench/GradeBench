"use client";

import { Button } from "@gb/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@gb/ui/components/ui/card";
import { CreateTestDrawer } from "@gb-element/quicks/components/CreateTestDrawer";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import { FeatureGuard } from "@gb-element/quicks/components/FeatureGuard";
import { TestHistoryTable } from "@gb-element/quicks/components/TestHistoryTable";
import type { QuickTest } from "@gb-element/quicks/types/test";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

// Mock data - replace with API call
const mockTests: QuickTest[] = [
	{
		id: "1",
		name: "Math Quiz - Chapter 5",
		status: "completed",
		totalQuestions: 20,
		evaluatedQuestions: 20,
		score: 85,
		createdAt: "2025-10-15T10:30:00Z",
	},
	{
		id: "2",
		name: "Science Test - Physics",
		status: "evaluating",
		totalQuestions: 15,
		evaluatedQuestions: 10,
		createdAt: "2025-10-20T14:20:00Z",
	},
	{
		id: "3",
		name: "English Grammar Quiz",
		status: "completed",
		totalQuestions: 25,
		evaluatedQuestions: 25,
		score: 92,
		createdAt: "2025-10-18T09:15:00Z",
	},
	{
		id: "4",
		name: "History - World War II",
		status: "draft",
		totalQuestions: 30,
		createdAt: "2025-10-21T16:45:00Z",
	},
	{
		id: "5",
		name: "Chemistry Lab Test",
		status: "uploading",
		totalQuestions: 12,
		createdAt: "2025-10-22T08:00:00Z",
	},
	{
		id: "6",
		name: "Biology - Cell Structure",
		status: "completed",
		totalQuestions: 18,
		evaluatedQuestions: 18,
		score: 78,
		createdAt: "2025-10-14T11:00:00Z",
	},
	{
		id: "7",
		name: "Geography - Maps & Locations",
		status: "evaluating",
		totalQuestions: 22,
		evaluatedQuestions: 15,
		createdAt: "2025-10-19T13:30:00Z",
	},
	{
		id: "8",
		name: "Computer Science - Algorithms",
		status: "completed",
		totalQuestions: 30,
		evaluatedQuestions: 30,
		score: 95,
		createdAt: "2025-10-12T09:00:00Z",
	},
	{
		id: "9",
		name: "Economics - Microeconomics",
		status: "draft",
		totalQuestions: 20,
		createdAt: "2025-10-21T15:00:00Z",
	},
	{
		id: "10",
		name: "Literature - Shakespeare",
		status: "completed",
		totalQuestions: 15,
		evaluatedQuestions: 15,
		score: 88,
		createdAt: "2025-10-13T10:15:00Z",
	},
	{
		id: "11",
		name: "Physics - Mechanics",
		status: "evaluating",
		totalQuestions: 25,
		evaluatedQuestions: 18,
		createdAt: "2025-10-20T16:00:00Z",
	},
	{
		id: "12",
		name: "Art History - Renaissance",
		status: "completed",
		totalQuestions: 20,
		evaluatedQuestions: 20,
		score: 82,
		createdAt: "2025-10-11T14:30:00Z",
	},
];

const ITEMS_PER_PAGE = 5;

export default function QuicksDashboard() {
	const [currentPage, setCurrentPage] = useState(1);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const totalPages = Math.ceil(mockTests.length / ITEMS_PER_PAGE);
	const paginatedTests = mockTests.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	const stats = {
		total: mockTests.length,
		completed: mockTests.filter((t) => t.status === "completed").length,
		inProgress: mockTests.filter((t) => t.status === "evaluating").length,
		draft: mockTests.filter((t) => t.status === "draft").length,
	};

	return (
		<FeatureGuard>
			<DashboardLayout
				title=""
				action={
					<Button onClick={() => setDrawerOpen(true)}>
						<PlusIcon className="mr-2 h-4 w-4" />
						Create New Test
					</Button>
				}
			>
				<div className="space-y-6">
					{/* Stats Cards */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
						<Card>
							<CardHeader className="pb-3">
								<CardDescription>Total Tests</CardDescription>
								<CardTitle className="text-3xl">{stats.total}</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardDescription>Completed</CardDescription>
								<CardTitle className="text-3xl text-green-600">
									{stats.completed}
								</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardDescription>In Progress</CardDescription>
								<CardTitle className="text-3xl text-yellow-600">
									{stats.inProgress}
								</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardDescription>Draft</CardDescription>
								<CardTitle className="text-3xl text-gray-600">
									{stats.draft}
								</CardTitle>
							</CardHeader>
						</Card>
					</div>

					{/* Test History */}
					<Card>
						<CardHeader>
							<CardTitle>Test History</CardTitle>
							<CardDescription>
								View and manage all your test evaluations
							</CardDescription>
						</CardHeader>
						<CardContent>
							<TestHistoryTable
								tests={paginatedTests}
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						</CardContent>
					</Card>
				</div>

				<CreateTestDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
			</DashboardLayout>
		</FeatureGuard>
	);
}
