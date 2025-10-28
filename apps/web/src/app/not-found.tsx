import { Button } from "@gb/ui/src/components/ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<h1 className="mb-4 font-bold text-6xl">404</h1>
			<p className="mb-8 text-muted-foreground text-xl">Page not found</p>
			<Button asChild>
				<Link href="/">Go Home</Link>
			</Button>
		</div>
	);
}
