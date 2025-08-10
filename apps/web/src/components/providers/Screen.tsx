import QueryClientProvider from "@/components/providers/ReactQueryProvider";
import { ScreenProps } from "@/types/screen";
import NextThemeProvider from "@gb/ui/src/components/providers/NextThemeProvider";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const ScreenRootLayout = ({ children }: ScreenProps) => {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryClientProvider>
            <NextThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </NextThemeProvider>
          </QueryClientProvider>
        </body>
      </html>
    </>
  );
};
