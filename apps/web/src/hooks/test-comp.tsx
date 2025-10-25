"use client";

import type { StandardResponse } from "@gb/fetch";
import { P } from "@gb/ui/src/components/ui/typography";
import type { FlagResult } from "@gb-kits/launchpad";
import { useSuspenseQuery } from "@tanstack/react-query";
import { flagOptions } from "./test-flags";

export const TestClientComp = () => {
	const { data } = useSuspenseQuery(flagOptions);
	const response = data as StandardResponse<FlagResult>;

	return (
		<P>
			{response.success
				? JSON.stringify(response.data)
				: JSON.stringify(response.error)}
		</P>
	);
};
