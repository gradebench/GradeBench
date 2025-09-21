"use client";

import { ThemeProvider } from "next-themes";
import type * as React from "react";

const NextThemeProvider = ({
	children,
	...props
}: React.ComponentProps<typeof ThemeProvider>) => {
	return <ThemeProvider {...props}>{children}</ThemeProvider>;
};

export default NextThemeProvider;
