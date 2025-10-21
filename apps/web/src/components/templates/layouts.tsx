import QueryClientProvider from "@/libs/tanstack/ReactQueryProvider";
import "@gb/ui/globals.css";
import NextThemeProvider from "@gb/ui/src/components/providers/NextThemeProvider";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
	preload: true,
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
	preload: true,
});

export const DefaultRootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<main>{children}</main>
				</Providers>
			</body>
		</html>
	);
};

const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<QueryClientProvider>
			<NextThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
				enableColorScheme
				storageKey="gradebench-theme"
			>
				{children}
			</NextThemeProvider>
		</QueryClientProvider>
	);
};
