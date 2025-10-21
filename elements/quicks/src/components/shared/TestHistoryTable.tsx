"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gb/ui/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@gb/ui/components/ui/pagination";
import { TestStatusBadge } from "./TestStatusBadge.js";
import type { QuickTest } from "../../types/test.js";
import Link from "next/link";

interface TestHistoryTableProps {
	tests: QuickTest[];
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function TestHistoryTable({ tests, currentPage, totalPages, onPageChange }: TestHistoryTableProps) {
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
							<TableCell><TestStatusBadge status={test.status} /></TableCell>
							<TableCell>{test.totalQuestions ? `${test.evaluatedQuestions || 0}/${test.totalQuestions}` : "-"}</TableCell>
							<TableCell>{test.score ? `${test.score}%` : "-"}</TableCell>
							<TableCell>{new Date(test.createdAt).toLocaleDateString()}</TableCell>
							<TableCell>
								<Link href={`/quicks/${test.id}/results`} className="text-primary hover:underline text-sm">
									View
								</Link>
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
								onClick={(e) => { e.preventDefault(); if (currentPage > 1) onPageChange(currentPage - 1); }}
							/>
						</PaginationItem>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<PaginationItem key={page}>
								<PaginationLink 
									href="#" 
									isActive={page === currentPage}
									onClick={(e) => { e.preventDefault(); onPageChange(page); }}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext 
								href="#" 
								onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) onPageChange(currentPage + 1); }}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
