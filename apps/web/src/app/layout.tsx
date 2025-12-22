import { DefaultRootLayout } from "@/components/templates/layouts";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
	return <DefaultRootLayout>{children}</DefaultRootLayout>;
}
