import "@/styles/globals.css";
import { ThemeProvider } from "@gb/design-system/providers/theme";
import { QueryProvider } from "@gb/query/provider";
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

type WebRootLayoutProps = {
	readonly children: ReactNode;
};

const WebRootLayout = ({ children }: WebRootLayoutProps) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider>
					<QueryProvider>{children}</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
};

export default WebRootLayout;
