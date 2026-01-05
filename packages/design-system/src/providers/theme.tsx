import {
	ThemeProvider as NextThemeProvider,
	type ThemeProviderProps,
	useTheme,
} from "next-themes";

const ThemeProvider = ({ children, ...properties }: ThemeProviderProps) => (
	<NextThemeProvider
		attribute="class"
		defaultTheme="system"
		disableTransitionOnChange
		enableSystem
		storageKey="gradebench-theme"
		enableColorScheme
		{...properties}
	>
		{children}
	</NextThemeProvider>
);

export { ThemeProvider, useTheme };
