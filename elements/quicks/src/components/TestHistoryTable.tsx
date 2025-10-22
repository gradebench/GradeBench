"use client";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@gb/ui/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@gb/ui/components/ui/table";

import type { QuickTest } from "../types/test";
import { TestStatusBadge } from "./TestStatusBadge";

interface TestHistoryTableProps {
	tests: QuickTest[];
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function TestHistoryTable({
	tests,
	currentPage,
	totalPages,
	onPageChange,
}: TestHistoryTableProps) {
	return (
		<div className="space-y-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Test Name</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Questions</TableHead>
						<TableHead>Score</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tests.map((test) => (
						<TableRow key={test.id}>
							<TableCell className="font-medium">{test.name}</TableCell>
							<TableCell>
								<TestStatusBadge status={test.status} />
							</TableCell>
							<TableCell>
								{test.totalQuestions
									? `${test.evaluatedQuestions || 0}/${test.totalQuestions}`
									: "-"}
							</TableCell>
							<TableCell>{test.score ? `${test.score}%` : "-"}</TableCell>
							<TableCell>
								{new Date(test.createdAt).toLocaleDateString("en-US")}
							</TableCell>
							<TableCell>
								<a
									href={`/quicks/${test.id}/results`}
									className="text-primary text-sm hover:underline"
								>
									View
								</a>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(e: React.MouseEvent) => {
									e.preventDefault();
									if (currentPage > 1) onPageChange(currentPage - 1);
								}}
							/>
						</PaginationItem>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<PaginationItem key={page}>
								<PaginationLink
									href="#"
									isActive={page === currentPage}
									onClick={(e: React.MouseEvent) => {
										e.preventDefault();
										onPageChange(page);
									}}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={(e: React.MouseEvent) => {
									e.preventDefault();
									if (currentPage < totalPages) onPageChange(currentPage + 1);
								}}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
