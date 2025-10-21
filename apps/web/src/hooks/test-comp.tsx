"use client";

import { P } from "@gb/ui/src/components/ui/typography";
import { useSuspenseQuery } from "@tanstack/react-query";
import { flagOptions } from "./test-flags";

export const TestClientComp = () => {
	const { data } = useSuspenseQuery(flagOptions);

	return (
		<P>
			{data.success ? JSON.stringify(data.data) : JSON.stringify(data.error)}
		</P>
	);
};
