"use client";

import { useState, useEffect } from "react";
import { Button } from "@gb/ui/components/ui/button";
import { FeatureGuard } from "@/components/quicks/shared/FeatureGuard";
import { PlusCircleIcon, FileTextIcon, ChevronRightIcon, ChevronLeftIcon, CheckCircleIcon, ClockIcon, PauseCircleIcon } from "lucide-react";
import Link from "next/link";
import type { QuickTest } from "@/types/quicks/test";

const mockTests: QuickTest[] = [
	{ id: "1", name: "Q3 Performance Analysis", status: "completed", createdAt: new Date("2023-10-26"), updatedAt: new Date("2023-10-26"), totalQuestions: 20, evaluatedQuestions: 20, score: 85 },
	{ id: "2", name: "User Experience Feedback", status: "completed", createdAt: new Date("2023-10-25"), updatedAt: new Date("2023-10-25"), totalQuestions: 15, evaluatedQuestions: 15, score: 92 },
	{ id: "3", name: "API Latency Benchmark", status: "evaluating", createdAt: new Date("2023-10-24"), updatedAt: new Date("2023-10-24"), totalQuestions: 18, evaluatedQuestions: 10 },
	{ id: "4", name: "Frontend Unit Tests", status: "completed", createdAt: new Date("2023-10-22"), updatedAt: new Date("2023-10-22"), totalQuestions: 25, evaluatedQuestions: 25, score: 88 },
	{ id: "5", name: "Database Migration Dry Run", status: "draft", createdAt: new Date("2023-10-21"), updatedAt: new Date("2023-10-21") },
	{ id: "6", name: "Security Vulnerability Scan", status: "completed", createdAt: new Date("2023-10-20"), updatedAt: new Date("2023-10-20"), totalQuestions: 30, evaluatedQuestions: 30, score: 95 },
	{ id: "7", name: "New User Onboarding Flow", status: "completed", createdAt: new Date("2023-10-19"), updatedAt: new Date("2023-10-19"), totalQuestions: 12, evaluatedQuestions: 12, score: 78 },
	{ id: "8", name: "Mobile Responsiveness Check", status: "evaluating", createdAt: new Date("2023-10-18"), updatedAt: new Date("2023-10-18"), totalQuestions: 20, evaluatedQuestions: 8 },
];

const getStatusConfig = (status: QuickTest["status"]) => {
	switch (status) {
		case "completed":
			return {
				className: "bg-green-500/10 text-green-400 border border-green-500/20",
				icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
				label: "Completed"
			};
		case "evaluating":
			return {
				className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
				icon: <ClockIcon className="w-5 h-5 text-yellow-500" />,
				label: "In Progress"
			};
		case "draft":
			return {
				className: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
				icon: <PauseCircleIcon className="w-5 h-5 text-gray-500" />,
				label: "Pending"
			};
		default:
			return {
				className: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
				icon: <PauseCircleIcon className="w-5 h-5 text-gray-500" />,
				label: "Unknown"
			};
	}
};

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
				setAnimatedCount(prev => {
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
				<div className="max-w-7xl mx-auto">
					<header className={`transition-all duration-700 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8`}>
						<div>
							<h1 className="text-3xl font-bold">Gradebench</h1>
							<p className="text-muted-foreground mt-1">Your agentic co-pilot for creating, managing, and analyzing tests.</p>
						</div>
						<Link href="/quicks/new">
							<Button className="mt-4 sm:mt-0 gap-2">
								<PlusCircleIcon className="w-5 h-5" />
								Create New Test
							</Button>
						</Link>
					</header>

					<div className={`mb-8 transition-all duration-700 ease-out delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
						<div className="bg-card border rounded-xl p-6 w-full sm:w-1/2 lg:w-1/3">
							<div className="flex items-center gap-4">
								<div className="bg-primary/10 p-3 rounded-lg border border-primary/30">
									<FileTextIcon className="w-6 h-6 text-primary" />
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Tests Conducted</p>
									<p className="text-3xl font-bold">{animatedCount}</p>
								</div>
							</div>
						</div>
					</div>

					<main className={`transition-all duration-700 ease-out delay-[400ms] ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
						<h2 className="text-xl font-semibold mb-4">Previous Tests</h2>
						<div className="bg-card border rounded-xl overflow-hidden">
							<div className="flex flex-col">
								{currentTests.map((test, index) => {
									const statusConfig = getStatusConfig(test.status);
									return (
										<Link key={test.id} href={`/quicks/${test.id}/results`}>
											<div
												style={{ transitionDelay: `${index * 100}ms` }}
												className={`flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-accent cursor-pointer transition-all duration-300 group hover:scale-[1.02] transform ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
											>
												<div className="flex items-center gap-4">
													{statusConfig.icon}
													<div>
														<p className="font-medium">{test.name}</p>
														<p className="text-sm text-muted-foreground">{`Conducted on: ${test.createdAt.toLocaleDateString('en-US')}`}</p>
													</div>
												</div>
												<div className="flex items-center gap-4">
													<span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.className}`}>
														{statusConfig.label}
													</span>
													<ChevronRightIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						</div>
						{totalPages > 1 && (
							<div className="flex justify-between items-center mt-6">
								<Button
									variant="outline"
									onClick={() => setCurrentPage(currentPage - 1)}
									disabled={currentPage === 1}
									className="gap-2"
								>
									<ChevronLeftIcon className="w-4 h-4" />
									Previous
								</Button>
								<span className="text-sm text-muted-foreground">
									Page {currentPage} of {totalPages}
								</span>
								<Button
									variant="outline"
									onClick={() => setCurrentPage(currentPage + 1)}
									disabled={currentPage === totalPages}
									className="gap-2"
								>
									Next
									<ChevronRightIcon className="w-4 h-4" />
								</Button>
							</div>
						)}
					</main>
				</div>
			</div>
		</FeatureGuard>
	);
}
