import type { ReactNode } from "react";

interface DashboardLayoutProps {
	children: ReactNode;
	title: string;
	description?: string;
	action?: ReactNode;
}

export function DashboardLayout({ children, title, description, action }: DashboardLayoutProps) {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto py-8 px-4">
				<div className="flex justify-between items-start mb-8">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
						{description && <p className="text-muted-foreground mt-2">{description}</p>}
					</div>
					{action && <div>{action}</div>}
				</div>
				{children}
			</div>
		</div>
	);
}
