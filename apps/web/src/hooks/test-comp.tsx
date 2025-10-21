"use client";

import { P } from "@gb/ui/src/components/ui/typography";
import { useSuspenseQuery } from "@tanstack/react-query";
import { flagOptions } from "./test-flags";

export const TestClientComp = () => {
	const { data } = useSuspenseQuery(flagOptions);

	// data is StandardResponse<FlagResult>, so access data.data for the actual FlagResult
	return (
		<P>
			{data.success ? JSON.stringify(data.data) : JSON.stringify(data.error)}
		</P>
	);
};
