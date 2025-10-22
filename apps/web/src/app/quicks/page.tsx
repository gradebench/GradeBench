"use client";

import { Button } from "@gb/ui/src/components/ui/button";
import { FeatureGuard } from "@gb-element/quicks/components/FeatureGuard";
import { getStatusConfig } from "@gb-element/quicks/lib/status-utils";
import type { QuickTest } from "@gb-element/quicks/types/test";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	FileTextIcon,
	PlusCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const mockTests: QuickTest[] = [
	{
		id: "1",
		name: "Q3 Performance Analysis",
		status: "completed",
		createdAt: new Date("2023-10-26"),
		updatedAt: new Date("2023-10-26"),
		totalQuestions: 20,
		evaluatedQuestions: 20,
		score: 85,
	},
	{
		id: "2",
		name: "User Experience Feedback",
		status: "completed",
		createdAt: new Date("2023-10-25"),
		updatedAt: new Date("2023-10-25"),
		totalQuestions: 15,
		evaluatedQuestions: 15,
		score: 92,
	},
	{
		id: "3",
		name: "API Latency Benchmark",
		status: "evaluating",
		createdAt: new Date("2023-10-24"),
		updatedAt: new Date("2023-10-24"),
		totalQuestions: 18,
		evaluatedQuestions: 10,
	},
	{
		id: "4",
		name: "Frontend Unit Tests",
		status: "completed",
		createdAt: new Date("2023-10-22"),
		updatedAt: new Date("2023-10-22"),
		totalQuestions: 25,
		evaluatedQuestions: 25,
		score: 88,
	},
	{
		id: "5",
		name: "Database Migration Dry Run",
		status: "draft",
		createdAt: new Date("2023-10-21"),
		updatedAt: new Date("2023-10-21"),
	},
	{
		id: "6",
		name: "Security Vulnerability Scan",
		status: "completed",
		createdAt: new Date("2023-10-20"),
		updatedAt: new Date("2023-10-20"),
		totalQuestions: 30,
		evaluatedQuestions: 30,
		score: 95,
	},
	{
		id: "7",
		name: "New User Onboarding Flow",
		status: "completed",
		createdAt: new Date("2023-10-19"),
		updatedAt: new Date("2023-10-19"),
		totalQuestions: 12,
		evaluatedQuestions: 12,
		score: 78,
	},
	{
		id: "8",
		name: "Mobile Responsiveness Check",
		status: "evaluating",
		createdAt: new Date("2023-10-18"),
		updatedAt: new Date("2023-10-18"),
		totalQuestions: 20,
		evaluatedQuestions: 8,
	},
];

export default function QuicksDashboard() {
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoaded, setIsLoaded] = useState(false);
	const [animatedCount, setAnimatedCount] = useState(0);
	const testsPerPage = 7;

	useEffect(() => {
		setIsLoaded(true);
		const targetCount = mockTests.length;
		if (animatedCount < targetCount) {
			const interval = setInterval(() => {
				setAnimatedCount((prev) => {
					if (prev < targetCount) return prev + 1;
					clearInterval(interval);
					return prev;
				});
			}, 50);
			return () => clearInterval(interval);
		}
	}, [animatedCount]);

	const indexOfLastTest = currentPage * testsPerPage;
	const indexOfFirstTest = indexOfLastTest - testsPerPage;
	const currentTests = mockTests.slice(indexOfFirstTest, indexOfLastTest);
	const totalPages = Math.ceil(mockTests.length / testsPerPage);

	return (
		<FeatureGuard>
			<div className="min-h-screen p-4 sm:p-6 lg:p-8">
				<div className="mx-auto max-w-7xl">
					<header
						className={`transition-all duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center`}
					>
						<div>
							<h1 className="font-bold text-3xl">Gradebench</h1>
							<p className="mt-1 text-muted-foreground">
								Your agentic co-pilot for creating, managing, and analyzing
								tests.
							</p>
						</div>
						<Link href="/quicks/new">
							<Button className="mt-4 gap-2 sm:mt-0">
								<PlusCircleIcon className="h-5 w-5" />
								Create New Test
							</Button>
						</Link>
					</header>

					<div
						className={`mb-8 transition-all delay-200 duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
					>
						<div className="w-full rounded-xl border bg-card p-6 sm:w-1/2 lg:w-1/3">
							<div className="flex items-center gap-4">
								<div className="rounded-lg border border-primary/30 bg-primary/10 p-3">
									<FileTextIcon className="h-6 w-6 text-primary" />
								</div>
								<div>
									<p className="text-muted-foreground text-sm">
										Tests Conducted
									</p>
									<p className="font-bold text-3xl">{animatedCount}</p>
								</div>
							</div>
						</div>
					</div>

					<main
						className={`transition-all delay-[400ms] duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
					>
						<h2 className="mb-4 font-semibold text-xl">Previous Tests</h2>
						<div className="overflow-hidden rounded-xl border bg-card">
							<div className="flex flex-col">
								{currentTests.map((test, index) => {
									const statusConfig = getStatusConfig(test.status);
									const StatusIcon = statusConfig.icon;
									return (
										<Link key={test.id} href={`/quicks/${test.id}/results`}>
											<div
												style={{ transitionDelay: `${index * 100}ms` }}
												className={`group flex transform cursor-pointer items-center justify-between border-b p-4 transition-all duration-300 last:border-b-0 hover:scale-[1.02] hover:bg-accent ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
											>
												<div className="flex items-center gap-4">
													<StatusIcon className="h-5 w-5" />
													<div>
														<p className="font-medium">{test.name}</p>
														<p className="text-muted-foreground text-sm">{`Conducted on: ${test.createdAt.toLocaleDateString("en-US")}`}</p>
													</div>
												</div>
												<div className="flex items-center gap-4">
													<span
														className={`rounded-full px-3 py-1 font-semibold text-xs ${statusConfig.className}`}
													>
														{statusConfig.label}
													</span>
													<ChevronRightIcon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						</div>
						{totalPages > 1 && (
							<div className="mt-6 flex items-center justify-between">
								<Button
									variant="outline"
									onClick={() => setCurrentPage(currentPage - 1)}
									disabled={currentPage === 1}
									className="gap-2"
								>
									<ChevronLeftIcon className="h-4 w-4" />
									Previous
								</Button>
								<span className="text-muted-foreground text-sm">
									Page {currentPage} of {totalPages}
								</span>
								<Button
									variant="outline"
									onClick={() => setCurrentPage(currentPage + 1)}
									disabled={currentPage === totalPages}
									className="gap-2"
								>
									Next
									<ChevronRightIcon className="h-4 w-4" />
								</Button>
							</div>
						)}
					</main>
				</div>
			</div>
		</FeatureGuard>
	);
}
