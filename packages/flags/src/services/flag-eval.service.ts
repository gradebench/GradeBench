import wretch, { type WretchErrorCallback } from "wretch";
import type { FlagResultType } from "@/types/flags.js";

const api = wretch("http://localhost:8081").options({
	mode: "cors",
	credentials: "include",
});

export const fetchFlagResult = async (
	name: string,
	cb: WretchErrorCallback<unknown, unknown, undefined, undefined>,
) => {
	const flagResult = await api
		.get(`/launchpad/v1/eval/flags/${name}`)
		.error(422, cb)
		.json<FlagResultType>();

	return flagResult;
};
