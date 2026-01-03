import { AuthProvider } from "@gb/auth/provider";
import { Toaster } from "@gb/design-system/components/ui/sonner";
import type { ReactNode } from "react";

type AuthLayoutProps = {
	readonly children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<>
			<AuthProvider>{children}</AuthProvider>
			<Toaster position="top-right" />
		</>
	);
};

export default AuthLayout;
