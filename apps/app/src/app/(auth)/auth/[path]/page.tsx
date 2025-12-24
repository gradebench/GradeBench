import { AuthView, authViewPaths } from "@gb/auth/provider";

export const dynamicParams = false;

export const generateStaticParams = () => {
	return Object.values(authViewPaths).map((path) => ({ path }));
};

const AuthPage = async ({ params }: { params: Promise<{ path: string }> }) => {
	const { path } = await params;

	return (
		<main className="container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
			<AuthView path={path} />
		</main>
	);
};

export default AuthPage;
