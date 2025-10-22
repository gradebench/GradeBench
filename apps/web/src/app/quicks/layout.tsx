import { DefaultRootLayout } from "@/components/templates/layouts";
import "@gb/ui/globals.css";

const QuicksLayout = ({ children }: { children: React.ReactNode }) => {
	return <DefaultRootLayout>{children}</DefaultRootLayout>;
};

export default QuicksLayout;
