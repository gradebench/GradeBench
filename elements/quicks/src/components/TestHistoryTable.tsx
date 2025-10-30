"use client";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@gb/ui/src/components/ui/pagination";
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
			{tests.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-16 text-center">
					<div className="mb-4 text-6xl">📝</div>
					<h3 className="mb-2 font-semibold text-lg">No tests yet</h3>
					<p className="text-muted-foreground text-sm">
						Create your first test to get started
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{tests.map((test) => (
						<a
							key={test.id}
							href={`/quicks/tests/${test.id}`}
							className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
						>
							<div className="font-medium">{test.name}</div>
							<TestStatusBadge status={test.status} />
						</a>
					))}
				</div>
			)}
			{totalPages > 1 && (
				<div className="flex items-center justify-between border-t pt-4">
					<p className="text-muted-foreground text-sm">
						Page {currentPage} of {totalPages}
					</p>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href="#"
									size="default"
									onClick={(e: React.MouseEvent) => {
										e.preventDefault();
										if (currentPage > 1) onPageChange(currentPage - 1);
									}}
								/>
							</PaginationItem>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(page) => (
									<PaginationItem key={page}>
										<PaginationLink
											href="#"
											size="default"
											isActive={page === currentPage}
											onClick={(e: React.MouseEvent) => {
												e.preventDefault();
												onPageChange(page);
											}}
										>
											{page}
										</PaginationLink>
									</PaginationItem>
								),
							)}
							<PaginationItem>
								<PaginationNext
									href="#"
									size="default"
									onClick={(e: React.MouseEvent) => {
										e.preventDefault();
										if (currentPage < totalPages) onPageChange(currentPage + 1);
									}}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
}
