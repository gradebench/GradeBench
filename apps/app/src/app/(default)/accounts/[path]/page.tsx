import { AccountView, accountViewPaths } from "@gb/auth/provider";

export const dynamicParams = false;

export const generateStaticParams = () => {
	return Object.values(accountViewPaths).map((path) => ({ path }));
};

const AccountPage = async ({
	params,
}: {
	params: Promise<{ path: string }>;
}) => {
	const { path } = await params;

	return (
		<main className="container p-4 md:p-6">
			<AccountView path={path} />
		</main>
	);
};

export default AccountPage;
