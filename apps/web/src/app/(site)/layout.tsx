import { SiteLayout } from "@/features/site/components/templates";
import "@gb/ui/globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return <SiteLayout>{children}</SiteLayout>;
};

export default RootLayout;
