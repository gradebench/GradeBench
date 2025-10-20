import { createApiClient } from "@gb/fetch";
import { H1 } from "@gb/ui/src/components/ui/typography";

const Page = async () => {
	const flagAPI = createApiClient({
		baseURL: "http://localhost:8081",
		defaultHeaders: {
			"Content-Type": "application/json",
		},
		defaultTimeout: 10000,
	});

	const test = await flagAPI.get("launchpad/v1/eval/flags/test1");
	console.log(test);
	return <H1>Quick Page</H1>;
};

export default Page;
