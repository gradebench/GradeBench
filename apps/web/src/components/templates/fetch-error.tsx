"use client";

import { CircleAlertIcon } from "lucide-react";

export const UnhandledFetchError = () => {
	return (
		<AlertDialog open={true}>
			<AlertDialogContent>
				<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
					<div
						className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-red-500/12"
						aria-hidden="true"
					>
						<CircleAlertIcon className="text-red-500 opacity-80" size={16} />
					</div>
					<AlertDialogHeader>
						<AlertDialogTitle>Oops!</AlertDialogTitle>
						<AlertDialogDescription>
							We're facing technical difficulties connecting to the server.
							Please check your internet connection or try again later.
						</AlertDialogDescription>
					</AlertDialogHeader>
				</div>
				<AlertDialogFooter>
					<AlertDialogAction>Retry</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
