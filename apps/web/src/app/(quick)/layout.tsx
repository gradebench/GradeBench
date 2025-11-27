import { DefaultRootLayout } from "@/components/templates/layouts";
import "@gb/ui/globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return <DefaultRootLayout>{children}</DefaultRootLayout>;
};

export default RootLayout;
