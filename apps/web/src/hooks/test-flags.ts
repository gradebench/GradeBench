import { evaluateFlag } from "@gb-kits/launchpad";
import { queryOptions } from "@tanstack/react-query";

export const flagOptions = queryOptions({
	queryKey: ["test1"],
	queryFn: () => evaluateFlag("test1"),
});
