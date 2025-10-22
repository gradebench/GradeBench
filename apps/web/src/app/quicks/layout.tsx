import { Toaster } from "@gb/ui/components/ui/sonner";
import { DefaultRootLayout } from "@/components/templates/layouts";
import "@gb/ui/globals.css";

const QuicksLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<DefaultRootLayout>
			{children}
			<Toaster />
		</DefaultRootLayout>
	);
};

export default QuicksLayout;
