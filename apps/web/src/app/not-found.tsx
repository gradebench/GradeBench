import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@gb/ui/src/components/ui/card";
import { AlertTriangleIcon } from "lucide-react";

export default function NotFound() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mb-4 flex justify-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
							<AlertTriangleIcon className="h-8 w-8 text-destructive" />
						</div>
					</div>
					<CardTitle className="font-bold text-4xl">404</CardTitle>
					<CardDescription className="text-lg">Page Not Found</CardDescription>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-muted-foreground">
						Sorry, the page you are looking for could not be found.
					</p>
				</CardContent>
			</Card>
		</main>
	);
}
