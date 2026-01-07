import { AuthView } from "@gb/auth";
import { authViewPaths } from "@gb/auth/server";
import { P } from "@gb/design-system/components/ui/typography";
import { env } from "@/configs/env.config";

export const dynamicParams = false;

export const generateStaticParams = () => {
  return Object.values(authViewPaths).map((path) => ({ path }));
};

const AuthPage = async ({ params }: { params: Promise<{ path: string }> }) => {
  const { path } = await params;

  return (
    <main className="grid h-screen place-items-center">
      <P>{path}</P>
      <AuthView
        callbackURL={`https://app.${env.server.BASE_DOMAIN}`}
        path={path}
        redirectTo="/"
        socialLayout="auto"
      />
    </main>
  );
};

export default AuthPage;
