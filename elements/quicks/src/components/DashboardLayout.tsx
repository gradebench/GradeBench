"use client";

import type { ReactNode } from "react";

interface DashboardLayoutProps {
	title: string;
	description?: string;
	action?: ReactNode;
	children: ReactNode;
}

export function DashboardLayout({
	title,
	description,
	action,
	children,
}: DashboardLayoutProps) {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8 flex items-start justify-between">
				<div>
					<h1 className="font-bold text-3xl">{title}</h1>
					{description && (
						<p className="mt-2 text-muted-foreground">{description}</p>
					)}
				</div>
				{action && <div>{action}</div>}
			</div>
			{children}
		</div>
	);
}
