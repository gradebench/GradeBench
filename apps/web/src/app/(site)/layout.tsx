import { SiteLayout } from "@/features/site/components/templates";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return <SiteLayout>{children}</SiteLayout>;
};

export default RootLayout;
