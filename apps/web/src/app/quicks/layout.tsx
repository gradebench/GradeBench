import NextThemeProvider from "@gb/ui/components/providers/NextThemeProvider";
import "@gb/ui/globals.css";

export default function QuicksLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
					{children}
				</NextThemeProvider>
			</body>
		</html>
	);
}
