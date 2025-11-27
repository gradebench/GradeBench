"use client";

import { QueryClientProvider as Provider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/libs/tanstack/client";

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
	const queryClient = getQueryClient();

	return (
		<Provider client={queryClient}>
			{children}
			<ReactQueryDevtools />
		</Provider>
	);
};

export default QueryClientProvider;
