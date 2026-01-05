import { AuthView, authViewPaths } from "@gb/auth";

export const dynamicParams = false;

export const generateStaticParams = () => {
  return Object.values(authViewPaths).map((path) => ({ path }));
};

const AuthPage = async ({ params }: { params: Promise<{ path: string }> }) => {
  const { path } = await params;

  return (
    <main className="grid h-screen place-items-center">
      <AuthView callbackURL="https://app.gradebench.dev" path={path} />
    </main>
  );
};

export default AuthPage;
