import { H1 } from "@gb/ui/src/components/ui/typography";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { TestClientComp } from "@/hooks/test-comp";
import { flagOptions } from "@/hooks/test-flags";
import { getQueryClient } from "@/libs/tanstack/client";

const Page = async () => {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery(flagOptions);

	return (
		<>
			<H1>Quick Dashboard</H1>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<TestClientComp />
			</HydrationBoundary>
		</>
	);
};

export default Page;
