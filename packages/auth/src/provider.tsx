"use client";

import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "./client";

type AuthProviderProps = {
	readonly children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const router = useRouter();
	const { slug } = useParams<{ slug: string }>();

	return (
		<AuthQueryProvider>
			<AuthUIProviderTanstack
				authClient={authClient}
				navigate={router.push}
				persistClient={false}
				replace={router.replace}
				onSessionChange={() => router.refresh()}
				organization={{
					pathMode: "slug",
					basePath: "organizations",
					slug,
				}}
				Link={Link}
				social={{
					providers: ["google"],
				}}
				multiSession={true}
				captcha={{
					provider: "google-recaptcha-v3",
					siteKey: "6Lf5CzksAAAAAKRtUCQCAY3mY7qDApxIeaKK31f7",
				}}
			>
				{children}
			</AuthUIProviderTanstack>
		</AuthQueryProvider>
	);
};
