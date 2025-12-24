"use client";

import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import {
	AccountView,
	AuthView,
	OrganizationView,
} from "@daveyplate/better-auth-ui";
import {
	accountViewPaths,
	authViewPaths,
	organizationViewPaths,
} from "@daveyplate/better-auth-ui/server";
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
			>
				{children}
			</AuthUIProviderTanstack>
		</AuthQueryProvider>
	);
};

export {
	AccountView,
	accountViewPaths,
	AuthView,
	authViewPaths,
	OrganizationView,
	organizationViewPaths,
};
