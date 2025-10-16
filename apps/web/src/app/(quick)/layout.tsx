import { ScreenRootLayout } from "@/components/providers/Screen";
import "@gb/ui/globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return <ScreenRootLayout>{children}</ScreenRootLayout>;
};

export default RootLayout;
