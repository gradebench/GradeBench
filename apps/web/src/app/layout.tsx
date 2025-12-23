import type { ReactNode } from "react";
import { DefaultRootLayout } from "@/components/templates/layouts";

export default function RootLayout({ children }: { children: ReactNode }) {
	return <DefaultRootLayout>{children}</DefaultRootLayout>;
}
