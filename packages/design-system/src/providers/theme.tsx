import {
	ThemeProvider as NextThemeProvider,
	type ThemeProviderProps,
} from "next-themes";

export const ThemeProvider = ({
	children,
	...properties
}: ThemeProviderProps) => (
	<NextThemeProvider
		attribute="class"
		defaultTheme="system"
		disableTransitionOnChange
		enableSystem
		{...properties}
	>
		{children}
	</NextThemeProvider>
);
